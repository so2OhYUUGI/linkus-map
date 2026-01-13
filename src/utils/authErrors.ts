// src/utils/authErrors.ts

/**
 * Supabaseの英語エラーメッセージを日本語に変換する
 */
export const translateAuthError = (message: string): string => {
	if (message.includes('already registered')) {
		return 'このメールアドレスは既に登録されています。ログインしてください。';
	}
	if (message.includes('invalid email')) {
		return '有効なメールアドレスを入力してください。';
	}
	if (message.includes('password')) {
		return 'パスワードが弱すぎます。より強力なパスワードを設定してください。';
	}
	if (message.includes('rate limit')) {
		return 'リクエストが多すぎます。しばらく待ってから再度お試しください。';
	}
	if (message.includes('Invalid login credentials')) {
		return 'メールアドレスまたはパスワードが正しくありません。';
	}
	if (message.includes('Email not confirmed')) {
		return 'メールアドレスの確認が完了していません。メールボックスを確認してください。';
	}

	return message; // 該当がない場合は元のメッセージを返す
};