import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, orderBy, limit, getDocs, serverTimestamp, runTransaction, Timestamp, FieldValue } from 'firebase/firestore';

export interface UserProfile {
    walletAddress: string;
    lives: number;
    highScore: number;
    gamesPlayed: number;
    lastPlayed: Timestamp | FieldValue | null;
}

export interface ScoreEntry {
    id: string;
    walletAddress: string;
    score: number;
    timestamp: Timestamp | FieldValue | null;
}

export const getUserProfile = async (walletAddress: string): Promise<UserProfile | null> => {
    if (!walletAddress) return null;
    const docRef = doc(db, 'users', walletAddress);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    } else {
        // Initialize new user
        const newUser: UserProfile = {
            walletAddress,
            lives: 0,
            highScore: 0,
            gamesPlayed: 0,
            lastPlayed: serverTimestamp()
        };
        await setDoc(docRef, newUser);
        return newUser;
    }
};

export const saveGameResult = async (walletAddress: string, score: number) => {
    if (!walletAddress) return;
    const userRef = doc(db, 'users', walletAddress);
    const scoreRef = collection(db, 'scores');

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                return;
            }

            const userData = userDoc.data() as UserProfile;
            const newHighScore = Math.max(userData.highScore, score);

            transaction.update(userRef, {
                highScore: newHighScore,
                gamesPlayed: userData.gamesPlayed + 1,
                lastPlayed: serverTimestamp()
            });

            const newScoreDoc = doc(scoreRef);
            transaction.set(newScoreDoc, {
                walletAddress,
                score,
                timestamp: serverTimestamp()
            });
        });
    } catch (e) {
        console.error("Error saving game result: ", e);
    }
};

export const getLeaderboard = async (): Promise<ScoreEntry[]> => {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as ScoreEntry));
};

export const addLives = async (walletAddress: string, amount: number) => {
    if (!walletAddress) return;
    const userRef = doc(db, 'users', walletAddress);
    await updateDoc(userRef, {
        lives: amount
    });
};
