import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useWorlds } from '../useWorlds';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks'; // モックするためにインポート

// Supabase clientのモック
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({})),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({})),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({})),
      })),
    })),
  },
}));

// useAuth hookのモック
// useWorlds.tsがインポートする'@/hooks'をモックする
vi.mock('@/hooks', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...(actual as object), // 他のフックはそのまま
      useAuth: vi.fn(), // useAuthだけをモックに置き換える
    };
});

const mockUser = { id: 'test-user-id', email: 'test@example.com' };
const mockWorld = { id: '1', title: 'Test World', description: 'A test world', owner_id: mockUser.id, created_at: new Date().toISOString() };

describe('useWorlds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // モックされたuseAuthの返り値を設定
    (useAuth as vi.Mock).mockReturnValue({ user: mockUser });
  });

  it('should create a new world and return it', async () => {
    const newWorldData = { title: 'New World', description: 'A new world description' };
    const mockInsertSelect = vi.fn().mockResolvedValue({ data: [{ ...mockWorld, ...newWorldData }], error: null });
    (supabase.from('worlds').insert as vi.Mock).mockReturnValue({
        select: mockInsertSelect
    });

    const { result } = renderHook(() => useWorlds());
    
    let createdWorld;
    await act(async () => {
        createdWorld = await result.current.createWorld(newWorldData);
    });

    expect(supabase.from('worlds').insert).toHaveBeenCalledWith([{ ...newWorldData, owner_id: mockUser.id }]);
    expect(result.current.worlds).toContainEqual(expect.objectContaining(newWorldData));
    expect(createdWorld).toEqual(expect.objectContaining(newWorldData));
  });

  it('should handle error during world creation', async () => {
    const newWorldData = { title: 'New World', description: 'A new world description' };
    (supabase.from('worlds').insert as vi.Mock).mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert error' } })
    });
    
    const { result } = renderHook(() => useWorlds());

    let createdWorld;
    await act(async () => {
        createdWorld = await result.current.createWorld(newWorldData);
    });

    expect(result.current.error).toBe('ワールドの操作中に予期しないエラーが発生しました。');
    expect(createdWorld).toBeNull();
  });

  it('should set isLoading state correctly', async () => {
    const longRunningPromise = new Promise(() => {}); // 未解決のPromise
    (supabase.from('worlds').select as vi.Mock).mockReturnValue({
        eq: vi.fn().mockReturnValue(longRunningPromise)
    });

    const { result } = renderHook(() => useWorlds());

    act(() => {
      result.current.fetchAllWorlds();
    });

    expect(result.current.isLoading).toBe(true);
  });
});
