import { useState } from 'react'
import { CompanyProfile, CompanyTeamMember, COMPANY_TEAM_ROLES } from '@/lib/types/company'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, UserMinus, Mail, Shield } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CompanyTeamManagementProps {
  company: CompanyProfile
  onUpdate?: (company: CompanyProfile) => void
}

export function CompanyTeamManagement({ company, onUpdate }: CompanyTeamManagementProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const supabase = createClient()

  const handleInviteMember = async () => {
    try {
      setIsLoading(true)
      const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail)
        .single()

      if (userError) throw userError

      const newMember: CompanyTeamMember = {
        id: crypto.randomUUID(),
        user_id: user.id,
        role: selectedRole as any,
        permissions: COMPANY_TEAM_ROLES.find(r => r.role === selectedRole)?.permissions || [],
        joined_at: new Date().toISOString(),
        status: 'pending',
      }

      const updatedMembers = [...company.team_members, newMember]
      const { data: updatedCompany, error: updateError } = await supabase
        .from('companies')
        .update({ team_members: updatedMembers })
        .eq('id', company.id)
        .select()
        .single()

      if (updateError) throw updateError

      toast.success('Team member invited successfully')
      onUpdate?.(updatedCompany)
      setInviteEmail('')
      setSelectedRole('')
    } catch (error) {
      console.error('Error inviting team member:', error)
      toast.error('Failed to invite team member')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      setIsLoading(true)
      const updatedMembers = company.team_members.filter(m => m.id !== memberId)
      const { data: updatedCompany, error: updateError } = await supabase
        .from('companies')
        .update({ team_members: updatedMembers })
        .eq('id', company.id)
        .select()
        .single()

      if (updateError) throw updateError

      toast.success('Team member removed successfully')
      onUpdate?.(updatedCompany)
    } catch (error) {
      console.error('Error removing team member:', error)
      toast.error('Failed to remove team member')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleInfo = COMPANY_TEAM_ROLES.find(r => r.role === role)
    return (
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{roleInfo?.name}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Management</h2>
        <div className="flex items-center gap-4">
          <Input
            type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-64"
          />
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_TEAM_ROLES.map((role) => (
                <SelectItem key={role.role} value={role.role}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleInviteMember}
            disabled={isLoading || !inviteEmail || !selectedRole}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {company.team_members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{member.user_id}</span>
                  </div>
                  {getRoleBadge(member.role)}
                  <p className="text-sm text-muted-foreground">
                    Joined {formatDistanceToNow(new Date(member.joined_at))} ago
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={member.status === 'active' ? 'default' : 'secondary'}
                  >
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={isLoading}
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Descriptions</CardTitle>
          <CardDescription>Available team roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {COMPANY_TEAM_ROLES.map((role) => (
              <div key={role.role} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  <Badge variant="secondary">{role.role}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 