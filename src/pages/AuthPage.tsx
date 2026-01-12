import { useLocation, Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import PasswordResetForm from '../components/auth/PasswordResetForm';
import UpdatePasswordForm from '../components/auth/UpdatePasswordForm';

const AuthPage = () => {
  const location = useLocation();

  // 現在のパスに応じて表示するフォームを決定
  const renderForm = () => {
    switch (location.pathname) {
      case '/auth/login':
        return <LoginForm />;
      case '/auth/signup':
        return <SignUpForm />;
      case '/auth/password-reset':
        return <PasswordResetForm />;
      case '/auth/update-password':
        // このルートはメールのリンクからのみアクセスされる想定
        return <UpdatePasswordForm />;
      default:
        return <LoginForm />;
    }
  };

  // ログイン/新規登録の切り替えリンク
  const renderLink = () => {
    if (location.pathname === '/auth/login') {
      return <p>アカウントをお持ちでないですか？ <Link to="/auth/signup">アカウント作成</Link></p>;
    } else if (location.pathname === '/auth/signup') {
      return <p>すでにアカウントをお持ちですか？ <Link to="/auth/login">ログイン</Link></p>;
    }
    return null; // パスワードリセット画面などでは表示しない
  };

  return (
    <div>
      <header>
        <Link to="/"><h1>links MAP</h1></Link>
      </header>
      <main>
        {renderForm()}
        {renderLink()}
        {location.pathname === '/auth/login' && (
          <p><Link to="/auth/password-reset">パスワードを忘れましたか？</Link></p>
        )}
      </main>
    </div>
  );
};

export default AuthPage;
