// File Path: src/hooks/useWorlds.ts
// File Name: useWorlds.ts
// Overview: Hook for managing worlds data, including fetching, creating, and deleting worlds.

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthState } from '@/hooks/useAuthState';
import type { World, NewWorld } from '@/types/world';

export const useWorlds = () => {
  const { user } = useAuthState();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: string) => {
    console.error(message);
    setError('ワールドの操作中に予期しないエラーが発生しました。');
  };

  const fetchAllWorlds = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('owner_id', user.id);
      if (error) throw new Error(error.message);
      setWorlds(data || []);
    } catch {
      handleError('Failed to fetch worlds');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchWorldById = useCallback(async (id: string): Promise<World | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', id)
        .single(); // .single() to get a single record

      if (error) {
        if (error.code === 'PGRST116') { // PostgREST error for "Not a single row"
          console.error(`World with id ${id} not found.`);
          setError('指定されたワールドが見つかりませんでした。');
          return null;
        }
        throw new Error(error.message);
      }
      return data;
    } catch {
      handleError(`Failed to fetch world with id ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createWorld = async (newWorld: NewWorld): Promise<World | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('worlds')
        .insert([{ ...newWorld, owner_id: user.id }])
        .select();
      if (error) throw new Error(error.message);
      if (data && data.length > 0) {
        const createdWorld = data[0];
        setWorlds((prev) => [...prev, createdWorld]);
        return createdWorld;
      }
      return null;
    } catch {
      handleError('Failed to create world');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorld = async (id: string) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('worlds').delete().eq('id', id);
      if (error) throw new Error(error.message);
      setWorlds((prev) => prev.filter((world) => world.id !== id));
    } catch {
      handleError(`Failed to delete world with id ${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    worlds,
    isLoading,
    error,
    fetchAllWorlds,
    fetchWorldById,
    createWorld,
    deleteWorld,
  };
};