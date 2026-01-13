import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useWorlds } from '../useWorlds';
import { useAuth } from '@/hooks';

// 1. Supabase Clientのモックを、より制御しやすく改善
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockSingle = vi.fn();
const mockEq = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      delete: mockDelete,
    })),
  },
}));

// useAuthフックのモック (変更なし)
vi.mock('@/hooks', async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...(actual as object),
      useAuth: vi.fn(),
    };
});

const mockUser = { id: 'test-user-id', email: 'test@example.com' };
const mockWorld = { id: '1', title: 'Test World', description: 'A test world', owner_id: mockUser.id, created_at: new Date().toISOString() };

describe('useWorlds', () => {
  beforeEach(() => {
    // すべてのモックをリセット
    vi.clearAllMocks();
    
    // useAuthのデフォルトの返り値を設定
    (useAuth as vi.Mock).mockReturnValue({ user: mockUser });

    // Supabaseのチェーンメソッドのデフォルトの振る舞いを設定
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  it('should create a new world and add it to the state', async () => {
    const newWorldData = { title: 'New World', description: 'A new world description' };
    const expectedNewWorld = { ...mockWorld, ...newWorldData };
    
    // insertの振る舞いをこのテストケース用に設定
    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [expectedNewWorld], error: null }),
    });

    const { result } = renderHook(() => useWorlds());

    // 2. actで非同期関数を実行
    await waitFor(async () => {
        const createdWorld = await result.current.createWorld(newWorldData);
        expect(createdWorld).toEqual(expectedNewWorld);
    });

    // アサーション
    expect(mockInsert).toHaveBeenCalledWith([{ ...newWorldData, owner_id: mockUser.id }]);
    expect(result.current.worlds).toContainEqual(expectedNewWorld);
    expect(result.current.error).toBeNull();
  });

  it('should handle error during world creation and set error state', async () => {
    const newWorldData = { title: 'New World', description: 'A new world description' };
    
    // insertがエラーを返す振る舞いを設定
    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert error' } }),
    });

    const { result } = renderHook(() => useWorlds());
    
    // actで実行
    await waitFor(async () => {
      const createdWorld = await result.current.createWorld(newWorldData);
      expect(createdWorld).toBeNull();
    });

    // 3. waitForでステートの更新を待ってからアサーション
    await waitFor(() => {
      expect(result.current.error).toBe('ワールドの操作中に予期しないエラーが発生しました。');
    });
    
    expect(result.current.worlds).toHaveLength(0);
  });

  it('should set isLoading state correctly during an action', async () => {
    const longRunningPromise = new Promise(() => {}); // 解決しないPromise
    mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue(longRunningPromise)
    });

    const { result } = renderHook(() => useWorlds());
    
    // 非同期処理を開始
    result.current.fetchAllWorlds();

    // isLoadingがtrueになるのを待つ
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });
});
