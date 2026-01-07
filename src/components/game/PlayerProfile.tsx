'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGame } from '@/context/GameContext';
import { useAccount } from 'wagmi';
import { getUserProfile, UserProfile } from '@/lib/db';
import { useFarcaster } from '@/components/FarcasterProvider';
import BottomNav from './BottomNav';

export default function PlayerProfile() {
    const { setGameState } = useGame();
    const { address } = useAccount();
    const { user: farcasterUser } = useFarcaster() || {};
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Use Farcaster data first, fallback to DB
    const displayName = farcasterUser?.username || profile?.username || "Unknown Pilot";
    const displayPfp = farcasterUser?.pfpUrl || profile?.pfpUrl;

    useEffect(() => {
        const fetchProfile = async () => {
            if (address) {
                try {
                    const data = await getUserProfile(address);
                    setProfile(data);
                } catch (error) {
                    console.error("Error fetching profile", error);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, [address]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen z-10 relative p-8 pb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-neon-pink mb-8 tracking-widest drop-shadow-[0_0_10px_rgba(188,19,254,0.8)]">
                PILOT DOSSIER
            </h2>

            <div className="w-full max-w-md bg-black/60 border border-neon-pink/30 rounded-xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {!address ? (
                    <div className="text-center text-gray-400">WALLET DISCONNECTED</div>
                ) : loading ? (
                    <div className="text-center text-neon-pink animate-pulse">DECRYPTING...</div>
                ) : (
                    <div className="space-y-6 font-mono">
                        <div className="text-center mb-6 flex flex-col items-center">
                            {displayPfp ? (
                                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-neon-pink mb-4 shadow-[0_0_20px_rgba(188,19,254,0.5)]">
                                    <Image src={displayPfp} alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-800 border-4 border-gray-600 mb-4 flex items-center justify-center">
                                    <span className="text-3xl">🚀</span>
                                </div>
                            )}

                            <div className="text-xl text-white font-bold">{displayName}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{address.slice(0, 6)}...{address.slice(-4)}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-neon-green">{profile?.lives || 0}</div>
                                <div className="text-xs text-gray-400 mt-1">LIVES</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-neon-blue">{profile?.gamesPlayed || 0}</div>
                                <div className="text-xs text-gray-400 mt-1">GAMES</div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded text-center border border-neon-yellow/20">
                            <div className="text-3xl font-bold text-neon-yellow">
                                {profile?.highScore ? profile.highScore.toLocaleString() : 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest">High Score</div>
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
