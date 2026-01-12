# 🗺️ LinkusMap

**創作設定を“有機的につなぐ”ための世界管理アプリ**
> 企画書 & 開発ロードマップ

---

## 1. 企画書（Project Proposal）

### 1.1 プロジェクト概要

| 項目 | 内容 |
| :--- | :--- |
| **プロジェクト名** | LinkusMap（リンクスマップ） |
| **コンセプト** | 「名前」「出来事」「関係性」を時系列とネットワークで可視化・管理する |
| **対象** | 小説、TRPG、ゲーム設定、世界観構築など |

創作活動において、以下の要素が複雑に絡み合う課題を解決します。
* 👤 **人物** (Characters)
* 🔥 **事件** (Events)
* 🛡️ **組織** (Organizations)
* 💡 **概念** (Concepts)

---

### 1.2 解決したい課題（Why）

既存の創作管理ツールには、以下のような限界が存在します。

* **情報の断片化**: 人物・事件・組織が別々のメモに分断され、連動しない。
* **固定的な時系列**: 現実の「日時ベース」に縛られ、因果関係による物語構築がしづらい。
* **動的な関係性への非対応**: 事件を境にした敵対・和解などの変遷が管理しづらい。
* **協力のハードル**: 他人に「一部の設定だけ」を考えてもらう際の共有が困難。
* **全体像の欠如**: 膨大な設定を視覚的に俯瞰する手段がない。

---

### 1.3 提供価値（Value）

LinkusMapは、これまでの管理ツールとは一線を画す**5つのコアバリュー**を提供します。

#### 1. すべてを「Name」として統合管理
人物・事件・組織・概念を同一のデータ構造（Name）として扱います。属性を超えた自由な紐付けが可能です。

#### 2. 日時に縛られない時系列管理
「西暦◯年」といった数値だけでなく、「事象Aの後に事象Bが起きた」という**相対的な因果関係**で物語の骨組みを構築できます。

#### 3. 関係性のネットワーク可視化
マインドマップやグラフ構造を用いて、世界全体を俯瞰。関係性の変化を時系列に沿ってアニメーション確認することも可能です。

#### 4. QRワンタイム編集
アカウント不要で、特定の設定項目だけを第三者に委任できる「QRワンタイム編集権限」を発行。友人にNPCの名前や武器設定だけを頼むといった、新しい共同創作の形を提案します。

#### 5. ワールド単位の厳密なアクセス管理
個人での「秘匿設定」から、チームでの「共同制作」、ファンへの「一般公開」まで、ワールドごとに柔軟な権限設定を実現します。

---

## 2. 開発ロードマップ（Roadmap）

- [x] プロジェクト企画・UI/UXコンセプト設計
- [ ] 認証基盤（Supabase Auth）実装
- [ ] 基礎的な「Name」エンティティの登録機能
- [ ] グラフ描画エンジンによる可視化プロトタイプ
- [ ] QR共有・ワンタイム編集機能の実装

---
© 2026 LinkusMap Project. Built for Creators.

  
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
