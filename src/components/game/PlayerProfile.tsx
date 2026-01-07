import Image from 'next/image';

// ... (existing imports)

export default function PlayerProfile() {
    // ... (existing hooks)

    // ... (existing return)
    
            <div className="w-full max-w-md bg-black/60 border border-neon-pink/30 rounded-xl p-8 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {!address ? (
                    <div className="text-center text-gray-400">WALLET DISCONNECTED</div>
                ) : loading ? (
                    <div className="text-center text-neon-pink animate-pulse">DECRYPTING...</div>
                ) : (
                    <div className="space-y-6 font-mono">
                        <div className="text-center mb-6 flex flex-col items-center">
                             {profile?.pfpUrl ? (
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-neon-pink mb-4 shadow-[0_0_20px_rgba(188,19,254,0.5)]">
                                    <Image src={profile.pfpUrl} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                                </div>
                             ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-gray-600 mb-4 flex items-center justify-center">
                                    <span className="text-3xl">🚀</span>
                                </div>
                             )}
                            
                            <div className="text-xl text-white font-bold">{profile?.username || "Unknown Pilot"}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{address.slice(0, 6)}...{address.slice(-4)}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-neon-green">{profile?.lives || 0}</div>
                                <div className="text-xs text-gray-400 mt-1">LIVES REMAINING</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-neon-blue">{profile?.gamesPlayed || 0}</div>
                                <div className="text-xs text-gray-400 mt-1">SORTIES FLOWN</div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded text-center border border-neon-yellow/20">
                            <div className="text-4xl font-bold text-neon-yellow shadow-[0_0_15px_rgba(255,255,0,0.3)]">
                                {profile?.highScore ? profile.highScore.toLocaleString() : 0}
                            </div>
                            <div className="text-sm text-gray-400 mt-2 uppercase tracking-widest">Personal Best Score</div>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={() => setGameState('MENU')}
                className="mt-8 px-8 py-3 bg-transparent border border-gray-500 text-gray-300 rounded hover:border-white hover:text-white transition-all"
            >
                RETURN TO BASE
            </button>
        </div >
    );
}
