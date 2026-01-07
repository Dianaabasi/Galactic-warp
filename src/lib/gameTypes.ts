// Game Entity Types

export type PowerUpType = 'TRIPLE_LASER' | 'FREEZE' | 'INVINCIBILITY' | 'RAPID_FIRE' | 'EXTRA_LIFE';

export interface Vector2D {
    x: number;
    y: number;
}

export interface Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    vx?: number;
    vy?: number;
    active?: boolean;
}

export interface Player extends Entity {
    invincible: boolean;
    invincibleUntil: number;
    rapidFire: boolean;
    rapidFireUntil: number;
    tripleLaser: boolean;
    tripleLaserUntil: number;
}

export interface Bullet extends Entity {
    fromPlayer: boolean;
    damage: number;
}

export interface Enemy extends Entity {
    hp: number;
    maxHp: number;
    type: 'basic' | 'shooter' | 'boss';
    sprite: string;
    canShoot: boolean;
    lastShot: number;
    shootInterval: number;
    frozen: boolean;
    frozenUntil: number;
}

export interface Meteor extends Entity {
    sprite: string;
    rotationSpeed: number;
    rotation: number;
}

export interface PowerUp extends Entity {
    type: PowerUpType;
    sprite: string;
}

export interface MissionConfig {
    id: number;
    name: string;
    playerShip: string;
    playerLaser: string;
    enemySprites: string[];
    enemyLaser: string;
    enemySpeed: number;
    enemySpawnRate: number;
    enemyShootChance: number;
    hasMeteors: boolean;
    meteorSpawnRate: number;
    hasBoss: boolean;
    bossWaveInterval: number;
    powerUpDropRate: number;
    waveSpeedIncrease: number;
}

export interface GameState {
    player: Player;
    bullets: Bullet[];
    enemies: Enemy[];
    meteors: Meteor[];
    powerUps: PowerUp[];
    wave: number;
    frozen: boolean;
    frozenUntil: number;
}
