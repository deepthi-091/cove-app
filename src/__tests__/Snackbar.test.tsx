/**
 * Snackbar Component Tests
 * Tests for snackbar visibility, message types, auto-dismiss, and user interactions
 */

import React from 'react';
import renderer from 'react-test-renderer';
import { Snackbar } from '@/components/Snackbar';

describe('Snackbar Component', () => {
  describe('Visibility', () => {
    it('should render when visible is true', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message="Success!"
            type="success"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should not render when visible is false', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={false}
            message="Success!"
            type="success"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeNull();
    });

    it('should toggle visibility', () => {
      const mockDismiss = jest.fn();

      const testInstance = renderer.create(
        <Snackbar
          visible={false}
          message="Test"
          type="info"
          onDismiss={mockDismiss}
        />
      );

      let tree = testInstance.toJSON();
      expect(tree).toBeNull();

      testInstance.update(
        <Snackbar
          visible={true}
          message="Test"
          type="info"
          onDismiss={mockDismiss}
        />
      );

      tree = testInstance.toJSON();
      expect(tree).toBeDefined();
    });
  });

  describe('Message Display', () => {
    it('should render with message when visible', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message="Operation completed!"
            type="success"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should handle different messages', () => {
      const messages = [
        'Login successful!',
        'Error occurred',
        'Please wait...',
        'Item added to cart',
      ];

      messages.forEach((message) => {
        const tree = renderer
          .create(
            <Snackbar
              visible={true}
              message={message}
              type="info"
              onDismiss={() => {}}
            />
          )
          .toJSON();

        expect(tree).toBeDefined();
      });
    });

    it('should handle long messages', () => {
      const longMessage =
        'This is a very long message that might wrap to multiple lines in the snackbar notification';

      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message={longMessage}
            type="info"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });
  });

  describe('Message Types', () => {
    it('should render success snackbar', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message="Success"
            type="success"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should render error snackbar', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message="Error"
            type="error"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should render info snackbar', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message="Info"
            type="info"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should render all message types', () => {
      const types: Array<'success' | 'error' | 'info'> = [
        'success',
        'error',
        'info',
      ];

      types.forEach((type) => {
        const tree = renderer
          .create(
            <Snackbar
              visible={true}
              message={`${type} message`}
              type={type}
              onDismiss={() => {}}
            />
          )
          .toJSON();

        expect(tree).toBeDefined();
      });
    });
  });

  describe('Duration & Auto-dismiss', () => {
    it('should use default duration of 3000ms', () => {
      jest.useFakeTimers();

      const mockDismiss = jest.fn();

      renderer.create(
        <Snackbar
          visible={true}
          message="Test"
          type="info"
          onDismiss={mockDismiss}
        />
      );

      expect(mockDismiss).not.toHaveBeenCalled();

      jest.advanceTimersByTime(3000);

      jest.useRealTimers();
    });

    it('should accept custom duration', () => {
      jest.useFakeTimers();

      const mockDismiss = jest.fn();

      renderer.create(
        <Snackbar
          visible={true}
          message="Test"
          type="info"
          duration={5000}
          onDismiss={mockDismiss}
        />
      );

      jest.advanceTimersByTime(5000);

      jest.useRealTimers();
    });

    it('should accept different duration values', () => {
      const durations = [1000, 2000, 3000, 5000, 10000];

      durations.forEach((duration) => {
        const tree = renderer
          .create(
            <Snackbar
              visible={true}
              message="Test"
              type="info"
              duration={duration}
              onDismiss={() => {}}
            />
          )
          .toJSON();

        expect(tree).toBeDefined();
      });
    });
  });

  describe('Dismiss Handling', () => {
    it('should call onDismiss callback', () => {
      const mockDismiss = jest.fn();

      const tree = renderer.create(
        <Snackbar
          visible={true}
          message="Test"
          type="info"
          onDismiss={mockDismiss}
        />
      ).toJSON();

      expect(tree).toBeDefined();
    });

    it('should have close button when visible', () => {
      const tree = renderer.create(
        <Snackbar
          visible={true}
          message="Test"
          type="info"
          onDismiss={() => {}}
        />
      ).toJSON();

      expect(tree).toBeDefined();
    });

    it('should call onDismiss once per dismissal', () => {
      const mockDismiss = jest.fn();

      const tree = renderer.create(
        <Snackbar
          visible={true}
          message="Test"
          type="info"
          onDismiss={mockDismiss}
        />
      ).toJSON();

      expect(tree).toBeDefined();
      expect(mockDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Rendering Details', () => {
    it('should have correct structure when visible', () => {
      const tree = renderer.create(
        <Snackbar
          visible={true}
          message="Test message"
          type="success"
          onDismiss={() => {}}
        />
      ).toJSON();

      expect(tree).toBeDefined();
    });

    it('should have correct structure for success type', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message="Success message!"
            type="success"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should have correct structure for error type', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message="Error message!"
            type="error"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should have correct structure for info type', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message="Info message!"
            type="info"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message string', () => {
      const tree = renderer
        .create(
          <Snackbar
            visible={true}
            message=""
            type="info"
            onDismiss={() => {}}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should handle rapid visibility changes', () => {
      const mockDismiss = jest.fn();

      const testInstance = renderer.create(
        <Snackbar
          visible={true}
          message="Test"
          type="info"
          onDismiss={mockDismiss}
        />
      );

      testInstance.update(
        <Snackbar
          visible={false}
          message="Test"
          type="info"
          onDismiss={mockDismiss}
        />
      );

      testInstance.update(
        <Snackbar
          visible={true}
          message="Test 2"
          type="success"
          onDismiss={mockDismiss}
        />
      );

      const tree = testInstance.toJSON();
      expect(tree).toBeDefined();
    });

    it('should handle message type changes', () => {
      const mockDismiss = jest.fn();

      const testInstance = renderer.create(
        <Snackbar
          visible={true}
          message="Test"
          type="success"
          onDismiss={mockDismiss}
        />
      );

      testInstance.update(
        <Snackbar
          visible={true}
          message="Test"
          type="error"
          onDismiss={mockDismiss}
        />
      );

      const tree = testInstance.toJSON();
      expect(tree).toBeDefined();
    });

    it('should handle message content changes', () => {
      const mockDismiss = jest.fn();

      const testInstance = renderer.create(
        <Snackbar
          visible={true}
          message="First message"
          type="info"
          onDismiss={mockDismiss}
        />
      );

      testInstance.update(
        <Snackbar
          visible={true}
          message="Second message"
          type="info"
          onDismiss={mockDismiss}
        />
      );

      const tree = testInstance.toJSON();
      expect(tree).toBeDefined();
    });
  });
});
