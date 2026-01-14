// src/components/auth/AuthForm.tsx

/*
 * [アーキテクチャ設計方針]
 * このコンポーネントは、認証フォームの「ビュー」に責務を特化させています。
 * フォームの見た目と、ユーザー操作（入力、ボタンクリック）のみを扱い、
 * 認証ロジック（API通信、状態管理）はすべて `useAuthContext` を経由して取得します。
 *
 * ◆ 利用規約:
 * ・ 認証関連のロジックは `useAuthContext` フックからのみ取得してください。
 * ・ `useAuthForm` や `useAuthState` といった下位のフックを直接利用することは禁止です。
 */

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Link, Alert, Stack, useTheme } from '@mui/material';
import { useAuthContext } from '@/contexts'; // 集約されたindex.ts経由でインポート

type AuthMode = 'login' | 'signup' | 'passwordReset';

const AuthForm: React.FC = () => {
  const theme = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // AuthContextから必要なすべての状態と関数を取得
  const {
    isSubmitting,
    error,
    message,
    signUp,
    login,
    passwordReset,
    clearError,
    clearMessage,
  } = useAuthContext();

  // フォームの種類（mode）が切り替わった時に、エラーとメッセージをクリアする
  useEffect(() => {
    clearError();
    clearMessage();
  }, [mode, clearError, clearMessage]);

  // --- フォーム送信ハンドラ --- //

  const onSignUpSubmit = async () => {
    const success = await signUp(email, password, passwordConfirm);
    if (success) {
      // 成功した場合、入力フィールドをクリア
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      // 成功メッセージはContext側で設定される
    }
  };

  const onLoginSubmit = async () => {
    // ログイン処理を呼び出すだけ。成功後のリダイレクトは上位のRouteコンポーネントが責務を持つ。
    await login(email, password);
  };

  const onResetSubmit = async () => {
    const success = await passwordReset(email);
    if (success) {
      setEmail('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') onLoginSubmit();
    else if (mode === 'signup') onSignUpSubmit();
    else onResetSubmit();
  };

  // --- レンダリング --- //

  const titles = {
    login: 'ログイン',
    signup: 'アカウント作成',
    passwordReset: 'パスワードをリセット',
  };

  return (
    <Box
      sx={{
        maxWidth: theme.spacing(50),
        mx: 'auto',
        mt: 8,
        p: 3,
        boxShadow: 3,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {titles[mode]}
      </Typography>

      {/* エラーまたは成功メッセージをContextから受け取って表示 */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="メールアドレス"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        {mode !== 'passwordReset' && (
          <TextField
            label="パスワード"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}
        {mode === 'signup' && (
          <TextField
            label="パスワード（確認用）"
            type="password"
            fullWidth
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}

        <Stack spacing={2}>
          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
            {isSubmitting ? '処理中...' : titles[mode]}
          </Button>

          {mode === 'login' && (
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => setMode('passwordReset')}
              sx={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}
            >
              パスワードを忘れた方はこちら
            </Link>
          )}
        </Stack>
      </Box>

      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? '新規アカウント作成' : 'ログインページに戻る'}
        </Button>
      </Box>
    </Box>
  );
};

export default AuthForm;
