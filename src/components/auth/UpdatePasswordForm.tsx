import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

const UpdatePasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('パスワードが一致しません。');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(`エラー: ${error.message}`);
    } else {
      setMessage('パスワードが正常に更新されました。');
    }
  };

  return (
    <form onSubmit={handleUpdatePassword}>
      <h2>新しいパスワードを設定</h2>
      <div>
        <label htmlFor="password">新しいパスワード</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">新しいパスワード（確認）</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">パスワードを更新</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UpdatePasswordForm;
