'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGame } from '@/context/GameContext';
import { getLeaderboard, ScoreEntry } from '@/lib/db';
import BottomNav from './BottomNav';

export default function Leaderboard() {
    const { setGameState } = useGame();
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const data = await getLeaderboard();

                // De-duplicate: keep only highest score per wallet
                const uniqueScores = new Map<string, ScoreEntry>();
                data.forEach(entry => {
                    const existing = uniqueScores.get(entry.walletAddress);
                    if (!existing || entry.score > existing.score) {
                        uniqueScores.set(entry.walletAddress, entry);
                    }
                });

                // Convert back to array and sort
                const sorted = Array.from(uniqueScores.values())
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 20);

                setScores(sorted);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen z-10 relative p-4 pt-8 pb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-neon-blue mb-6 tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
                RANKINGS
            </h2>

            <div className="w-full max-w-lg bg-black/60 border border-neon-blue/30 rounded-xl p-4 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {loading ? (
                    <div className="text-center text-neon-blue animate-pulse py-8">TRANSMITTING DATA...</div>
                ) : (
                    <div className="space-y-2">
                        <div className="grid grid-cols-12 text-neon-pink font-mono text-xs border-b border-gray-700 pb-2 px-2">
                            <span className="col-span-2">#</span>
                            <span className="col-span-7">PILOT</span>
                            <span className="col-span-3 text-right">SCORE</span>
                        </div>
                        {scores.map((entry, index) => (
                            <div key={entry.id} className="grid grid-cols-12 font-mono text-white text-sm items-center hover:bg-white/5 p-2 rounded transition-colors">
                                <span className={`col-span-2 font-bold ${index < 3 ? 'text-neon-yellow' : 'text-gray-400'}`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </span>
                                <div className="col-span-7 flex items-center gap-2 overflow-hidden">
                                    {entry.pfpUrl ? (
                                        <Image src={entry.pfpUrl} alt="PFP" width={24} height={24} className="rounded-full flex-shrink-0" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-700 flex-shrink-0" />
                                    )}
                                    <span className="truncate text-xs">
                                        {entry.username || `${entry.walletAddress.slice(0, 4)}...${entry.walletAddress.slice(-4)}`}
                                    </span>
                                </div>
                                <span className="col-span-3 text-right text-neon-green font-bold text-xs">
                                    {entry.score.toLocaleString()}
                                </span>
                            </div>
                        ))}

                        {scores.length === 0 && (
                            <div className="text-center text-gray-500 py-8">NO RECORDS FOUND</div>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
