import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ApplicantProfileModal } from './ApplicantProfileModal'
import { SurveyScoreBadge } from './SurveyScoreBadge'
import { VerificationBadge } from './VerificationBadge'
import { TrustScore } from './TrustScore'
import { MessageSquare, Calendar, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react'

// Dummy data types for illustration
interface Applicant {
  id: string
  name: string
  email: string
  avatar: string
  verificationScore: number
  trustScore: number
  skillsMatch: number
  surveyScore: number
  status: string
  appliedAt: string
  profileVerified: boolean
  surveyResponses: any
}

const dummyApplicants: Applicant[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: '',
    verificationScore: 95,
    trustScore: 90,
    skillsMatch: 88,
    surveyScore: 92,
    status: 'review',
    appliedAt: '2024-06-01',
    profileVerified: true,
    surveyResponses: {},
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: '',
    verificationScore: 80,
    trustScore: 75,
    skillsMatch: 70,
    surveyScore: 85,
    status: 'interview',
    appliedAt: '2024-06-02',
    profileVerified: false,
    surveyResponses: {},
  },
]

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'review', label: 'Review' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
]

export function ApplicantList() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('verificationScore')
  const [selected, setSelected] = useState<string[]>([])
  const [showProfile, setShowProfile] = useState<Applicant | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])

  useEffect(() => {
    // Replace with API call
    setApplicants(dummyApplicants)
  }, [])

  const filtered = applicants
    .filter(a => (status === 'all' ? true : a.status === status))
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[sort as keyof Applicant] - a[sort as keyof Applicant])

  const handleBulkAction = (action: string) => {
    // Implement bulk action logic
    alert(`Bulk action: ${action} on ${selected.length} applicants`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
        <Input
          placeholder="Search applicants..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verificationScore">Verification Score</SelectItem>
            <SelectItem value="skillsMatch">Skills Match</SelectItem>
            <SelectItem value="surveyScore">Survey Score</SelectItem>
            <SelectItem value="trustScore">Trust Score</SelectItem>
          </SelectContent>
        </Select>
        {selected.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('moveToInterview')}>Move to Interview</Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>Reject</Button>
          </div>
        )}
      </div>
      <Card className="overflow-x-auto">
        <CardContent className="p-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-2"><Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={checked => setSelected(checked ? filtered.map(a => a.id) : [])} /></th>
                <th className="p-2 text-left">Applicant</th>
                <th className="p-2 text-left">Verification</th>
                <th className="p-2 text-left">Skills Match</th>
                <th className="p-2 text-left">Survey</th>
                <th className="p-2 text-left">Trust</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Applied</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(applicant => (
                <tr key={applicant.id} className="border-b hover:bg-accent transition">
                  <td className="p-2"><Checkbox checked={selected.includes(applicant.id)} onCheckedChange={checked => setSelected(checked ? [...selected, applicant.id] : selected.filter(id => id !== applicant.id))} /></td>
                  <td className="p-2 flex items-center gap-2 cursor-pointer" onClick={() => setShowProfile(applicant)}>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                      {applicant.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{applicant.name}</div>
                      <div className="text-xs text-muted-foreground">{applicant.email}</div>
                    </div>
                    {applicant.profileVerified && <VerificationBadge />}
                  </td>
                  <td className="p-2"><Badge variant="outline">{applicant.verificationScore}</Badge></td>
                  <td className="p-2"><Badge variant="outline">{applicant.skillsMatch}%</Badge></td>
                  <td className="p-2"><SurveyScoreBadge score={applicant.surveyScore} /></td>
                  <td className="p-2"><TrustScore score={applicant.trustScore} /></td>
                  <td className="p-2">
                    {applicant.status === 'review' && <Badge variant="secondary">Review</Badge>}
                    {applicant.status === 'interview' && <Badge variant="default">Interview</Badge>}
                    {applicant.status === 'offer' && <Badge variant="success">Offer</Badge>}
                    {applicant.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                  </td>
                  <td className="p-2">{applicant.appliedAt}</td>
                  <td className="p-2 flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setShowProfile(applicant)}><MoreHorizontal className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost"><MessageSquare className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost"><Calendar className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">No applicants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {showProfile && <ApplicantProfileModal applicant={showProfile} onClose={() => setShowProfile(null)} />}
    </div>
  )
} 