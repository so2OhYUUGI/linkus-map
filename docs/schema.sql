-- 1. 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ワールドテーブル（作品のルート）
CREATE TABLE worlds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL, -- auth.users.id
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 3. エンティティテーブル（点：名前のみ保持）
CREATE TABLE entities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. コネクションタグテーブル（線の意味と描画ルール）
CREATE TABLE connection_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  text text NOT NULL, -- "プロフィール", "宿敵", "親子" など
  inverse_text text, -- 逆向きの名称
  graph_type text NOT NULL, -- 'self', 'edge', 'box', 'flow'
  style_json jsonb,
  is_system_preset boolean DEFAULT false
);

-- 5. コネクションテーブル（すべての情報のハブ）
CREATE TABLE connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  from_id uuid REFERENCES entities(id) ON DELETE CASCADE,
  to_id uuid REFERENCES entities(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES connection_tags(id),
  content text, -- Markdown形式の詳細メモ
  context_event_id uuid REFERENCES entities(id), -- 起点となった事件ID
  created_at timestamptz DEFAULT now()
);

-- 6. アクセスチケット（QRコード共有用）
CREATE TABLE access_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  target_entity_id uuid REFERENCES entities(id),
  token uuid DEFAULT uuid_generate_v4() UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 初期データの投入（プロフィール用タグをあらかじめ作成）
-- このタグはどのワールドにも属さないグローバルなプリセットとして作成します。
INSERT INTO connection_tags (text, graph_type, is_system_preset)
VALUES ('プロフィール', 'self', true);
