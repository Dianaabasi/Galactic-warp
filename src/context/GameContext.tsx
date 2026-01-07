'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getUserProfile, saveGameResult, addLives } from '@/lib/db';
import { useFarcaster } from '@/components/FarcasterProvider';

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER' | 'VICTORY' | 'MISSION_SELECT' | 'LEADERBOARD' | 'PROFILE';

interface GameContextType {
    gameState: GameState;
    score: number;
    lives: number;
    mission: number;
    setGameState: (state: GameState) => void;
    startGame: (missionId: number) => void;
    addScore: (points: number) => void;
    takeDamage: () => void;
    resetGame: () => void;
    mintTicket: () => void;
    exitGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const { address } = useAccount();
    const { user: farcasterUser } = useFarcaster() || {};

    const [gameState, setGameState] = useState<GameState>('MENU');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(0);
    const [mission, setMission] = useState(1);

    // Sync Profile on Load
    useEffect(() => {
        const syncProfile = async () => {
            if (address) {
                const profile = await getUserProfile(address);
                if (profile) {
                    setLives(profile.lives);
                }
            } else {
                setLives(0);
            }
        };
        syncProfile();
    }, [address]);

    const startGame = async (missionId: number) => {
        if (lives <= 0) return;
        setMission(missionId);
        setScore(0);
        setGameState('PLAYING');
    };

    const mintTicket = async () => {
        // Optimistic update
        setLives(5);
        if (address) {
            await addLives(address, 5);
        }
    };

    const addScore = (points: number) => {
        setScore((prev) => prev + points);
    };

    const handleGameOver = async () => {
        setGameState('GAME_OVER');
        if (address) {
            await saveGameResult(address, score, {
                username: farcasterUser?.username,
                pfpUrl: farcasterUser?.pfpUrl
            });
            // Sync 0 lives to DB to invalidate ticket
            await addLives(address, 0);
        }
    };

    const takeDamage = () => {
        setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
                handleGameOver();
                return 0;
            }
            return newLives;
        });
    };

    const resetGame = () => {
        setGameState('MENU');
        setScore(0);
    };

    const exitGame = async () => {
        // Save score before exiting
        if (address && score > 0) {
            await saveGameResult(address, score, {
                username: farcasterUser?.username,
                pfpUrl: farcasterUser?.pfpUrl
            });
        }
        setGameState('MENU');
        setScore(0);
    };

    return (
        <GameContext.Provider
            value={{
                gameState,
                score,
                lives,
                mission,
                setGameState,
                startGame,
                addScore,
                takeDamage,
                resetGame,
                mintTicket,
                exitGame,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
