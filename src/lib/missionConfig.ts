// Mission Configuration

import { MissionConfig } from './gameTypes';
import { ASSETS } from './gameAssets';

export const MISSIONS: Record<number, MissionConfig> = {
    1: {
        id: 1,
        name: 'Nebula Run',
        playerShip: ASSETS.playerShips[1],
        playerLaser: ASSETS.lasers.blue,
        enemySprites: ASSETS.enemies.blue,
        enemyLaser: ASSETS.lasers.blue,
        enemySpeed: 1.5,
        enemySpawnRate: 2500,
        enemyShootChance: 0, // Enemies don't shoot in Mission 1
        hasMeteors: false,
        meteorSpawnRate: 0,
        hasBoss: false,
        bossWaveInterval: 0,
        powerUpDropRate: 0.30, // 30%
        waveSpeedIncrease: 0.1,
    },
    2: {
        id: 2,
        name: 'Meteor Storm',
        playerShip: ASSETS.playerShips[2],
        playerLaser: ASSETS.lasers.green,
        enemySprites: ASSETS.enemies.green,
        enemyLaser: ASSETS.lasers.green,
        enemySpeed: 2.0,
        enemySpawnRate: 1800,
        enemyShootChance: 0.1, // 10% chance to shoot
        hasMeteors: true,
        meteorSpawnRate: 3000,
        hasBoss: false,
        bossWaveInterval: 0,
        powerUpDropRate: 0.25, // 25%
        waveSpeedIncrease: 0.15,
    },
    3: {
        id: 3,
        name: 'Pirate Ambush',
        playerShip: ASSETS.playerShips[3],
        playerLaser: ASSETS.lasers.red,
        enemySprites: ASSETS.enemies.red,
        enemyLaser: ASSETS.lasers.red,
        enemySpeed: 2.5,
        enemySpawnRate: 1200,
        enemyShootChance: 0.3, // 30% chance to shoot
        hasMeteors: false,
        meteorSpawnRate: 0,
        hasBoss: true,
        bossWaveInterval: 5, // Boss every 5 waves
        powerUpDropRate: 0.20, // 20%
        waveSpeedIncrease: 0.2,
    },
};

export function getMissionConfig(missionId: number): MissionConfig {
    return MISSIONS[missionId] || MISSIONS[1];
}
