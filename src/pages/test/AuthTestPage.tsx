import React from 'react';
import AuthForm from '../../components/auth/AuthForm'; // パスの階層が深くなるため変更
import { Container } from '@mui/material';

const AuthTestPage: React.FC = () => {
  return (
    <Container>
      <AuthForm />
    </Container>
  );
};

export default AuthTestPage;
