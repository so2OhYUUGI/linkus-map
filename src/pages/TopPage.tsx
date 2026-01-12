import React from 'react';
import { Link } from 'react-router-dom';

const TopPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1>linkus-map</h1>
      <Link to="/auth">
        <button>Sign In / Sign Up</button>
      </Link>
    </div>
  );
};

export default TopPage;
