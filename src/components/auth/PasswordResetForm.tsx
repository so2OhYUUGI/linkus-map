import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

const PasswordResetForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setMessage(`エラー: ${error.message}`);
    } else {
      setMessage('パスワードリセット用のメールを送信しました。');
    }
  };

  return (
    <form onSubmit={handlePasswordReset}>
      <h2>パスワードリセット</h2>
      <p>アカウントのメールアドレスを入力してください。パスワードリセット用のリンクを送信します。</p>
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
      <button type="submit">リセットメールを送信</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default PasswordResetForm;
