import { deviceTokenManager } from '@/services/notifications/deviceTokenManager';

describe('DeviceTokenManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrCreateDeviceId', () => {
    it('should create a device ID on first call', async () => {
      const deviceId = await deviceTokenManager.getOrCreateDeviceId();
      expect(deviceId).toBeDefined();
      expect(typeof deviceId).toBe('string');
      expect(deviceId.length).toBeGreaterThan(0);
    });

    it('should return the same device ID on subsequent calls', async () => {
      const deviceId1 = await deviceTokenManager.getOrCreateDeviceId();
      const deviceId2 = await deviceTokenManager.getOrCreateDeviceId();
      expect(deviceId1).toBe(deviceId2);
    });
  });

  describe('getPermissionStatus', () => {
    it('should return a boolean', async () => {
      const status = await deviceTokenManager.getPermissionStatus();
      expect(typeof status).toBe('boolean');
    });
  });

  describe('requestPermissions', () => {
    it('should return a boolean', async () => {
      const result = await deviceTokenManager.requestPermissions();
      expect(typeof result).toBe('boolean');
    });
  });
});
