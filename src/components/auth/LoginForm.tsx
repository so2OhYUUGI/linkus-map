import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`エラー: ${error.message}`);
    } else {
      setMessage('ログインに成功しました。');
      // ここでダッシュボードなどにリダイレクト
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>ログイン</h2>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">ログイン</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default LoginForm;
