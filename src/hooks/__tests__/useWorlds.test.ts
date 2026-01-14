// File Path: src/hooks/__tests__/useWorlds.test.ts
// File Name: useWorlds.test.ts
// Overview: Test suite for the useWorlds hook.

import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { useWorlds } from '../useWorlds';
import { useAuth } from '@/hooks/useAuth/useAuth';

// Supabase Clientのモック
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

// useWorldsが実際にimportするパスを正確にモックする
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockUser = { id: 'test-user-id', email: 'test@example.com' };
const mockWorld = { id: '1', title: 'Test World', description: 'A test world', owner_id: mockUser.id, created_at: new Date().toISOString() };

describe('useWorlds', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // 修正点1: useAuthのモックを現在の仕様に合わせる
    (useAuth as Mock).mockReturnValue({ 
      user: mockUser,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
    });

    // Supabaseのチェーンメソッドの振る舞いを設定
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  it('should create a new world and add it to the state', async () => {
    const newWorldData = { title: 'New World', description: 'A new world description' };
    const expectedNewWorld = { ...mockWorld, ...newWorldData };
    
    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [expectedNewWorld], error: null }),
    });

    const { result } = renderHook(() => useWorlds());

    // 修正点3: actで非同期処理をラップ
    await act(async () => {
      const createdWorld = await result.current.createWorld(newWorldData);
      expect(createdWorld).toEqual(expectedNewWorld);
    });

    // 修正点2: waitForでstateの更新を待機
    await waitFor(() => {
      expect(result.current.worlds).toContainEqual(expectedNewWorld);
    });

    expect(mockInsert).toHaveBeenCalledWith([{ ...newWorldData, owner_id: mockUser.id }]);
    expect(result.current.error).toBeNull();
  });

  it('should handle error during world creation and set error state', async () => {
    const newWorldData = { title: 'New World', description: 'A new world description' };
    
    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert error' } }),
    });

    const { result } = renderHook(() => useWorlds());
    
    // actで非同期処理をラップ
    await act(async () => {
      const createdWorld = await result.current.createWorld(newWorldData);
      expect(createdWorld).toBeNull();
    });

    // waitForでエラーstateの更新を待機
    await waitFor(() => {
      expect(result.current.error).toBe('ワールドの操作中に予期しないエラーが発生しました。');
    });
    
    expect(result.current.worlds).toHaveLength(0);
  });

  it('should set isLoading state correctly during an action', async () => {
    const longRunningPromise = new Promise(() => {});
    mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue(longRunningPromise)
    });

    const { result } = renderHook(() => useWorlds());
    
    // 同期的なステート更新もactでラップ
    act(() => {
      result.current.fetchAllWorlds();
    });

    // isLoadingがtrueになるのを待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });
});
