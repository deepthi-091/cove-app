/**
 * Form Validation Tests
 * Tests for validation logic used in comments and reports
 */

describe('Form Validation', () => {
  describe('Email Validation', () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('should validate correct email', () => {
      expect(isValidEmail('hannah@example.com')).toBe(true);
      expect(isValidEmail('john.doe@company.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@domain.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('invalid@.com')).toBe(false);
      expect(isValidEmail('invalid@example')).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    const isValidPhone = (phone: string): boolean => {
      const phoneRegex = /^\d{10,}$/;
      return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    it('should validate correct phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('12345678901234')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('12345')).toBe(false);
      expect(isValidPhone('123 45')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    const isValidURL = (url: string): boolean => {
      try {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        new URL(fullUrl);
        const hostname = new URL(fullUrl).hostname;
        return hostname.includes('.') && !hostname.includes('..') && !hostname.startsWith('.') && !hostname.endsWith('.');
      } catch {
        return false;
      }
    };

    it('should validate correct URLs', () => {
      expect(isValidURL('example.com')).toBe(true);
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('https://www.example.com')).toBe(true);
      expect(isValidURL('https://subdomain.example.co.uk')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidURL('invalid')).toBe(false);
      expect(isValidURL('invalid..com')).toBe(false);
      expect(isValidURL('.com')).toBe(false);
    });
  });

  describe('Comment Validation', () => {
    it('should validate comment minimum length', () => {
      const minLength = 10;

      expect('Short'.length >= minLength).toBe(false);
      expect('This is a valid comment'.length >= minLength).toBe(true);
      expect('A'.repeat(10).length >= minLength).toBe(true);
    });

    it('should validate comment maximum length', () => {
      const maxLength = 5000;

      const validComment = 'This is a valid comment';
      const tooLongComment = 'A'.repeat(6000);

      expect(validComment.length <= maxLength).toBe(true);
      expect(tooLongComment.length <= maxLength).toBe(false);
    });

    it('should trim whitespace', () => {
      const comment = '  Hello World  ';
      const trimmed = comment.trim();

      expect(trimmed).toBe('Hello World');
      expect(trimmed.length).toBe(11);
    });
  });

  describe('Username Validation', () => {
    const isValidUsername = (username: string): boolean => {
      return /^[a-zA-Z0-9_-]+$/.test(username) &&
             username.length >= 3 &&
             username.length <= 30;
    };

    it('should validate correct usernames', () => {
      expect(isValidUsername('john')).toBe(true);
      expect(isValidUsername('john_doe')).toBe(true);
      expect(isValidUsername('john-doe')).toBe(true);
      expect(isValidUsername('john123')).toBe(true);
      expect(isValidUsername('a_b-c123')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(isValidUsername('ab')).toBe(false); // too short
      expect(isValidUsername('A'.repeat(31))).toBe(false); // too long
      expect(isValidUsername('john@doe')).toBe(false); // invalid chars
      expect(isValidUsername('john doe')).toBe(false); // space
      expect(isValidUsername('john!')).toBe(false); // special chars
    });
  });

  describe('Password Validation', () => {
    const isValidPassword = (password: string): boolean => {
      return password.length >= 6;
    };

    it('should validate correct passwords', () => {
      expect(isValidPassword('password')).toBe(true);
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('a1b2c3d4')).toBe(true);
    });

    it('should reject short passwords', () => {
      expect(isValidPassword('pass')).toBe(false);
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('Damage Report Validation', () => {
    it('should validate description minimum length', () => {
      const minLength = 20;

      expect('Short'.length >= minLength).toBe(false);
      expect('A'.repeat(20).length >= minLength).toBe(true);
      expect('This is a detailed damage description with enough words'.length >= minLength).toBe(true);
    });

    it('should validate category selection', () => {
      const validCategories = ['structural', 'water', 'electrical', 'cosmetic', 'mechanical', 'other'];

      expect(validCategories.includes('water')).toBe(true);
      expect(validCategories.includes('fire')).toBe(false);
      expect(validCategories.includes('other')).toBe(true);
    });

    it('should require photo', () => {
      const hasPhoto = (photoUri: string | null) => photoUri !== null;

      expect(hasPhoto('file://...')).toBe(true);
      expect(hasPhoto(null)).toBe(false);
    });
  });
});
