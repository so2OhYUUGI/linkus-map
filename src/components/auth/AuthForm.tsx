// src/components/auth/AuthForm.tsx

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Link, Alert, Stack, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthForm } from '../../hooks/useAuthForm'; // <- 更新

type AuthMode = 'login' | 'signup' | 'passwordReset';

const AuthForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 新しいフックと関数名を使用
  const {
    isLoading,
    error,
    message,
    signUp,          // <- 更新
    login,           // <- 更新
    passwordReset,   // <- 更新
    clearError,
    clearMessage,
  } = useAuthForm(); // <- 更新

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
    }
  };

  const onLoginSubmit = async () => {
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
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
          <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
            {isLoading ? '処理中...' : titles[mode]}
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
