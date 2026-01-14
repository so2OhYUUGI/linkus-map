// File Path: src/constants/sampleDataNobunaga.ts
// Overview: Sample data for development and testing.
// Architecture:
//  - Exports a constant `SAMPLE_WORLD_NOBUNAGA` containing a rich set of interconnected data.
//  - This data is designed to be compatible with the database schema and can be used for seeding.
// Usage Guidelines:
//  - Import this constant for testing components or seeding a development database.

import type { World, Entity, Connection, ConnectionTag } from '@/types/db';

const WORLD_ID = 'world-nobunaga-sengoku';

// --- Entities (人物、組織、出来事など) ---
export const ENTITIES_NOBUNAGA: Entity[] = [
  // 主要人物 (5)
  { id: 'person-nobunaga', world_id: WORLD_ID, name: '織田信長' },
  { id: 'person-hideyoshi', world_id: WORLD_ID, name: '豊臣秀吉' },
  { id: 'person-ieyasu', world_id: WORLD_ID, name: '徳川家康' },
  { id: 'person-mitsuhide', world_id: WORLD_ID, name: '明智光秀' },
  { id: 'person-nohime', world_id: WORLD_ID, name: '濃姫' },

  // 織田家関連 (5)
  { id: 'person-nobuhide', world_id: WORLD_ID, name: '織田信秀' }, // 父
  { id: 'person-oichi', world_id: WORLD_ID, name: 'お市の方' }, // 妹
  { id: 'person-katsuie', world_id: WORLD_ID, name: '柴田勝家' }, // 家臣
  { id: 'person-ranmaru', world_id: WORLD_ID, name: '森蘭丸' }, // 小姓
  { id: 'organization-oda-clan', world_id: WORLD_ID, name: '織田家' },

  // 他大名・武将 (5)
  { id: 'person-dosan', world_id: WORLD_ID, name: '斎藤道三' }, // 義父
  { id: 'person-nagamasa', world_id: WORLD_ID, name: '浅井長政' }, // 義弟→敵
  { id: 'person-yoshimoto', world_id: WORLD_ID, name: '今川義元' },
  { id: 'person-shingen', world_id: WORLD_ID, name: '武田信玄' },
  { id: 'person-kenshin', world_id: WORLD_ID, name: '上杉謙信' },

  // 出来事・場所 (5)
  { id: 'event-okehazama', world_id: WORLD_ID, name: '桶狭間の戦い' },
  { id: 'event-honnoji', world_id: WORLD_ID, name: '本能寺の変' },
  { id: 'location-azuchi', world_id: WORLD_ID, name: '安土城' },
  { id: 'location-owari', world_id: WORLD_ID, name: '尾張国' },
  { id: 'location-mino', world_id: WORLD_ID, name: '美濃国' },
];

// --- Connection Tags (関係性の種類) ---
export const CONNECTION_TAGS_NOBUNAGA: ConnectionTag[] = [
  // 人間関係
  { id: 'tag-family', text: '家族', inverse_text: '家族', graph_type: 'edge' },
  { id: 'tag-vassal', text: '主君', inverse_text: '家臣', graph_type: 'edge' },
  { id: 'tag-spouse', text: '配偶者', inverse_text: '配偶者', graph_type: 'edge' },
  { id: 'tag-ally', text: '同盟', inverse_text: '同盟', graph_type: 'edge' },
  { id: 'tag-hostile', text: '敵対', inverse_text: '敵対', graph_type: 'edge' },
  { id: 'tag-betrayal', text: '裏切り', inverse_text: '裏切られた', graph_type: 'edge' },
  
  // 所属・所有
  { id: 'tag-affiliation', text: '所属', inverse_text: '構成員', graph_type: 'edge' },
  { id: 'tag-ruler', text: '支配者', inverse_text: '領地', graph_type: 'edge' },
  { id: 'tag-builder', text: '築城主', inverse_text: '城' , graph_type: 'edge'},
  
  // イベント
  { id: 'tag-participant', text: '参加', inverse_text: '参加者', graph_type: 'edge' },
  { id: 'tag-victim', text: '被害者', inverse_text: '加害者', graph_type: 'edge' },
];

