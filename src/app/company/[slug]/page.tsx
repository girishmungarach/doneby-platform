import { Suspense } from 'react'
import { CompanyProfileDisplay } from '@/components/company/CompanyProfileDisplay'
import { CompanyVerification } from '@/components/company/CompanyVerification'
import { CompanyTeamManagement } from '@/components/company/CompanyTeamManagement'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CompanyProfilePageProps {
  params: {
    slug: string
  }
}

export default async function CompanyProfilePage({ params }: CompanyProfilePageProps) {
  const supabase = createClient()

  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !company) {
    notFound()
  }

  return (
    <div className="container max-w-6xl py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <CompanyProfileDisplay company={company} />
          </TabsContent>

          <TabsContent value="verification">
            <CompanyVerification company={company} />
          </TabsContent>

          <TabsContent value="team">
            <CompanyTeamManagement company={company} />
          </TabsContent>
        </Tabs>
      </Suspense>
    </div>
  )
} 