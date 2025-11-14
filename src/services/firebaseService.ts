import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GameState } from '../types/game';

export const saveGameToFirebase = async (userId: string, gameState: GameState) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        gameState: {
          ...gameState,
          lastSaveTime: Date.now(),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error saving game to Firebase:', error);
    throw error;
  }
};

export const loadGameFromFirebase = async (userId: string): Promise<GameState | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.gameState as GameState;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading game from Firebase:', error);
    throw error;
  }
};

export const updateGameInFirebase = async (userId: string, gameState: GameState) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      'gameState': {
        ...gameState,
        lastSaveTime: Date.now(),
      },
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating game in Firebase:', error);
    throw error;
  }
};

