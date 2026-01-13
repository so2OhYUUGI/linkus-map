// File Path: src/utils/sample.test.ts
// File Name: sample.test.ts
// Overview: Vitest環境の動作確認用テスト

import { describe, it, expect } from 'vitest';

describe('Sample Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
