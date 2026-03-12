'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

  useEffect(() => {
        // Redirect to home page
                router.push('/');
  }, [router]);

  return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontFamily: 'system-ui, sans-serif',
          background: '#0a0a0a',
          color: '#fff'
  }}>
      <p>Redirecting...</p>
  </div>
  );
}
