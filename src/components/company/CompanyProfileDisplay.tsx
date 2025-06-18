import { CompanyProfile } from '@/lib/types/company'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Building2, Globe, MapPin, Users, Calendar, Mail, Phone } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CompanyProfileDisplayProps {
  company: CompanyProfile
}

export function CompanyProfileDisplay({ company }: CompanyProfileDisplayProps) {
  const getVerificationBadge = () => {
    switch (company.verification_status) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-500">Verification in Progress</Badge>
      case 'pending':
        return <Badge className="bg-gray-500">Pending Verification</Badge>
      case 'rejected':
        return <Badge className="bg-red-500">Verification Rejected</Badge>
      case 'suspended':
        return <Badge className="bg-red-500">Suspended</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
        <div className="absolute -bottom-16 left-8">
          <div className="w-32 h-32 rounded-lg border-4 border-background bg-background overflow-hidden">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Building2 className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-20 space-y-6">
        {/* Company Info */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground mt-1">{company.description}</p>
          </div>
          {getVerificationBadge()}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              {company.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {company.headquarters.city}, {company.headquarters.country}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{company.size} employees</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Founded {company.founded_year}</span>
          </div>
        </div>

        <Separator />

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Culture</CardTitle>
              <CardDescription>Our values and work environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Mission</h3>
                <p className="text-sm text-muted-foreground">{company.culture.mission}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vision</h3>
                <p className="text-sm text-muted-foreground">{company.culture.vision}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Work Environment</h3>
                <p className="text-sm text-muted-foreground">{company.culture.work_environment}</p>
              </div>
              {company.culture.values.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Core Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.culture.values.map((value) => (
                      <Badge key={value} variant="secondary">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits & Perks</CardTitle>
              <CardDescription>What we offer to our employees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.culture.benefits.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Benefits</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {company.culture.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              {company.culture.perks.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Perks</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {company.culture.perks.map((perk) => (
                      <li key={perk}>{perk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Company Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Company Metrics</CardTitle>
            <CardDescription>Our hiring and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Hires</h3>
                <p className="text-2xl font-bold">{company.metrics.total_hires}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Time to Hire</h3>
                <p className="text-2xl font-bold">{company.metrics.average_time_to_hire} days</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Candidate Satisfaction</h3>
                <p className="text-2xl font-bold">{company.metrics.candidate_satisfaction}%</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Retention Rate</h3>
                <p className="text-2xl font-bold">{company.metrics.retention_rate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Get in touch with us</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${company.contact_email}`} className="text-sm hover:underline">
                  {company.contact_email}
                </a>
              </div>
              {company.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${company.phone}`} className="text-sm hover:underline">
                    {company.phone}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Badges */}
        {company.badges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Badges</CardTitle>
              <CardDescription>Recognition and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {company.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 p-2 rounded-lg border"
                  >
                    <img
                      src={badge.icon}
                      alt={badge.name}
                      className="w-8 h-8"
                    />
                    <div>
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Awarded {formatDistanceToNow(new Date(badge.awarded_at))} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 