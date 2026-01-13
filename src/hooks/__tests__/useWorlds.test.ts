import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useWorlds } from '../useWorlds';
import { supabase } from '@/lib/supabase';
import { AuthProvider, useAuth } from '@/contexts';

// Supabase clientのモック
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({})),
        single: vi.fn(() => ({})),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({})),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({})),
      })),
    })),
  },
}));

// useAuth hookのモック
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockUser = { id: 'test-user-id', email: 'test@example.com' };

describe('useWorlds', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
    // useAuthが常に同じユーザーを返すように設定
    (useAuth as vi.Mock).mockReturnValue({ user: mockUser });
  });

  it('should create a new world', async () => {
    const newWorld = { title: 'New World', description: 'A new world description' };
    const createdWorld = { ...newWorld, id: '1', owner_id: mockUser.id, created_at: new Date().toISOString() };

    // insertのモック実装
    (supabase.from('worlds').insert as vi.Mock).mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [createdWorld], error: null }),
    });

    const { result } = renderHook(() => useWorlds());

    await act(async () => {
      await result.current.createWorld(newWorld);
    });

    expect(supabase.from('worlds').insert).toHaveBeenCalledWith([
      { ...newWorld, owner_id: mockUser.id },
    ]);
    expect(result.current.worlds).toContainEqual(createdWorld);
  });

  it('should fetch a world by id', async () => {
    const world = { id: '1', title: 'Test World', owner_id: mockUser.id, created_at: new Date().toISOString() };

    // select...singleのモック実装
    (supabase.from('worlds').select('*').eq as vi.Mock).mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: world, error: null })
    });

    const { result } = renderHook(() => useWorlds());

    await act(async () => {
        await result.current.fetchWorldById('1');
    });

    expect(supabase.from('worlds').select('*').eq).toHaveBeenCalledWith('id', '1');
    expect(result.current.currentWorld).toEqual(world);
  });

  it('should set loading state correctly', async () => {
    // selectのPromiseを未解決のままにして、ローディング状態をテスト
    (supabase.from('worlds').select as vi.Mock).mockReturnValue({
      eq: vi.fn(() => new Promise(() => {})),
    });

    const { result } = renderHook(() => useWorlds());

    let promise;
    act(() => {
      promise = result.current.fetchAllWorlds();
    });

    expect(result.current.loading).toBe(true);
    
    // Promiseを解決してローディングが解除されることを確認
    // この部分はさらに詳細なモック制御が必要ですが、基本的な状態遷移をテスト
  });
});
