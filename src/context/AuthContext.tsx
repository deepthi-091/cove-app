import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { router } from 'expo-router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { api } from '@/utils/api';
import { storage } from '@/utils/storage';
import { firebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { firestoreUsers } from '@/services/firestore';
import type { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildUserFromFirebase(fbUser: any, extra?: Partial<User>): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || extra?.name || fbUser.email?.split('@')[0] || 'User',
    email: fbUser.email || '',
    avatar: (fbUser.displayName || fbUser.email || 'U')[0].toUpperCase(),
    orders: extra?.orders ?? 0,
    reviews: extra?.reviews ?? 0,
    purchases: extra?.purchases ?? 0,
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured() && firebaseAuth) {
      // Firebase handles session persistence automatically
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
        if (fbUser) {
          const cached = await storage.getUser();
          const userData = buildUserFromFirebase(fbUser, cached || undefined);
          setUser(userData);
          await storage.setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Fallback: rehydrate from AsyncStorage
      rehydrateFromStorage();
    }
  }, []);

  const rehydrateFromStorage = async () => {
    try {
      const userData = await storage.getUser();
      if (userData) setUser(userData);
    } catch (error) {
      console.error('Error rehydrating auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    if (isFirebaseConfigured() && firebaseAuth) {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const userData = buildUserFromFirebase(cred.user);
      await storage.setUser(userData);
      setUser(userData);
      await firestoreUsers.saveUser(cred.user.uid, userData);
    } else {
      const userData = await api.login(email, password);
      await storage.setUser(userData);
      setUser(userData);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    if (isFirebaseConfigured() && firebaseAuth) {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(cred.user, { displayName: name });
      const userData = buildUserFromFirebase(cred.user, { name });
      await storage.setUser(userData);
      setUser(userData);
      await firestoreUsers.saveUser(cred.user.uid, userData);
    } else {
      const userData = await api.signup(name, email, password);
      await storage.setUser(userData);
      setUser(userData);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured() && firebaseAuth) {
      await signOut(firebaseAuth);
    } else {
      await api.logout();
    }
    await storage.clearUser();
    setUser(null);
    router.replace('/login' as any);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
