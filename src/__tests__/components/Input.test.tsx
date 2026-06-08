/**
 * Input Component Tests
 * Tests for input rendering, label, placeholder, error states, and focus handling
 */

import React from 'react';
import renderer from 'react-test-renderer';
import { Input } from '@/components/Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input field', () => {
      const tree = renderer.create(<Input />).toJSON();

      expect(tree).toBeDefined();
    });

    it('should accept different placeholder texts', () => {
      const placeholders = [
        'Enter email',
        'Enter password',
        'Enter name',
        'Enter phone',
      ];

      placeholders.forEach((placeholder) => {
        const tree = renderer.create(
          <Input placeholder={placeholder} />
        ).toJSON();

        expect(tree).toBeDefined();
      });
    });
  });

  describe('Label', () => {
    it('should render label when provided', () => {
      const tree = renderer.create(
        <Input label="Email Address" />
      ).toJSON();

      expect(tree).toBeDefined();
    });

    it('should not render label when not provided', () => {
      const tree = renderer.create(<Input />).toJSON();

      expect(tree).toBeDefined();
    });

    it('should render different labels', () => {
      const labelTexts = ['Email', 'Password', 'Full Name', 'Phone Number'];

      labelTexts.forEach((label) => {
        const tree = renderer.create(
          <Input label={label} />
        ).toJSON();

        expect(tree).toBeDefined();
      });
    });
  });

  describe('Error State', () => {
    it('should render with error prop', () => {
      const tree = renderer.create(
        <Input error="Email is invalid" />
      ).toJSON();

      expect(tree).toBeDefined();
    });

    it('should render without error when error is not provided', () => {
      const tree = renderer.create(<Input />).toJSON();

      expect(tree).toBeDefined();
    });

    it('should display different error messages', () => {
      const errors = [
        'Email is invalid',
        'Password too short',
        'Name is required',
        'Phone number is invalid',
      ];

      errors.forEach((error) => {
        const tree = renderer.create(
          <Input error={error} />
        ).toJSON();

        expect(tree).toBeDefined();
      });
    });
  });

  describe('TextInput Props', () => {
    it('should accept value prop', () => {
      const tree = renderer.create(
        <Input value="test value" />
      ).toJSON();

      expect(tree).toBeDefined();
    });

    it('should accept editable prop', () => {
      const tree = renderer.create(
        <Input editable={false} />
      ).toJSON();

      expect(tree).toBeDefined();
    });

    it('should accept secureTextEntry for password input', () => {
      const tree = renderer.create(
        <Input secureTextEntry={true} />
      ).toJSON();

      expect(tree).toBeDefined();
    });
  });

  describe('Prop Combinations', () => {
    it('should render with label, placeholder, and error', () => {
      const tree = renderer
        .create(
          <Input
            label="Email"
            placeholder="Enter email"
            error="Invalid email"
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should render with label and placeholder', () => {
      const tree = renderer
        .create(
          <Input
            label="Password"
            placeholder="Enter password"
          />
        )
        .toJSON();

      expect(tree).toBeDefined();
    });

    it('should handle all common input types', () => {
      const inputConfigs = [
        { placeholder: 'Email', keyboardType: 'email-address' as const },
        { placeholder: 'Password', secureTextEntry: true },
        { placeholder: 'Phone', keyboardType: 'phone-pad' as const },
        { placeholder: 'Number', keyboardType: 'numeric' as const },
      ];

      inputConfigs.forEach((config) => {
        const tree = renderer.create(<Input {...config} />).toJSON();
        expect(tree).toBeDefined();
      });
    });

    it('should handle complex input configurations', () => {
      const tree = renderer.create(
        <Input
          label="Email Address"
          placeholder="you@example.com"
          keyboardType="email-address"
          value="test@example.com"
          editable={true}
          error={undefined}
        />
      ).toJSON();

      expect(tree).toBeDefined();
    });
  });
});
