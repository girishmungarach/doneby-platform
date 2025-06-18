import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ApplicantList } from './ApplicantList'
import { HiringPipeline } from './HiringPipeline'
import { HiringAnalytics } from './HiringAnalytics'
import { EmployerSettings } from './EmployerSettings'

export function EmployerDashboard() {
  const [tab, setTab] = useState('applications')

  return (
    <div className="container mx-auto px-2 py-6 md:py-10">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold">Employer Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-4">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="applications">
              <ApplicantList />
            </TabsContent>
            <TabsContent value="pipeline">
              <HiringPipeline />
            </TabsContent>
            <TabsContent value="analytics">
              <HiringAnalytics />
            </TabsContent>
            <TabsContent value="settings">
              <EmployerSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 