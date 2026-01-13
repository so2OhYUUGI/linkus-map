import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { World } from '@/types/world';
import { useAuth } from '@/contexts';

export const useWorlds = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [currentWorld, setCurrentWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchAllWorlds = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      setWorlds(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchWorldById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCurrentWorld(data);
      return data;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorld = useCallback(
    async (worldData: Pick<World, 'title' | 'description'>) => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('worlds')
          .insert([{ ...worldData, owner_id: user.id }])
          .select();

        if (error) throw error;
        if (data) {
          setWorlds((prev) => [...prev, data[0]]);
          return data[0];
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const deleteWorld = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('worlds').delete().eq('id', id);

      if (error) throw error;
      setWorlds((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    worlds,
    currentWorld,
    loading,
    error,
    fetchAllWorlds,
    fetchWorldById,
    createWorld,
    deleteWorld,
  };
};
