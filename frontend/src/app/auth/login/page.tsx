// app/auth/login/page.tsx
'use client'; // Mark this file as client-side only

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the LoginPage with client-side rendering only
const LoginPage = dynamic(() => import('./login'), { ssr: false });

const Login = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
};

export default Login;
