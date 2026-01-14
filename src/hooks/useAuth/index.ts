// src/hooks/useAuth/index.ts
import { useAuthContext } from '@/contexts/AuthContext';

/**
 * 認証に関するすべての状態とアクションにアクセスするための統合フック。
 * 今後はこの useAuth のみを使用してください。
 */
export const useAuth = () => {
	return useAuthContext();
};