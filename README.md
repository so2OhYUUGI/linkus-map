LinkusMap

創作設定を“有機的につなぐ”ための世界管理アプリ
企画書 & 開発ロードマップ

⸻

1. 企画書（Project Proposal）

⸻

1.1 プロジェクト概要

プロジェクト名

LinkusMap（リンクスマップ）

コンセプト

創作活動における「名前」「出来事」「関係性」を
時系列と相互関係のネットワークとして可視化・管理する

小説・TRPG・ゲーム設定・世界観構築などにおいて、
	•	人物
	•	事件
	•	組織
	•	概念

といった要素が複雑に絡み合う課題を解決する。

⸻

1.2 解決したい課題（Why）

既存の創作管理ツールの問題点
	•	人物・事件・組織が 別々のメモに分断される
	•	時系列が「日時ベース」で固定され、創作の自由度が低い
	•	関係性の変化（事件を境に敵対・和解など）が管理しづらい
	•	他人に一部設定だけ考えてもらうことが難しい
	•	視覚的に全体像を把握できない

⸻

1.3 提供価値（Value）

LinkusMapが提供する価値
	1.	すべてを「Name」として統合管理
	•	人物 / 事件 / 組織 / 概念を同一構造で扱える
	2.	日時に縛られない時系列管理
	•	「Aの後にBが起きた」という関係性で物語を構築
	3.	関係性のネットワーク可視化
	•	マインドマップ的・グラフ構造で世界を俯瞰
	4.	第三者入力を可能にするQRワンタイム編集
	•	アカウント不要で部分的な設定委任が可能
	5.	ワールド単位の厳密なアクセス管理
	•	公開・共同制作・個人制作すべてに対応

  
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
