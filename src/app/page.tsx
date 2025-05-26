'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from './landing';

export default function Home() {
  const router = useRouter();


  useEffect(() => {
    // router.push('/auth');
  }, [router]);

  return <LandingPage />; // No need to render anything as we're redirecting
}
