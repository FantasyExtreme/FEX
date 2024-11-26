'use client';
import UserTeams from '@/components/Components/UserTeams';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';

function MyTeams() {
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  let router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && auth.state === 'anonymous') {
      router.replace('/');
    }
  }, [auth]);
  return (
    <Container fluid className='inner-page '>
      <UserTeams handleGetAssets={null} dashboard={true} />
    </Container>
  );
}

export default MyTeams;
