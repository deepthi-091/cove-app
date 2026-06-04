/**
 * E2E Test Initialization
 * Runs before all tests - initializes Detox framework
 */

declare const beforeAll: any;
declare const afterAll: any;

const detox = require('detox');

beforeAll(async () => {
  await detox.init();
});

afterAll(async () => {
  await detox.cleanup();
});
