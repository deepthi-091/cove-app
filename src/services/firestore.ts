import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { firebaseDb, isFirebaseConfigured } from '@/lib/firebase';

export const firestoreComments = {
  async getByProduct(productId: number): Promise<any[] | null> {
    if (!isFirebaseConfigured() || !firebaseDb) return null;
    try {
      const q = query(
        collection(firebaseDb, 'comments'),
        where('postId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch {
      return null;
    }
  },

  async create(comment: { name: string; email: string; body: string; postId: number }): Promise<any | null> {
    if (!isFirebaseConfigured() || !firebaseDb) return null;
    try {
      const ref = await addDoc(collection(firebaseDb, 'comments'), {
        ...comment,
        createdAt: serverTimestamp(),
      });
      return { id: ref.id, ...comment };
    } catch {
      return null;
    }
  },

  async update(commentId: string, data: Partial<{ name: string; email: string; body: string }>): Promise<boolean> {
    if (!isFirebaseConfigured() || !firebaseDb) return false;
    try {
      await updateDoc(doc(firebaseDb, 'comments', commentId), { ...data, updatedAt: serverTimestamp() });
      return true;
    } catch {
      return false;
    }
  },
};

export const firestoreUsers = {
  async saveUser(userId: string, userData: any): Promise<void> {
    if (!isFirebaseConfigured() || !firebaseDb) return;
    try {
      await updateDoc(doc(firebaseDb, 'users', userId), { ...userData, updatedAt: serverTimestamp() });
    } catch {
      try {
        await addDoc(collection(firebaseDb, 'users'), { id: userId, ...userData, createdAt: serverTimestamp() });
      } catch { /* ignore */ }
    }
  },
};
