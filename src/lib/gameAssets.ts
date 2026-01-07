// Asset Paths and Preloader

export const ASSETS = {
    // Player Ships (per mission)
    playerShips: {
        1: '/assets/player-ships/playerShip1_blue.png',
        2: '/assets/player-ships/playerShip1_green.png',
        3: '/assets/player-ships/playerShip1_orange.png',
    },

    // Enemy Sprites by color
    enemies: {
        blue: [
            '/assets/enemies/enemyBlue1.png',
            '/assets/enemies/enemyBlue2.png',
            '/assets/enemies/enemyBlue3.png',
            '/assets/enemies/enemyBlue4.png',
            '/assets/enemies/enemyBlue5.png',
        ],
        green: [
            '/assets/enemies/enemyGreen1.png',
            '/assets/enemies/enemyGreen2.png',
            '/assets/enemies/enemyGreen3.png',
            '/assets/enemies/enemyGreen4.png',
            '/assets/enemies/enemyGreen5.png',
        ],
        red: [
            '/assets/enemies/enemyRed1.png',
            '/assets/enemies/enemyRed2.png',
            '/assets/enemies/enemyRed3.png',
            '/assets/enemies/enemyRed4.png',
            '/assets/enemies/enemyRed5.png',
        ],
        black: [
            '/assets/enemies/enemyBlack1.png',
            '/assets/enemies/enemyBlack2.png',
            '/assets/enemies/enemyBlack3.png',
            '/assets/enemies/enemyBlack4.png',
            '/assets/enemies/enemyBlack5.png',
        ],
    },

    // Lasers
    lasers: {
        blue: '/assets/lasers/laserBlue01.png',
        green: '/assets/lasers/laserGreen10.png',
        red: '/assets/lasers/laserRed01.png',
    },

    // Meteors
    meteors: [
        '/assets/meteors/meteorBrown_med1.png',
        '/assets/meteors/meteorBrown_med3.png',
        '/assets/meteors/meteorGrey_big3.png',
        '/assets/meteors/meteorGrey_med1.png',
        '/assets/meteors/meteorGrey_med2.png',
    ],

    // Power-ups
    powerUps: {
        TRIPLE_LASER: '/assets/powerups/pill_blue.png',
        FREEZE: '/assets/powerups/star_silver.png',
        INVINCIBILITY: '/assets/powerups/star_gold.png',
        RAPID_FIRE: '/assets/powerups/bold_silver.png',
        EXTRA_LIFE: '/assets/powerups/things_silver.png',
    },

    // Sound effects
    sounds: {
        laser: '/assets/sound-effects/sfx_laser1.ogg',
        laser2: '/assets/sound-effects/sfx_laser2.ogg',
        hit: '/assets/sound-effects/sfx_zap.ogg',
        powerUp: '/assets/sound-effects/sfx_shieldUp.ogg',
        damage: '/assets/sound-effects/sfx_shieldDown.ogg',
        lose: '/assets/sound-effects/sfx_lose.ogg',
    },
};

// Image cache
const imageCache: Map<string, HTMLImageElement> = new Map();

export function preloadImage(src: string): Promise<HTMLImageElement> {
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src)!);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}

export function getImage(src: string): HTMLImageElement | null {
    return imageCache.get(src) || null;
}

export async function preloadMissionAssets(missionId: number): Promise<void> {
    const promises: Promise<HTMLImageElement>[] = [];

    // Player ship
    const shipKey = missionId as 1 | 2 | 3;
    promises.push(preloadImage(ASSETS.playerShips[shipKey]));

    // Enemies by mission
    const enemyColor = missionId === 1 ? 'blue' : missionId === 2 ? 'green' : 'red';
    ASSETS.enemies[enemyColor].forEach(src => promises.push(preloadImage(src)));

    // Lasers
    promises.push(preloadImage(ASSETS.lasers.blue));
    promises.push(preloadImage(ASSETS.lasers[enemyColor]));

    // Meteors (mission 2)
    if (missionId === 2) {
        ASSETS.meteors.forEach(src => promises.push(preloadImage(src)));
    }

    // Power-ups
    Object.values(ASSETS.powerUps).forEach(src => promises.push(preloadImage(src)));

    await Promise.all(promises);
}

// Audio Manager
class AudioManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private enabled: boolean = true;

    async preload(): Promise<void> {
        for (const [key, src] of Object.entries(ASSETS.sounds)) {
            try {
                const audio = new Audio(src);
                audio.preload = 'auto';
                audio.volume = 0.3;
                this.sounds.set(key, audio);
            } catch (e) {
                console.warn(`Failed to load sound: ${key}`);
            }
        }
    }

    play(key: string): void {
        if (!this.enabled) return;
        const sound = this.sounds.get(key);
        if (sound) {
            // Clone for overlapping sounds
            const clone = sound.cloneNode() as HTMLAudioElement;
            clone.volume = sound.volume;
            clone.play().catch(() => { });
        }
    }

    toggle(): void {
        this.enabled = !this.enabled;
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }
}

export const audioManager = new AudioManager();
