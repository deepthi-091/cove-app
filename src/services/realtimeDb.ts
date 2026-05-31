import { ref, push, onValue, off, type DatabaseReference } from 'firebase/database';
import { firebaseRtdb, isFirebaseConfigured } from '@/lib/firebase';

export type CommentListener = (comments: any[]) => void;

export const realtimeComments = {
  subscribe(productId: number, callback: CommentListener): DatabaseReference | null {
    if (!isFirebaseConfigured() || !firebaseRtdb) return null;
    const commentsRef = ref(firebaseRtdb, `comments/${productId}`);
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const comments = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as any),
        }));
        // Sort newest first
        comments.sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        callback(comments);
      } else {
        callback([]);
      }
    });
    return commentsRef;
  },

  unsubscribe(dbRef: DatabaseReference | null): void {
    if (dbRef) off(dbRef);
  },

  async create(productId: number, comment: { name: string; email: string; body: string; postId: number }): Promise<string | null> {
    if (!isFirebaseConfigured() || !firebaseRtdb) return null;
    try {
      const commentsRef = ref(firebaseRtdb, `comments/${productId}`);
      const result = await push(commentsRef, {
        ...comment,
        createdAt: new Date().toISOString(),
      });
      return result.key;
    } catch {
      return null;
    }
  },
};
