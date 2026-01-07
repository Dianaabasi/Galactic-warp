'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { getLeaderboard, ScoreEntry } from '@/lib/db';

export default function Leaderboard() {
    const { setGameState } = useGame();
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const data = await getLeaderboard();
                setScores(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen z-10 relative p-8">
            <h2 className="text-4xl font-bold text-neon-blue mb-8 tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
                GALACTIC RANKINGS
            </h2>

            <div className="w-full max-w-2xl bg-black/60 border border-neon-blue/30 rounded-xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {loading ? (
                    <div className="text-center text-neon-blue animate-pulse">TRANSMITTING DATA...</div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 text-neon-pink font-mono text-sm border-b border-gray-700 pb-2">
                            <span className="col-span-1">RANK</span>
                            <span className="col-span-2">PILOT</span>
                            <span className="col-span-1 text-right">SCORE</span>
                        </div>
                        {scores.map((entry, index) => (
                            <div key={entry.id} className="grid grid-cols-4 font-mono text-white text-lg items-center hover:bg-white/5 p-2 rounded transition-colors">
                                <span className="col-span-1 text-gray-400">#{index + 1}</span>
                                <span className="col-span-2 truncate opacity-90" title={entry.walletAddress}>
                                    {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                                </span>
                                <span className="col-span-1 text-right text-neon-green font-bold">
                                    {entry.score.toLocaleString()}
                                </span>
                            </div>
                        ))}

                        {scores.length === 0 && (
                            <div className="text-center text-gray-500 py-8">NO FLIGHT RECORDS FOUND</div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={() => setGameState('MENU')}
                className="mt-8 px-8 py-3 bg-transparent border border-gray-500 text-gray-300 rounded hover:border-white hover:text-white transition-all"
            >
                RETURN TO BASE
            </button>
        </div>
    );
}
