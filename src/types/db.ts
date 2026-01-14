// File Path: src/types/db.ts
// Overview: Database schema types
// Architecture:
//  - Defines TypeScript interfaces corresponding to the PostgreSQL schema.
// Usage Guidelines:
//  - Use these types for data consistency across the application.

export interface World {
  id: string; // uuid
  owner_id: string; // uuid
  title: string;
  description?: string;
  created_at?: string; // timestamptz
}

export interface Entity {
  id: string; // uuid
  world_id: string; // uuid
  name: string;
  created_at?: string; // timestamptz
}

export interface ConnectionTag {
  id: string; // uuid
  world_id?: string; // uuid | null for system presets
  text: string;
  inverse_text?: string;
  graph_type: 'self' | 'edge' | 'box' | 'flow';
  style_json?: any; // jsonb
  is_system_preset?: boolean;
}

export interface Connection {
  id: string; // uuid
  world_id: string; // uuid
  from_id: string; // uuid
  to_id: string; // uuid
  tag_id: string; // uuid
  content?: string;
  context_event_id?: string; // uuid
  created_at?: string; // timestamptz
}
