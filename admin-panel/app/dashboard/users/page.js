'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardUsersPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main users page
    router.push('/users');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 