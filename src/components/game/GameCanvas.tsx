'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { Player, Enemy, Bullet, Meteor, PowerUp, PowerUpType } from '@/lib/gameTypes';
import { ASSETS, getImage, preloadMissionAssets, audioManager } from '@/lib/gameAssets';
import { getMissionConfig } from '@/lib/missionConfig';

// Constants
const PLAYER_SPEED = 6;
const BULLET_SPEED = 12;
const PLAYER_SIZE = 50;
const ENEMY_SIZE = 40;
const BULLET_WIDTH = 9;
const BULLET_HEIGHT = 37;
const AUTO_FIRE_RATE = 12; // frames between shots
const RAPID_FIRE_RATE = 6;

export default function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { lives, score, addScore, takeDamage, mission, setGameState } = useGame();

    // Canvas dimensions
    const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });
    const [wave, setWave] = useState(1);
    const [loading, setLoading] = useState(true);

    // Game state refs
    const playerRef = useRef<Player>({
        x: 0, y: 0, width: PLAYER_SIZE, height: PLAYER_SIZE,
        invincible: false, invincibleUntil: 0,
        rapidFire: false, rapidFireUntil: 0,
        tripleLaser: false, tripleLaserUntil: 0,
    });
    const bulletsRef = useRef<Bullet[]>([]);
    const enemiesRef = useRef<Enemy[]>([]);
    const meteorsRef = useRef<Meteor[]>([]);
    const powerUpsRef = useRef<PowerUp[]>([]);
    const keysRef = useRef<{ [key: string]: boolean }>({});
    const frameRef = useRef(0);
    const waveRef = useRef(1);
    const lastEnemySpawn = useRef(0);
    const lastMeteorSpawn = useRef(0);
    const touchPosRef = useRef<{ x: number; y: number } | null>(null);
    const frozenUntilRef = useRef(0);

    const config = getMissionConfig(mission);

    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setCanvasSize({ width, height });

            // Center player on resize
            playerRef.current.x = width / 2 - PLAYER_SIZE / 2;
            playerRef.current.y = height - 100;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Preload assets
    useEffect(() => {
        const load = async () => {
            try {
                await preloadMissionAssets(mission);
                await audioManager.preload();
                setLoading(false);
            } catch (e) {
                console.error('Failed to load assets', e);
                setLoading(false);
            }
        };
        load();
    }, [mission]);

    // Spawn functions
    const spawnEnemy = useCallback((timestamp: number) => {
        const isBossWave = config.hasBoss && waveRef.current % config.bossWaveInterval === 0;
        const spriteIdx = Math.floor(Math.random() * config.enemySprites.length);

        const enemy: Enemy = {
            x: Math.random() * (canvasSize.width - ENEMY_SIZE),
            y: -ENEMY_SIZE,
            width: isBossWave ? ENEMY_SIZE * 2 : ENEMY_SIZE,
            height: isBossWave ? ENEMY_SIZE * 2 : ENEMY_SIZE,
            hp: isBossWave ? 10 : 1,
            maxHp: isBossWave ? 10 : 1,
            type: isBossWave ? 'boss' : config.enemyShootChance > 0 ? 'shooter' : 'basic',
            sprite: config.enemySprites[spriteIdx],
            canShoot: config.enemyShootChance > 0,
            lastShot: timestamp,
            shootInterval: 2000,
            frozen: false,
            frozenUntil: 0,
        };
        enemiesRef.current.push(enemy);
    }, [config, canvasSize.width]);

    const spawnMeteor = useCallback(() => {
        const spriteIdx = Math.floor(Math.random() * ASSETS.meteors.length);
        const size = 30 + Math.random() * 40;

        const meteor: Meteor = {
            x: Math.random() * (canvasSize.width - size),
            y: -size,
            width: size,
            height: size,
            vy: 2 + Math.random() * 2,
            sprite: ASSETS.meteors[spriteIdx],
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
        };
        meteorsRef.current.push(meteor);
    }, [canvasSize.width]);

    const spawnPowerUp = useCallback((x: number, y: number) => {
        if (Math.random() > config.powerUpDropRate) return;

        const types: PowerUpType[] = ['TRIPLE_LASER', 'FREEZE', 'INVINCIBILITY', 'RAPID_FIRE', 'EXTRA_LIFE'];
        const type = types[Math.floor(Math.random() * types.length)];

        const powerUp: PowerUp = {
            x, y,
            width: 25,
            height: 25,
            vy: 1.5,
            type,
            sprite: ASSETS.powerUps[type],
        };
        powerUpsRef.current.push(powerUp);
    }, [config.powerUpDropRate]);

    // Apply power-up effect
    const applyPowerUp = useCallback((type: PowerUpType, timestamp: number) => {
        audioManager.play('powerUp');
        const player = playerRef.current;

        switch (type) {
            case 'TRIPLE_LASER':
                player.tripleLaser = true;
                player.tripleLaserUntil = timestamp + 5000;
                break;
            case 'FREEZE':
                frozenUntilRef.current = timestamp + 2000;
                break;
            case 'INVINCIBILITY':
                player.invincible = true;
                player.invincibleUntil = timestamp + 3000;
                break;
            case 'RAPID_FIRE':
                player.rapidFire = true;
                player.rapidFireUntil = timestamp + 5000;
                break;
            case 'EXTRA_LIFE':
                // Handled by context
                break;
        }
    }, []);

    // Collision detection
    const checkCollision = (a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) => {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    };

    // Main game loop
    useEffect(() => {
        if (loading) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Input handlers
        const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchPosRef.current = { x: touch.clientX, y: touch.clientY };
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            if (!touchPosRef.current) return;
            const touch = e.touches[0];
            const dx = touch.clientX - touchPosRef.current.x;
            const dy = touch.clientY - touchPosRef.current.y;
            playerRef.current.x += dx;
            playerRef.current.y += dy;
            touchPosRef.current = { x: touch.clientX, y: touch.clientY };
        };

        const handleTouchEnd = () => {
            touchPosRef.current = null;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);

        let animationId: number;

        const gameLoop = (timestamp: number) => {
            const player = playerRef.current;
            const isFrozen = timestamp < frozenUntilRef.current;

            // --- UPDATE ---

            // Check power-up expirations
            if (player.invincibleUntil && timestamp > player.invincibleUntil) player.invincible = false;
            if (player.rapidFireUntil && timestamp > player.rapidFireUntil) player.rapidFire = false;
            if (player.tripleLaserUntil && timestamp > player.tripleLaserUntil) player.tripleLaser = false;

            // Wave progression
            if (frameRef.current > 0 && frameRef.current % 600 === 0) {
                waveRef.current++;
                setWave(waveRef.current);
            }

            // Keyboard movement
            if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) player.x -= PLAYER_SPEED;
            if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) player.x += PLAYER_SPEED;
            if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) player.y -= PLAYER_SPEED;
            if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) player.y += PLAYER_SPEED;

            // Boundaries
            player.x = Math.max(0, Math.min(canvasSize.width - player.width, player.x));
            player.y = Math.max(0, Math.min(canvasSize.height - player.height, player.y));

            // Auto-shoot
            const fireRate = player.rapidFire ? RAPID_FIRE_RATE : AUTO_FIRE_RATE;
            if (frameRef.current % fireRate === 0) {
                audioManager.play('laser');
                const baseX = player.x + player.width / 2 - BULLET_WIDTH / 2;
                const baseY = player.y;

                bulletsRef.current.push({
                    x: baseX, y: baseY,
                    width: BULLET_WIDTH, height: BULLET_HEIGHT,
                    vy: -BULLET_SPEED,
                    fromPlayer: true,
                    damage: 1,
                });

                if (player.tripleLaser) {
                    bulletsRef.current.push({
                        x: baseX - 15, y: baseY + 10,
                        width: BULLET_WIDTH, height: BULLET_HEIGHT,
                        vy: -BULLET_SPEED, vx: -1,
                        fromPlayer: true,
                        damage: 1,
                    });
                    bulletsRef.current.push({
                        x: baseX + 15, y: baseY + 10,
                        width: BULLET_WIDTH, height: BULLET_HEIGHT,
                        vy: -BULLET_SPEED, vx: 1,
                        fromPlayer: true,
                        damage: 1,
                    });
                }
            }

            // Spawn enemies
            const spawnRate = Math.max(500, config.enemySpawnRate - waveRef.current * 50);
            if (timestamp - lastEnemySpawn.current > spawnRate) {
                spawnEnemy(timestamp);
                lastEnemySpawn.current = timestamp;
            }

            // Spawn meteors (Mission 2)
            if (config.hasMeteors && timestamp - lastMeteorSpawn.current > config.meteorSpawnRate) {
                spawnMeteor();
                lastMeteorSpawn.current = timestamp;
            }

            // Update bullets
            bulletsRef.current.forEach(b => {
                if (b.vy) b.y += b.vy;
                if (b.vx) b.x += b.vx;
            });
            bulletsRef.current = bulletsRef.current.filter(b => b.y > -50 && b.y < canvasSize.height + 50);

            // Update enemies
            if (!isFrozen) {
                enemiesRef.current.forEach(e => {
                    e.y += config.enemySpeed + waveRef.current * config.waveSpeedIncrease;

                    // Enemy shooting (Mission 2 & 3)
                    if (e.canShoot && timestamp - e.lastShot > e.shootInterval) {
                        if (Math.random() < config.enemyShootChance) {
                            bulletsRef.current.push({
                                x: e.x + e.width / 2 - 4, y: e.y + e.height,
                                width: 8, height: 20,
                                vy: 5,
                                fromPlayer: false,
                                damage: 1,
                            });
                            e.lastShot = timestamp;
                        }
                    }
                });
            }

            // Update meteors
            meteorsRef.current.forEach(m => {
                m.y += m.vy!;
                m.rotation += m.rotationSpeed;
            });
            meteorsRef.current = meteorsRef.current.filter(m => m.y < canvasSize.height + 100);

            // Update power-ups
            powerUpsRef.current.forEach(p => {
                p.y += p.vy!;
            });
            powerUpsRef.current = powerUpsRef.current.filter(p => p.y < canvasSize.height + 50);

            // Collision: Player bullets vs Enemies
            for (let bi = bulletsRef.current.length - 1; bi >= 0; bi--) {
                const b = bulletsRef.current[bi];
                if (!b.fromPlayer) continue;

                for (let ei = enemiesRef.current.length - 1; ei >= 0; ei--) {
                    const e = enemiesRef.current[ei];
                    if (checkCollision(b, e)) {
                        audioManager.play('hit');
                        e.hp -= b.damage;
                        bulletsRef.current.splice(bi, 1);

                        if (e.hp <= 0) {
                            const points = e.type === 'boss' ? 500 : 100;
                            addScore(points);
                            spawnPowerUp(e.x, e.y);
                            enemiesRef.current.splice(ei, 1);
                        }
                        break;
                    }
                }
            }

            // Collision: Enemy bullets vs Player
            if (!player.invincible) {
                for (let bi = bulletsRef.current.length - 1; bi >= 0; bi--) {
                    const b = bulletsRef.current[bi];
                    if (b.fromPlayer) continue;

                    if (checkCollision(b, player)) {
                        audioManager.play('damage');
                        bulletsRef.current.splice(bi, 1);
                        takeDamage();
                        break;
                    }
                }
            }

            // Collision: Enemies vs Player
            if (!player.invincible) {
                for (let ei = enemiesRef.current.length - 1; ei >= 0; ei--) {
                    const e = enemiesRef.current[ei];
                    if (checkCollision(e, player)) {
                        audioManager.play('damage');
                        enemiesRef.current.splice(ei, 1);
                        takeDamage();
                        break;
                    }
                }
            }

            // Collision: Meteors vs Player
            if (!player.invincible) {
                for (let mi = meteorsRef.current.length - 1; mi >= 0; mi--) {
                    const m = meteorsRef.current[mi];
                    if (checkCollision(m, player)) {
                        audioManager.play('damage');
                        meteorsRef.current.splice(mi, 1);
                        takeDamage();
                        break;
                    }
                }
            }

            // Collision: Power-ups vs Player
            for (let pi = powerUpsRef.current.length - 1; pi >= 0; pi--) {
                const p = powerUpsRef.current[pi];
                if (checkCollision(p, player)) {
                    applyPowerUp(p.type, timestamp);
                    powerUpsRef.current.splice(pi, 1);
                }
            }

            // Remove off-screen enemies
            enemiesRef.current = enemiesRef.current.filter(e => e.y < canvasSize.height + 50);

            // --- DRAW ---
            ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

            // Draw player
            const playerImg = getImage(config.playerShip);
            if (playerImg) {
                ctx.save();
                if (player.invincible && frameRef.current % 10 < 5) {
                    ctx.globalAlpha = 0.5;
                }
                ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
                ctx.restore();
            }

            // Draw bullets
            const laserImg = getImage(config.playerLaser);
            const enemyLaserImg = getImage(config.enemyLaser);
            bulletsRef.current.forEach(b => {
                const img = b.fromPlayer ? laserImg : enemyLaserImg;
                if (img) {
                    ctx.drawImage(img, b.x, b.y, b.width, b.height);
                } else {
                    ctx.fillStyle = b.fromPlayer ? '#00ffff' : '#ff0000';
                    ctx.fillRect(b.x, b.y, b.width, b.height);
                }
            });

            // Draw enemies
            enemiesRef.current.forEach(e => {
                const img = getImage(e.sprite);
                if (img) {
                    ctx.drawImage(img, e.x, e.y, e.width, e.height);

                    // Boss HP bar
                    if (e.type === 'boss') {
                        ctx.fillStyle = '#333';
                        ctx.fillRect(e.x, e.y - 10, e.width, 5);
                        ctx.fillStyle = '#ff0000';
                        ctx.fillRect(e.x, e.y - 10, e.width * (e.hp / e.maxHp), 5);
                    }
                }
            });

            // Draw meteors
            meteorsRef.current.forEach(m => {
                const img = getImage(m.sprite);
                if (img) {
                    ctx.save();
                    ctx.translate(m.x + m.width / 2, m.y + m.height / 2);
                    ctx.rotate(m.rotation);
                    ctx.drawImage(img, -m.width / 2, -m.height / 2, m.width, m.height);
                    ctx.restore();
                }
            });

            // Draw power-ups
            powerUpsRef.current.forEach(p => {
                const img = getImage(p.sprite);
                if (img) {
                    ctx.drawImage(img, p.x, p.y, p.width, p.height);
                }
            });

            // Draw freeze effect
            if (isFrozen) {
                ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
                ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
            }

            frameRef.current++;
            animationId = requestAnimationFrame(gameLoop);
        };

        animationId = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [loading, canvasSize, config, mission, addScore, takeDamage, spawnEnemy, spawnMeteor, spawnPowerUp, applyPowerUp]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <div className="text-neon-blue text-2xl font-mono animate-pulse">LOADING MISSION...</div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="fixed inset-0 bg-black z-40">
            {/* HUD */}
            <div className="absolute top-4 left-4 text-white font-mono z-50 bg-black/60 p-3 rounded-lg backdrop-blur-sm">
                <div className="text-neon-green">LIVES: {lives}</div>
                <div className="text-neon-blue">SCORE: {score.toLocaleString()}</div>
                <div className="text-neon-pink">WAVE: {wave}</div>
            </div>

            {/* Pause/Exit Button */}
            <button
                onClick={() => setGameState('MENU')}
                className="absolute top-4 right-4 z-50 px-4 py-2 bg-black/60 border border-white/30 text-white rounded-lg font-mono text-sm hover:bg-white/10"
            >
                EXIT
            </button>

            {/* Game Canvas */}
            <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="touch-none"
            />

            {/* Mobile instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 text-xs font-mono md:hidden z-50">
                DRAG TO MOVE • AUTO-FIRE ENABLED
            </div>
        </div>
    );
}
