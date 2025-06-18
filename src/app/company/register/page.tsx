import { Suspense } from 'react'
import { CompanyRegistrationForm } from '@/components/company/CompanyRegistrationForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CompanyRegistrationPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container max-w-4xl py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <CompanyRegistrationForm />
      </Suspense>
    </div>
  )
} 