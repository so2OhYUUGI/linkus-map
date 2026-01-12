import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Link, Alert, Stack, useTheme } from '@mui/material';
import { supabase } from '../../lib/supabase/client'; // Supabaseクライアントをインポート
import { useAuth } from '../../hooks/useAuth';

// フォームのモードを定義
type AuthMode = 'login' | 'signup' | 'passwordReset';

const AuthForm: React.FC = () => {
  const theme = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  // サインアップ用のカスタムフック
  const {
    isLoading: isSignUpLoading,
    error: signUpError,
    message: signUpMessage,
    handleSignUp,
    clearError: clearSignUpError,
    clearMessage: clearSignUpMessage,
  } = useAuth();

  // ログインとパスワードリセット用のローカルステート
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);
  const [passwordResetMessage, setPasswordResetMessage] = useState<string | null>(null);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  // モード変更時にエラーとメッセージをクリア
  useEffect(() => {
    clearSignUpError();
    clearSignUpMessage();
    setLoginError(null);
    setLoginMessage(null);
    setPasswordResetError(null);
    setPasswordResetMessage(null);
  }, [mode, clearSignUpError, clearSignUpMessage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    setLoginMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // エラーメッセージをユーザーフレンドリーな日本語に変換
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'メールアドレスの確認が完了していません。メールボックスを確認してください。';
      }
      setLoginError(errorMessage);
    }
    setLoginLoading(false);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSignUp(email, password, passwordConfirm);
    if (success) {
      // 成功時はログインフォームに切り替え
      setMode('login');
      // フォームをリセット
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordResetLoading(true);
    setPasswordResetError(null);
    setPasswordResetMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) {
      // エラーメッセージをユーザーフレンドリーな日本語に変換
      let errorMessage = error.message;
      if (error.message.includes('rate limit')) {
        errorMessage = 'リクエストが多すぎます。しばらく待ってから再度お試しください。';
      }
      setPasswordResetError(errorMessage);
    } else {
      setPasswordResetMessage('パスワードリセット用のメールを送信しました。');
      setMode('login');
    }
    setPasswordResetLoading(false);
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
      
      {/* エラーとメッセージの表示 */}
      {mode === 'signup' && signUpError && (
        <Alert severity="error" sx={{ mb: theme.spacing(2) }}>
          {signUpError}
        </Alert>
      )}
      {mode === 'signup' && signUpMessage && (
        <Alert severity="success" sx={{ mb: theme.spacing(2) }}>
          {signUpMessage}
        </Alert>
      )}
      {mode === 'login' && loginError && (
        <Alert severity="error" sx={{ mb: theme.spacing(2) }}>
          {loginError}
        </Alert>
      )}
      {mode === 'login' && loginMessage && (
        <Alert severity="success" sx={{ mb: theme.spacing(2) }}>
          {loginMessage}
        </Alert>
      )}
      {mode === 'passwordReset' && passwordResetError && (
        <Alert severity="error" sx={{ mb: theme.spacing(2) }}>
          {passwordResetError}
        </Alert>
      )}
      {mode === 'passwordReset' && passwordResetMessage && (
        <Alert severity="success" sx={{ mb: theme.spacing(2) }}>
          {passwordResetMessage}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={
            mode === 'login' ? handleLogin :
            mode === 'signup' ? handleSignUpSubmit :
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
        <Stack spacing={2}>
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            disabled={
              mode === 'signup' ? isSignUpLoading :
              mode === 'login' ? loginLoading :
              passwordResetLoading
            }
          >
            {mode === 'signup' && isSignUpLoading && '処理中...'}
            {mode === 'signup' && !isSignUpLoading && titles[mode]}
            {mode === 'login' && loginLoading && '処理中...'}
            {mode === 'login' && !loginLoading && titles[mode]}
            {mode === 'passwordReset' && passwordResetLoading && '処理中...'}
            {mode === 'passwordReset' && !passwordResetLoading && titles[mode]}
          </Button>
          
          {mode === 'login' && (
            <>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => setMode('passwordReset')}
                sx={{ 
                  textAlign: 'center',
                  display: 'block',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                パスワードを忘れた方はこちら
              </Link>
            </>
          )}
        </Stack>
      </Box>

      <Box textAlign="center" sx={{ mt: 3 }}>
        {mode === 'login' && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setMode('signup')}
          >
            アカウントの作成
          </Button>
        )}
        {mode === 'signup' && (
          <Link 
            component="button" 
            variant="body2" 
            onClick={() => setMode('login')}
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            すでにアカウントをお持ちですか？ ログイン
          </Link>
        )}
        {mode === 'passwordReset' && (
          <Link 
            component="button" 
            variant="body2" 
            onClick={() => setMode('login')}
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            ログインページに戻る
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default AuthForm;
