// File Path: src/constants/paths.ts
// File Name: paths.ts
// Overview: アプリケーション全体のルーティングパスを一元管理

export const ROUTES = {
	HOME: '/',
	DASHBOARD: '/dashboard',
	AUTH: {
		UPDATE_PASSWORD: '/auth/update-password',
		// LOGIN: '/auth/login', // 将来用
	},
} as const;