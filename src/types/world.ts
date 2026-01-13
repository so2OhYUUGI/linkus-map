// File Path: src/types/world.ts

export interface World {
  id: string;
  owner_id: string;
  title: string;
  description?: string | null;
  created_at: string;
}

// NewWorld型を定義し、エクスポートする
export type NewWorld = Pick<World, 'title' | 'description'>;
