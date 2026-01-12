import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Alert } from '@mui/material';
import { supabase } from '../../lib/supabase/client'; // Supabaseクライアントをインポート

// フォームのモードを定義
type AuthMode = 'login' | 'signup' | 'passwordReset';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('パスワードが一致しません。');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('確認メールを送信しました。メールボックスを確認してください。');
      setMode('login'); // ログインフォームに切り替え
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage('パスワードリセット用のメールを送信しました。');
      setMode('login');
    }
    setLoading(false);
  };

  const titles = {
    login: 'ログイン',
    signup: 'アカウント作成',
    passwordReset: 'パスワードをリセット',
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {titles[mode]}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

      <Box 
        component="form" 
        onSubmit={
            mode === 'login' ? handleLogin :
            mode === 'signup' ? handleSignUp :
            handlePasswordReset
        }
      >
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
        <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mb: 2 }}>
          {loading ? '処理中...' : titles[mode]}
        </Button>
      </Box>

      <Box textAlign="center">
        {mode === 'login' && (
          <>
            <Link component="button" variant="body2" onClick={() => setMode('signup')}>
              アカウントをお持ちでないですか？ 新規作成
            </Link>
            <br />
            <Link component="button" variant="body2" onClick={() => setMode('passwordReset')}>
              パスワードを忘れましたか？
            </Link>
          </>
        )}
        {mode === 'signup' && (
            <Link component="button" variant="body2" onClick={() => setMode('login')}>
                すでにアカウントをお持ちですか？ ログイン
            </Link>
        )}
        {mode === 'passwordReset' && (
            <Link component="button" variant="body2" onClick={() => setMode('login')}>
                ログインページに戻る
            </Link>
        )}
      </Box>
    </Box>
  );
};

export default AuthForm;
