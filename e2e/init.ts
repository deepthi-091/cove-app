/**
 * E2E Test Initialization
 * Runs before all tests - initializes Detox framework
 */

declare const beforeAll: any;
declare const afterAll: any;

const detox = require('detox');

beforeAll(async () => {
  try {
    await detox.init();
  } catch (error) {
    console.error('Error initializing Detox:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await detox.cleanup();
  } catch (error) {
    console.error('Error cleaning up Detox:', error);
    // Don't throw - allow tests to complete even if cleanup fails
  }
});
