'use client';

import Image from 'next/image';


import { useGame } from '@/context/GameContext';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { DEV_WALLET_ADDRESS, TICKET_PRICE } from '@/constants';

export default function LandingScreen() {
    const { lives, mintTicket, setGameState } = useGame();
    const { isConnected } = useAccount();
    const { sendTransaction, isPending } = useSendTransaction({
        mutation: {
            onSuccess: () => {
                mintTicket();
            },
            onError: (error) => {
                console.error("Mint failed:", error);
                // Optional: Show error toast
            }
        }
    });

    const handleMint = () => {
        if (!isConnected) return;
        sendTransaction({
            to: DEV_WALLET_ADDRESS as `0x${string}`,
            value: parseEther(TICKET_PRICE),
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen z-10 relative">
            <div className="mb-8 animate-pulse-slow">
                <Image
                    src="/logo.png"
                    alt="Galactic Warp Logo"
                    width={400}
                    height={400}
                    className="object-contain drop-shadow-[0_0_30px_rgba(0,243,255,0.4)]"
                    priority
                />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink mb-12 tracking-tighter drop-shadow-lg text-center px-4">
                GALACTIC WARP
            </h1>

            <div className="flex flex-col gap-6 items-center w-full max-w-md">
                {isConnected ? (
                    lives > 0 ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="text-2xl text-neon-green font-mono">
                                TICKET VALID • {lives} LIVES REMAINING
                            </div>
                            <button
                                onClick={() => setGameState('MISSION_SELECT')}
                                className="w-full py-4 bg-neon-blue text-black font-bold text-xl rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                            >
                                ENTER THE VOID
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="text-xl text-red-500 font-mono animate-bounce">
                                NO TICKET DETECTED
                            </div>
                            <button
                                onClick={handleMint}
                                disabled={isPending}
                                className="w-full py-4 bg-transparent border-2 border-neon-pink text-neon-pink font-bold text-xl rounded-full hover:bg-neon-pink hover:text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(188,19,254,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? 'MINTING...' : `MINT TICKET (${TICKET_PRICE} ETH)`}
                            </button>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-gray-400">Connect wallet to begin</p>
                        <ConnectWallet className="bg-white text-black px-6 py-2 rounded-lg font-bold" />
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 w-full mt-4">
                    <button
                        onClick={() => setGameState('LEADERBOARD')}
                        className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-neon-blue hover:text-neon-blue transition-colors"
                    >
                        LEADERBOARD
                    </button>
                    <button
                        onClick={() => setGameState('PROFILE')}
                        className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-neon-pink hover:text-neon-pink transition-colors"
                    >
                        PROFILE
                    </button>
                </div>
            </div>


            <div className="absolute bottom-8 text-gray-500 text-sm font-mono">
                POWERED BY BASE • FARCASTER FRAME COMPATIBLE
            </div>
        </div>
    );
}
