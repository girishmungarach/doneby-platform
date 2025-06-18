'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ProfileWizard } from '@/components/profile/ProfileWizard';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if profile is already completed
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile?.is_profile_completed) {
        router.push('/dashboard');
      }
    };

    checkProfile();
  }, [router, supabase]);

  return (
    <main className="min-h-screen bg-background">
      <ProfileWizard />
    </main>
  );
} 