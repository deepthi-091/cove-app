import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseDb } from '@/lib/firebase';
import { doc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import type { DeviceToken } from '@/types/notifications';

const DEVICE_TOKEN_STORAGE_KEY = 'device_token';
const DEVICE_ID_STORAGE_KEY = 'device_id';

export class DeviceTokenManager {
  private static instance: DeviceTokenManager;

  private constructor() {}

  static getInstance(): DeviceTokenManager {
    if (!DeviceTokenManager.instance) {
      DeviceTokenManager.instance = new DeviceTokenManager();
    }
    return DeviceTokenManager.instance;
  }

  async getOrCreateDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);
      if (!deviceId) {
        deviceId = `${Device.modelId}-${Date.now()}`;
        await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('[DeviceTokenManager] Error getting device ID:', error);
      throw error;
    }
  }

  async registerDevice(userId: string): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn('[DeviceTokenManager] Running on simulator, skipping token registration');
        return null;
      }

      const settings = await Notifications.getPermissionsAsync();
      if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
        const token = await Notifications.getExpoPushTokenAsync();

        const deviceId = await this.getOrCreateDeviceId();
        const platform = Device.osName === 'iOS' ? 'ios' : 'android';

        const deviceToken: DeviceToken = {
          userId,
          deviceId,
          token: token.data,
          platform,
          createdAt: Date.now(),
          lastRefreshedAt: Date.now(),
        };

        await this.storeTokenLocally(token.data);
        await this.storeTokenInFirestore(deviceToken);

        console.log('[DeviceTokenManager] Device registered successfully');
        return token.data;
      } else {
        console.warn('[DeviceTokenManager] Notification permissions not granted');
        return null;
      }
    } catch (error) {
      console.error('[DeviceTokenManager] Error registering device:', error);
      throw error;
    }
  }

  private async storeTokenLocally(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(DEVICE_TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('[DeviceTokenManager] Error storing token locally:', error);
    }
  }

  private async storeTokenInFirestore(deviceToken: DeviceToken): Promise<void> {
    try {
      const tokenDocRef = doc(
        collection(firebaseDb, 'users', deviceToken.userId, 'deviceTokens'),
        deviceToken.deviceId
      );
      await setDoc(tokenDocRef, deviceToken, { merge: true });
    } catch (error) {
      console.error('[DeviceTokenManager] Error storing token in Firestore:', error);
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(DEVICE_TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('[DeviceTokenManager] Error getting stored token:', error);
      return null;
    }
  }

  async unregisterDevice(userId: string): Promise<void> {
    try {
      const deviceId = await this.getOrCreateDeviceId();
      const tokenDocRef = doc(
        collection(firebaseDb, 'users', userId, 'deviceTokens'),
        deviceId
      );
      await deleteDoc(tokenDocRef);
      await AsyncStorage.removeItem(DEVICE_TOKEN_STORAGE_KEY);
      console.log('[DeviceTokenManager] Device unregistered');
    } catch (error) {
      console.error('[DeviceTokenManager] Error unregistering device:', error);
    }
  }

  async refreshToken(userId: string): Promise<string | null> {
    try {
      await this.unregisterDevice(userId);
      return await this.registerDevice(userId);
    } catch (error) {
      console.error('[DeviceTokenManager] Error refreshing token:', error);
      return null;
    }
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('[DeviceTokenManager] Error requesting permissions:', error);
      return false;
    }
  }

  async getPermissionStatus(): Promise<boolean> {
    try {
      const { granted } = await Notifications.getPermissionsAsync();
      return granted;
    } catch (error) {
      console.error('[DeviceTokenManager] Error getting permission status:', error);
      return false;
    }
  }
}

export const deviceTokenManager = DeviceTokenManager.getInstance();
