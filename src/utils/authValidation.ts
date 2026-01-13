// src/utils/authValidation.ts

export const validateSignUp = (password: string, passwordConfirm: string): string | null => {
	if (password !== passwordConfirm) {
		return 'パスワードが一致しません。';
	}
	if (password.length < 6) {
		return 'パスワードは6文字以上である必要があります。';
	}
	return null;
};