// src/hooks/useAuth/index.ts
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContextInstance';

/**
 * 認証に関するすべての状態とアクションにアクセスするための統合フック。
 * 今後はこの useAuth のみを使用してください。
 */

export const useAuth = () => useContext(AuthContext);
