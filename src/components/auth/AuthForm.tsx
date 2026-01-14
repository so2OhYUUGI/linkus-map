// src/components/auth/AuthForm.tsx

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Link, Alert, Stack, useTheme } from '@mui/material';
import { useAuthContext } from '@/contexts/AuthContext'; // 1. useAuthContextをインポート
import { useAuthForm } from '@/hooks/useAuthForm';

type AuthMode = 'login' | 'signup' | 'passwordReset';

const AuthForm: React.FC = () => {
  const theme = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 2. useAuthContextから状態とクリア関数を取得
  const {
    isSubmitting,
    error,
    clearError,
  } = useAuthContext();

  // 3. フォームの送信ロジックはAuthForm内に保持
  const {
    message,
    signUp,
    login,
    passwordReset,
    clearMessage,
  } = useAuthForm();


  useEffect(() => {
    clearError();
    clearMessage();
  }, [mode, clearError, clearMessage]);

  const onSignUpSubmit = async () => {
    const success = await signUp(email, password, passwordConfirm);
    if (success) {
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      // メッセージはフック内で設定されるので、ここでは何もしない
    }
  };

  const onLoginSubmit = async () => {
    // ログイン処理を呼び出すだけ。リダイレクトは PublicRoute に任せる。
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
