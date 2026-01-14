import type { User } from '@supabase/supabase-js';

// コンテキストが提供する値の完全な型定義
export interface AuthContextType {
	// --- from useAuthState ---
	user: User | null;
	isInitialLoading: boolean;
	signOut: () => Promise<void>;

	// --- from useAuthForm ---
	isSubmitting: boolean;
	error: string | null;
	message: string | null;
	signUp: (email: string, password: string, passwordConfirm: string) => Promise<boolean>;
	login: (email: string, password: string) => Promise<boolean>;
	passwordReset: (email: string) => Promise<boolean>;
	clearError: () => void;
	clearMessage: () => void;
}