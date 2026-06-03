// Jest setup file - Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock React Native components
jest.mock('react-native', () => {
  const React = require('react');

  // Create mock components that are actual React components
  const createMockComponent = (name) => {
    const Component = React.forwardRef((props, ref) => {
      return React.createElement(name, { ref, ...props });
    });
    Component.displayName = name;
    return Component;
  };

  const MockAnimatedView = createMockComponent('Animated.View');

  return {
    View: createMockComponent('View'),
    Text: createMockComponent('Text'),
    TextInput: createMockComponent('TextInput'),
    TouchableOpacity: createMockComponent('TouchableOpacity'),
    StyleSheet: {
      create: (styles) => styles,
    },
    Animated: {
      View: MockAnimatedView,
      Value: jest.fn(function AnimatedValue(initialValue) {
        this._value = initialValue;
        this.setValue = jest.fn();
      }),
      timing: jest.fn(() => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      spring: jest.fn(() => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      sequence: jest.fn(() => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
    },
    Platform: {
      OS: 'ios',
      select: (obj) => obj.ios,
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    LayoutAnimation: {
      create: jest.fn(),
      configureNext: jest.fn(),
      Types: {
        linear: jest.fn(),
        keyboard: jest.fn(),
      },
      Properties: {
        opacity: jest.fn(),
        scaleX: jest.fn(),
        scaleY: jest.fn(),
      },
    },
    ActivityIndicator: createMockComponent('ActivityIndicator'),
    Modal: createMockComponent('Modal'),
    ScrollView: createMockComponent('ScrollView'),
    FlatList: createMockComponent('FlatList'),
    Image: createMockComponent('Image'),
    Button: createMockComponent('Button'),
  };
});

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