// --- Connections (エンティティ間の関係) ---
export const CONNECTIONS_NOBUNAGA: Connection[] = [
  // === 織田信長を中心に (8割) ===
  // 家族
  { id: 'conn-1', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-nohime', tag_id: 'tag-spouse' },
  { id: 'conn-2', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-nobuhide', tag_id: 'tag-family', content: '父子関係' },
  { id: 'conn-3', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-oichi', tag_id: 'tag-family', content: '兄妹関係' },
  { id: 'conn-4', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-dosan', tag_id: 'tag-family', content: '舅（しゅうと）' },

  // 家臣
  { id: 'conn-5', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-hideyoshi', tag_id: 'tag-vassal' },
  { id: 'conn-6', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-mitsuhide', tag_id: 'tag-vassal' }, // 裏切り前の関係
  { id: 'conn-7', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-katsuie', tag_id: 'tag-vassal' },
  { id: 'conn-8', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-ranmaru', tag_id: 'tag-vassal' },

  // 同盟と敵対
  { id: 'conn-9', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-ieyasu', tag_id: 'tag-ally', content: '清洲同盟' },
  { id: 'conn-10', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-nagamasa', tag_id: 'tag-ally', content: '妹・お市が嫁ぐ' }, // 同盟関係
  { id: 'conn-11', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-nagamasa', tag_id: 'tag-hostile', content: '姉川の戦い' }, // 敵対関係 (多重線)
  { id: 'conn-12', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-shingen', tag_id: 'tag-hostile' },
  { id: 'conn-13', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'person-kenshin', tag_id: 'tag-hostile' },

  // 出来事
  { id: 'conn-14', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'event-okehazama', tag_id: 'tag-participant', content: '今川義元を討ち取る' },
  { id: 'conn-15', world_id: WORLD_ID, from_id: 'event-honnoji', to_id: 'person-nobunaga', tag_id: 'tag-victim' }, // 被害者としての関係
  { id: 'conn-16', world_id: WORLD_ID, from_id: 'person-mitsuhide', to_id: 'event-honnoji', tag_id: 'tag-participant', content: '首謀者' }, // 加害者 (双方向)
  
  // 裏切り (双方向)
  { id: 'conn-17', world_id: WORLD_ID, from_id: 'person-mitsuhide', to_id: 'person-nobunaga', tag_id: 'tag-betrayal' },
  
  // 所属・支配
  { id: 'conn-18', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'organization-oda-clan', tag_id: 'tag-affiliation', content: '当主' },
  { id: 'conn-19', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'location-owari', tag_id: 'tag-ruler' },
  { id: 'conn-20', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'location-mino', tag_id: 'tag-ruler', content: '斎藤家から奪取' },
  { id: 'conn-21', world_id: WORLD_ID, from_id: 'person-nobunaga', to_id: 'location-azuchi', tag_id: 'tag-builder' },

  // === その他の関係 (2割) ===
  // 濃姫と斎藤道三
  { id: 'conn-22', world_id: WORLD_ID, from_id: 'person-nohime', to_id: 'person-dosan', tag_id: 'tag-family', content: '父娘関係' },
  
  // お市と浅井長政
  { id: 'conn-23', world_id: WORLD_ID, from_id: 'person-oichi', to_id: 'person-nagamasa', tag_id: 'tag-spouse' },
  
  // 桶狭間の戦い
  { id: 'conn-24', world_id: WORLD_ID, from_id: 'event-okehazama', to_id: 'person-yoshimoto', tag_id: 'tag-victim' },
  
  // 織田家
  { id: 'conn-25', world_id: WORLD_ID, from_id: 'person-katsuie', to_id: 'organization-oda-clan', tag_id: 'tag-affiliation' },
];

// --- World (全体) ---
export const WORLD_NOBUNAGA: World = {
  id: WORLD_ID,
  owner_id: 'user-dev-owner', // 仮のオーナーID
  title: '織田信長の人間関係図',
  description: '戦国時代の武将・織田信長を中心とした、歴史上の人物・出来事の関係性を可視化したサンプルデータです。',
};

// --- Sample Data Object ---
export const SAMPLE_WORLD_NOBUNAGA = {
  world: WORLD_NOBUNAGA,
  entities: ENTITIES_NOBUNAGA,
  connections: CONNECTIONS_NOBUNAGA,
  connectionTags: CONNECTION_TAGS_NOBUNAGA,
};
