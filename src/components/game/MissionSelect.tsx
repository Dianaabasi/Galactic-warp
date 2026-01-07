'use client';
import { useGame } from '@/context/GameContext';

const MISSIONS = [
    { id: 1, name: 'Nebula Run', difficulty: 'Easy', desc: 'Space training. Slow enemies.' },
    { id: 2, name: 'Meteor Storm', difficulty: 'Medium', desc: 'Dodge falling meteors!' },
    { id: 3, name: 'Pirate Ambush', difficulty: 'Hard', desc: 'Elite enemies and Bosses.' },
];

export default function MissionSelect() {
    const { startGame } = useGame();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen z-10 relative bg-black/50 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-neon-blue mb-12 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
                SELECT MISSION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-4">
                {MISSIONS.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => startGame(m.id)}
                        className="p-8 border-2 border-neon-blue/50 rounded-xl hover:border-neon-blue hover:bg-neon-blue/10 hover:scale-105 transition-all flex flex-col items-center gap-4 group backdrop-blur-md"
                    >
                        <div className="text-5xl mb-2">
                            {m.id === 1 ? '🛸' : m.id === 2 ? '☄️' : '☠️'}
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-neon-pink transition-colors">
                            {m.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${m.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                m.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                            }`}>
                            {m.difficulty}
                        </span>
                        <p className="text-gray-400 text-center text-sm">{m.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
