'use client';

import { useGame } from '@/context/GameContext';
import LandingScreen from './LandingScreen';
import MissionSelect from './MissionSelect';
import GameCanvas from './GameCanvas';

import Leaderboard from './Leaderboard';
import PlayerProfile from './PlayerProfile';

export default function GameContainer() {
    const { gameState, resetGame } = useGame();

    switch (gameState) {
        case 'MENU':
            return <LandingScreen />;
        case 'PLAYING':
            return <GameCanvas />;
        case 'GAME_OVER':
            // Logic handled by GameCanvas or custom component. 
            // If GameContext sets GAME_OVER, ideally we might want to still show canvas in background or separate screen
            return <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-20 bg-black/80">
                <h1 className="text-6xl font-black text-red-500 mb-8 tracking-widest drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]">GAME OVER</h1>
                <button
                    onClick={resetGame}
                    className="px-8 py-4 bg-neon-blue text-black rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                >
                    HOME
                </button>
            </div>;
        case 'VICTORY':
            return <div className="text-white text-center mt-32">VICTORY (Placeholder)</div>;
        case 'MISSION_SELECT':
            return <MissionSelect />;
        case 'LEADERBOARD':
            return <Leaderboard />;
        case 'PROFILE':
            return <PlayerProfile />;
        default:
            return <LandingScreen />;
    }
}
