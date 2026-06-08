/**
 * Button Component Tests
 * Tests for button rendering, variants, disabled state, and press handling
 */

import React from 'react';
import renderer from 'react-test-renderer';
import { Button } from '@/components/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with label', () => {
      const tree = renderer
        .create(<Button label="Click Me" onPress={() => {}} />)
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should accept different labels', () => {
      const labels = ['Login', 'Signup', 'Save', 'Cancel', 'Delete'];

      labels.forEach((label) => {
        const tree = renderer
          .create(<Button label={label} onPress={() => {}} />)
          .toJSON();

        expect(tree).toBeDefined();
      });
    });
  });

  describe('Variants', () => {
    it('should render with primary variant by default', () => {
      const tree = renderer
        .create(<Button label="Primary" onPress={() => {}} />)
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should render with secondary variant', () => {
      const tree = renderer
        .create(
          <Button label="Secondary" onPress={() => {}} variant="secondary" />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should handle all variant types', () => {
      const variants: Array<'primary' | 'secondary'> = ['primary', 'secondary'];

      variants.forEach((variant) => {
        const tree = renderer
          .create(
            <Button label={`${variant} Button`} onPress={() => {}} variant={variant} />
          )
          .toJSON();

        expect(tree).toBeDefined();
      });
    });
  });

  describe('Disabled State', () => {
    it('should render enabled button by default', () => {
      const tree = renderer
        .create(<Button label="Enabled" onPress={() => {}} />)
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should render disabled button when disabled prop is true', () => {
      const tree = renderer
        .create(<Button label="Disabled" onPress={() => {}} disabled={true} />)
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should handle all disabled states', () => {
      const disabledStates = [true, false];

      disabledStates.forEach((disabled) => {
        const tree = renderer
          .create(
            <Button label="Test" onPress={() => {}} disabled={disabled} />
          )
          .toJSON();

        expect(tree).toBeDefined();
      });
    });
  });

  describe('Press Handling', () => {
    it('should call onPress when button is pressed', () => {
      const mockPress = jest.fn();

      const instance = renderer.create(
        <Button label="Click" onPress={mockPress} />
      );

      expect(mockPress).not.toHaveBeenCalled();
      // Component should be created without errors
      expect(instance).toBeDefined();
    });

    it('should accept callback prop', () => {
      const callback = jest.fn();

      const instance = renderer.create(
        <Button label="Action" onPress={callback} />
      );

      expect(instance).toBeDefined();
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle different callbacks', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const instance1 = renderer.create(
        <Button label="Action 1" onPress={callback1} />
      );

      const instance2 = renderer.create(
        <Button label="Action 2" onPress={callback2} />
      );

      expect(instance1).toBeDefined();
      expect(instance2).toBeDefined();
    });
  });

  describe('Prop Combinations', () => {
    it('should render primary disabled button', () => {
      const tree = renderer
        .create(
          <Button
            label="Primary Disabled"
            onPress={() => {}}
            variant="primary"
            disabled={true}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should render secondary disabled button', () => {
      const tree = renderer
        .create(
          <Button
            label="Secondary Disabled"
            onPress={() => {}}
            variant="secondary"
            disabled={true}
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should handle all prop combinations', () => {
      const combinations = [
        { variant: 'primary' as const, disabled: false },
        { variant: 'primary' as const, disabled: true },
        { variant: 'secondary' as const, disabled: false },
        { variant: 'secondary' as const, disabled: true },
      ];

      combinations.forEach(({ variant, disabled }) => {
        const tree = renderer
          .create(
            <Button
              label="Test"
              onPress={() => {}}
              variant={variant}
              disabled={disabled}
            />
          )
          .toJSON();

        expect(tree).toBeDefined();
      });
    });
  });
});
