'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowRightLine } from 'react-icons/ri';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth');
  }, [router]);

  return null; // No need to render anything as we're redirecting
}
