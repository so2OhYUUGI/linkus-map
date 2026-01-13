import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { useWorlds } from '../useWorlds';
import { useAuth } from '@/hooks/useAuth';

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
    
    // useAuthの返り値を設定
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

    await waitFor(async () => {
        const createdWorld = await result.current.createWorld(newWorldData);
        expect(createdWorld).toEqual(expectedNewWorld);
    });

    expect(mockInsert).toHaveBeenCalledWith([{ ...newWorldData, owner_id: mockUser.id }]);
    expect(result.current.worlds).toContainEqual(expectedNewWorld);
    expect(result.current.error).toBeNull();
  });

  it('should handle error during world creation and set error state', async () => {
    const newWorldData = { title: 'New World', description: 'A new world description' };
    
    mockInsert.mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert error' } }),
    });

    const { result } = renderHook(() => useWorlds());
    
    await waitFor(async () => {
      const createdWorld = await result.current.createWorld(newWorldData);
      expect(createdWorld).toBeNull();
    });

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
    
    result.current.fetchAllWorlds();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });
  });
});
