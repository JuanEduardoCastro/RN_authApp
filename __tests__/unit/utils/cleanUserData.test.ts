import { cleanUserData, sanitizeUserInput } from '@utils/cleanUserData';

describe('sanitizeUserInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeUserInput('')).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeUserInput('  hello  ')).toBe('hello');
  });

  it('strips HTML tags', () => {
    expect(sanitizeUserInput('<b>bold</b>')).toBe('bold');
  });

  it('strips inline event handlers', () => {
    expect(sanitizeUserInput('text onclick="alert(1)"')).toBe('text ');
  });

  it('truncates to 255 characters', () => {
    const long = 'a'.repeat(300);
    expect(sanitizeUserInput(long)).toHaveLength(255);
  });

  it('handles non-string input gracefully', () => {
    expect(sanitizeUserInput(null as any)).toBe('');
  });
});

describe('cleanUserData', () => {
  it('sanitizes string values', () => {
    const result = cleanUserData({ name: '<b>Juan</b>' });

    expect(result.name).toBe('Juan');
  });

  it('strips _id field', () => {
    const result = cleanUserData({ _id: '123', name: 'Juan' });
    expect(result).not.toHaveProperty('_id');
    expect(result.name).toBe('Juan');
  });

  it('recursively sanitizes nested objects', () => {
    const result = cleanUserData({ address: { city: '<b>Madrid</b>' } });
    expect(result.address.city).toBe('Madrid');
  });

  it('passes through non-string, non-object values unchanged', () => {
    const result = cleanUserData({ age: 30, active: true });
    expect(result.age).toBe(30);
    expect(result.active).toBe(true);
  });
});
