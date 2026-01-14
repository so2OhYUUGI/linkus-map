/*
 * File Path: src/contexts/AuthContextInstance.ts
 * Overview: AuthContextの実体を定義する。Fast Refreshのエラー回避のため、Providerとは分離。
 * Architecture: Context (Instance)
 */
import { createContext } from 'react';
import type { AuthContextType } from '@/types/auth'; // 型定義が別にある場合

export const AuthContext = createContext<AuthContextType | undefined>(undefined);