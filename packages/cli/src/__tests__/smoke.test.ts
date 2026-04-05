import { describe, expect, test } from 'bun:test';
import { VERSION } from '../index';

describe('@copydoc/cli smoke test', () => {
  test('VERSION is exported and truthy', () => {
    expect(VERSION).toBeTruthy();
  });

  test('VERSION is a string', () => {
    expect(typeof VERSION).toBe('string');
  });
});
