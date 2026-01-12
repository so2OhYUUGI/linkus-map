# links MAP：プロジェクト設計指針（Blueprint）

## 1. プロジェクト概要
本作は、ユーザーが複数の「作品世界（World）」を管理し、その中の実体と関係性をグラフ構造で可視化・編集する創作支援エディタである。
「点（Entity）」と「線（Connection）」の組み合わせにより、複雑な物語の相関図を動的に構築する。

## 2. コア思想：Everything is a Connection
本システムは、情報の重複を排除し、かつ柔軟な拡張性を持たせるため、以下の設計思想を徹底する。

- **Entities（実体）の極小化**: 
  Entityテーブルは名前と識別子のみを持つ。その他の属性（プロフィール、外見、設定など）はここには持たせない。
- **Connections（関係性）への集約**: 
  あらゆる属性、エピソード、キャラクター同士の因縁は、すべてConnectionテーブルに集約する。
- **自己参照プロフィール (The Heart of the System)**:
  - `from_id` と `to_id` が同一のConnectionを、その実体自身の「詳細・プロフィール」として定義する。
  - これにより、「自分自身との関係」が「自分自身の説明」となる極めて抽象度の高いデータモデルを実現する。

## 3. 実装ガイドライン（Frontend / UI）

### A. データの描画ロジック（React Flow）
`connection_tags.graph_type` の値に応じて、描画エンジン（React Flow）での振る舞いを出し分ける。
- **'self'**: グラフ上の「線（Edge）」としては描画しない。ノードを選択した際に表示される詳細パネルのエディタ（Markdown等）として扱う。
- **'edge'**: 標準的な二点間の接続線として描画する。
- **'box'**: `to_id` を `from_id` の `parentNode`（親要素）として設定し、包含関係（グループ化）を視覚化する。
- **'flow'**: 時間軸に沿った連続的な矢印として描画する。

### B. ユーザー体験（UX）の要請
ユーザーにデータベース構造を意識させてはならない。
- ユーザーがノード名を編集すれば `entities` を更新する。
- ユーザーが「詳細メモ」を記述すれば、裏側で「自己参照Connection」を更新または生成する。

## 4. セキュリティと共有
- **マルチテナント**: すべてのデータは `world_id` に紐づき、所有者（owner_id）のみがアクセスできる。
- **QR共有機能**: `access_tickets` を発行し、特定のトークンを持つゲストにのみ、期間限定で特定ワールドまたはエンティティへの編集権限を付与する。

## 5. 開発ロードマップ（AIエージェントへの指示）

### フェーズ1：コア機能の実装（最優先）
1. `docs/schema.sql` に基づくSupabaseのテーブル構築。
2. Entity作成時に「プロフィール用自己参照Connection」を自動生成するロジックの実装。
3. React Flowを用いた、ノードの追加と詳細表示（サイドパネル）のプロトタイプ作成。

### フェーズ2：関係性の可視化
1. 異なるEntity間を線で繋ぎ、Connection（エピソード）を保存する機能。
2. 包含関係（'box'）の描画サポート。

### フェーズ3：共有とアカウント管理
1. `access_tickets` を用いたゲスト編集機能。
2. Supabase Authによるログイン・作品管理画面。

## 6. データベーススキーマ

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
INSERT INTO connection_tags (text, graph_type, is_system_preset)
VALUES ('プロフィール', 'self', true);