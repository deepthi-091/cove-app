declare global {
  const device: {
    launchApp(config?: any): Promise<void>;
    reloadReactNative(): Promise<void>;
  };

  const element: (matcher: any) => {
    typeText(text: string): Promise<void>;
    clearText(): Promise<void>;
    multiTap(count: number): Promise<void>;
    longPress(): Promise<void>;
    tapReturnKey(): Promise<void>;
    scroll(pixels: number, direction: string): Promise<void>;
    toBeVisible(): Promise<void>;
    toExist(): Promise<void>;
    toHaveText(text: string): Promise<void>;
    toNotBeVisible(): Promise<void>;
    toNotExist(): Promise<void>;
  };

  const by: {
    id(id: string): any;
    text(text: string): any;
    type(type: string): any;
  };

  const waitFor: (element: any) => {
    toBeVisible(): { withTimeout(ms: number): Promise<void> };
    toExist(): { withTimeout(ms: number): Promise<void> };
    toNotBeVisible(): { withTimeout(ms: number): Promise<void> };
  };

  namespace jest {
    interface Matchers<R> {
      toBeVisible(): Promise<void>;
      toNotBeVisible(): Promise<void>;
      toExist(): Promise<void>;
      toNotExist(): Promise<void>;
      toHaveText(text: string): Promise<void>;
    }
  }

  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => Promise<void>): void;
  function beforeAll(fn: () => Promise<void>): void;
  function afterAll(fn: () => Promise<void>): void;
  function beforeEach(fn: () => Promise<void>): void;
  function afterEach(fn: () => Promise<void>): void;
}

export {};
