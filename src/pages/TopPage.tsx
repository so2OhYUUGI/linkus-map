import { Link } from 'react-router-dom';

const TopPage = () => {
  return (
    <div>
      <h1>links MAP</h1>
      <p>物語の相関図を、動的に構築しよう。</p>
      <nav>
        <Link to="/auth/login">ログイン</Link> |{
        ' '}
        <Link to="/auth/signup">アカウント作成</Link>
      </nav>
    </div>
  );
};

export default TopPage;
