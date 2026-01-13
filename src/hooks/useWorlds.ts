import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { World } from '@/types/world';
import { useAuth } from '@/hooks'; // <- パスを修正

// エラーメッセージを翻訳（この関数は別途utilsに定義することを想定）
const translateWorldError = (message: string): string => {
  // ここでSupabaseから返される可能性のあるエラーメッセージを日本語に変換
  // 例: 'new row violates row-level security policy for table "worlds"'
  if (message.includes('security policy')) {
    return '指定された操作を行う権限がありません。';
  }
  return 'ワールドの操作中に予期しないエラーが発生しました。';
};


export const useWorlds = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const worldAction = async <T>(action: () => Promise<{ data: T | null; error: any }>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: apiError } = await action();
      if (apiError) {
        setError(translateWorldError(apiError.message));
        return null;
      }
      return data;
    } catch (err) {
      setError('予期しないエラーが発生しました。');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllWorlds = useCallback(async () => {
    if (!user) return;
    const data = await worldAction(() =>
      supabase.from('worlds').select('*').eq('owner_id', user.id)
    );
    if (data) {
      setWorlds(data as unknown as World[]);
    }
  }, [user]);

  const fetchWorldById = useCallback(async (id: string) => {
    const data = await worldAction(() =>
      supabase.from('worlds').select('*').eq('id', id).single()
    );
    if (data) {
        const world = data as unknown as World
        setCurrentWorld(world);
        return world
    }
    return null
  }, []);

  const createWorld = useCallback(
    async (worldData: Pick<World, 'title' | 'description'>) => {
      if (!user) return null;
      const data = await worldAction(() =>
        supabase
          .from('worlds')
          .insert([{ ...worldData, owner_id: user.id }])
          .select()
      );
      
      if (data) {
        const newWorld = (data as unknown as World[])[0];
        setWorlds((prev) => [...prev, newWorld]);
        return newWorld;
      }
      return null;
    },
    [user]
  );

  const deleteWorld = useCallback(async (id: string) => {
    const data = await worldAction(() =>
      supabase.from('worlds').delete().eq('id', id).select()
    );

    if (data) {
        setWorlds((prev) => prev.filter((w) => w.id !== id));
        return true
    }
    return false
  }, []);

  return {
    worlds,
    currentWorld,
    isLoading,
    error,
    fetchAllWorlds,
    fetchWorldById,
    createWorld,
    deleteWorld,
  };
};
