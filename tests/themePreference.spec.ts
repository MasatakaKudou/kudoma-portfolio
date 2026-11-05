import { isThemeMode, nextPreference, parsePreference, resolveMode, ThemePreference } from '../src/themePreference';

describe('themePreference', () => {
  describe('parsePreference', () => {
    test('uses a stored light or dark choice', () => {
      expect(parsePreference('light')).toBe('light');
      expect(parsePreference('dark')).toBe('dark');
    });

    test('falls back to system when nothing is stored', () => {
      expect(parsePreference(null)).toBe('system');
    });

    test('falls back to system for an unknown or broken value', () => {
      expect(parsePreference('')).toBe('system');
      expect(parsePreference('system')).toBe('system');
      expect(parsePreference('Dark')).toBe('system');
      expect(parsePreference('{"mode":"dark"}')).toBe('system');
    });
  });

  describe('nextPreference', () => {
    test('cycles system -> light -> dark -> system', () => {
      expect(nextPreference('system')).toBe('light');
      expect(nextPreference('light')).toBe('dark');
      expect(nextPreference('dark')).toBe('system');
    });

    test('returns to the start after three steps', () => {
      (['system', 'light', 'dark'] as ThemePreference[]).forEach((start) => {
        expect(nextPreference(nextPreference(nextPreference(start)))).toBe(start);
      });
    });
  });

  describe('resolveMode', () => {
    test('follows the OS setting only for system', () => {
      expect(resolveMode('system', true)).toBe('dark');
      expect(resolveMode('system', false)).toBe('light');
    });

    test('ignores the OS setting for an explicit choice', () => {
      expect(resolveMode('light', true)).toBe('light');
      expect(resolveMode('dark', false)).toBe('dark');
    });
  });

  test('isThemeMode accepts only light and dark', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(false);
    expect(isThemeMode(null)).toBe(false);
  });
});
