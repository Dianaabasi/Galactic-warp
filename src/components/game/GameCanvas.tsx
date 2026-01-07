'use client';

import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/context/GameContext';

// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 10;
const ENEMY_SPEED = 2;

interface Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    vx?: number;
    vy?: number;
    hp?: number;
    type?: string;
}

export default function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { lives, score, addScore, takeDamage, mission } = useGame();

    // UI State
    const [wave, setWave] = useState(1);

    // Game State Refs (for loop performance)
    const playerRef = useRef<Entity>({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, width: 40, height: 40 });
    const bulletsRef = useRef<Entity[]>([]);
    const enemiesRef = useRef<Entity[]>([]);
    const keysRef = useRef<{ [key: string]: boolean }>({});
    const frameRef = useRef<number>(0);
    const waveRef = useRef(1); // Logic ref

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle Resize
        const resize = () => {
            // Keep aspect ratio
            const scale = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
            canvas.style.width = `${CANVAS_WIDTH * scale}px`;
            canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
        };
        window.addEventListener('resize', resize);
        resize();

        // Input Handling
        const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Initial Spawn
        const spawnEnemy = () => {
            enemiesRef.current.push({
                x: Math.random() * (CANVAS_WIDTH - 40),
                y: -40,
                width: 40,
                height: 40,
                hp: 1,
                type: 'basic'
            });
        };

        // Game Loop
        let animationId: number;
        // let lastTime = 0; // Unused
        const enemySpawnRate = mission === 1 ? 2000 : mission === 2 ? 1500 : 1000;
        let lastSpawn = 0;

        const gameLoop = (timestamp: number) => {
            // Clear Canvas
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // --- UPDATE ---

            // Wave Logic
            if (frameRef.current % 1000 === 0 && frameRef.current > 0) {
                waveRef.current++;
                setWave(waveRef.current); // Sync UI
            }

            // Player Movement
            const player = playerRef.current;
            if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) player.x -= PLAYER_SPEED;
            if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) player.x += PLAYER_SPEED;
            if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) player.y -= PLAYER_SPEED;
            if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) player.y += PLAYER_SPEED;

            // Boundaries
            player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x));
            player.y = Math.max(0, Math.min(CANVAS_HEIGHT - player.height, player.y));

            // Shooting
            if (keysRef.current['Space'] && frameRef.current % 10 === 0) { // Simple fire rate
                bulletsRef.current.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, vy: -BULLET_SPEED });
            }

            // Spawning
            if (timestamp - lastSpawn > Math.max(500, enemySpawnRate - (waveRef.current * 100))) {
                spawnEnemy();
                lastSpawn = timestamp;
            }

            // Update Bullets
            bulletsRef.current.forEach(b => {
                if (b.vy) b.y += b.vy;
            });
            bulletsRef.current = bulletsRef.current.filter(b => b.y > -20);

            // Update Enemies
            enemiesRef.current.forEach(e => {
                e.y += ENEMY_SPEED + (waveRef.current * 0.2);
            });

            // Collision Detection
            // Bullet vs Enemy
            bulletsRef.current.forEach((b, bIdx) => {
                enemiesRef.current.forEach((e, eIdx) => {
                    if (b.x < e.x + e.width && b.x + b.width > e.x &&
                        b.y < e.y + e.height && b.y + b.height > e.y) {
                        // Hit
                        enemiesRef.current.splice(eIdx, 1);
                        bulletsRef.current.splice(bIdx, 1);
                        addScore(100);
                    }
                });
            });

            // Enemy vs Player
            enemiesRef.current.forEach((e, eIdx) => {
                if (e.x < player.x + player.width && e.x + e.width > player.x &&
                    e.y < player.y + player.height && e.y + e.height > player.y) {
                    enemiesRef.current.splice(eIdx, 1);
                    takeDamage();
                }
                // Remove if off screen
                if (e.y > CANVAS_HEIGHT) {
                    enemiesRef.current.splice(eIdx, 1);
                }
            });


            // --- DRAW ---

            // Player
            ctx.fillStyle = '#00f3ff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00f3ff';
            ctx.beginPath();
            ctx.moveTo(player.x + player.width / 2, player.y);
            ctx.lineTo(player.x + player.width, player.y + player.height);
            ctx.lineTo(player.x, player.y + player.height);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Bullets
            ctx.fillStyle = '#ff00ff';
            bulletsRef.current.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

            // Enemies
            ctx.fillStyle = '#ff3333';
            enemiesRef.current.forEach(e => {
                ctx.fillRect(e.x, e.y, e.width, e.height);
            });

            frameRef.current++;
            animationId = requestAnimationFrame(gameLoop);
        };

        animationId = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [lives, mission, addScore, takeDamage]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent z-10 relative">
            <div className="absolute top-4 left-4 text-white font-mono z-20 bg-black/50 p-2 rounded pointer-events-none">
                <div>LIVES: {lives}</div>
                <div>SCORE: {score}</div>
                <div>WAVE: {wave}</div>
                <div>MISSION: {mission}</div>
            </div>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border-2 border-neon-blue rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.2)] bg-black/30 backdrop-blur-sm"
            />
            {/* Mobile Controls Overlay */}
            <div className="fixed bottom-10 left-10 md:hidden z-30 grid grid-cols-3 gap-2">
                <div />
                <button
                    className="w-14 h-14 bg-neon-blue/40 rounded-lg active:bg-neon-blue/80 flex items-center justify-center text-2xl border border-neon-blue/50"
                    onTouchStart={(e) => { e.preventDefault(); keysRef.current['ArrowUp'] = true }}
                    onTouchEnd={(e) => { e.preventDefault(); keysRef.current['ArrowUp'] = false }}
                >
                    ▲
                </button>
                <div />
                <button
                    className="w-14 h-14 bg-neon-blue/40 rounded-lg active:bg-neon-blue/80 flex items-center justify-center text-2xl border border-neon-blue/50"
                    onTouchStart={(e) => { e.preventDefault(); keysRef.current['ArrowLeft'] = true }}
                    onTouchEnd={(e) => { e.preventDefault(); keysRef.current['ArrowLeft'] = false }}
                >
                    ◀
                </button>
                <button
                    className="w-14 h-14 bg-neon-blue/40 rounded-lg active:bg-neon-blue/80 flex items-center justify-center text-2xl border border-neon-blue/50"
                    onTouchStart={(e) => { e.preventDefault(); keysRef.current['ArrowDown'] = true }}
                    onTouchEnd={(e) => { e.preventDefault(); keysRef.current['ArrowDown'] = false }}
                >
                    ▼
                </button>
                <button
                    className="w-14 h-14 bg-neon-blue/40 rounded-lg active:bg-neon-blue/80 flex items-center justify-center text-2xl border border-neon-blue/50"
                    onTouchStart={(e) => { e.preventDefault(); keysRef.current['ArrowRight'] = true }}
                    onTouchEnd={(e) => { e.preventDefault(); keysRef.current['ArrowRight'] = false }}
                >
                    ▶
                </button>
            </div>

            <div className="fixed bottom-10 right-10 flex gap-4 md:hidden z-30">
                <button
                    className="w-20 h-20 bg-neon-pink/50 rounded-full active:bg-neon-pink/80 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(255,0,255,0.5)] border-2 border-neon-pink"
                    onTouchStart={(e) => { e.preventDefault(); keysRef.current['Space'] = true }}
                    onTouchEnd={(e) => { e.preventDefault(); keysRef.current['Space'] = false }}
                >
                    🔥
                </button>
            </div>
        </div>
    );
}
