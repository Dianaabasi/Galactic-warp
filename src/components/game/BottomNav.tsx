'use client';

import Image from 'next/image';
import { useGame } from '@/context/GameContext';
import { useFarcaster } from '@/components/FarcasterProvider';

export default function BottomNav() {
    const { gameState, setGameState } = useGame();
    const { user: farcasterUser } = useFarcaster() || {};

    return (
        <div className="fixed bottom-0 left-0 w-full h-16 bg-black/90 backdrop-blur-md border-t border-gray-800 flex justify-around items-center z-50">
            {/* Home */}
            <button
                onClick={() => setGameState('MENU')}
                className={`flex flex-col items-center gap-1 transition-colors ${gameState === 'MENU' ? 'text-neon-green' : 'text-gray-400 hover:text-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span className="text-xs font-mono">Home</span>
            </button>

            {/* Rank */}
            <button
                onClick={() => setGameState('LEADERBOARD')}
                className={`flex flex-col items-center gap-1 transition-colors ${gameState === 'LEADERBOARD' ? 'text-neon-blue' : 'text-gray-400 hover:text-white'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
                <span className="text-xs font-mono">Rank</span>
            </button>

            {/* Profile */}
            <button
                onClick={() => setGameState('PROFILE')}
                className={`flex flex-col items-center gap-1 transition-colors ${gameState === 'PROFILE' ? 'text-neon-pink' : 'text-gray-400 hover:text-white'}`}
            >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-current">
                    {farcasterUser?.pfpUrl ? (
                        <Image
                            src={farcasterUser.pfpUrl}
                            alt="Profile"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full p-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    )}
                </div>
                <span className="text-xs font-mono">Profile</span>
            </button>
        </div>
    );
}
