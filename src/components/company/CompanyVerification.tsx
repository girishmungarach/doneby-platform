import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CompanyDocumentSchema, CompanyProfile, COMPANY_VERIFICATION_DOCUMENTS } from '@/lib/types/company'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Upload, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface CompanyVerificationProps {
  company: CompanyProfile
  onUpdate?: (company: CompanyProfile) => void
}

export function CompanyVerification({ company, onUpdate }: CompanyVerificationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)
  const supabase = createClient()

  const form = useForm<CompanyProfile>({
    resolver: zodResolver(CompanyDocumentSchema),
    defaultValues: company,
  })

  const handleFileUpload = async (file: File, docType: string) => {
    try {
      setUploadingDoc(docType)
      const fileExt = file.name.split('.').pop()
      const fileName = `${company.id}/${docType}.${fileExt}`
      const filePath = `company-documents/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      const newDoc = {
        id: crypto.randomUUID(),
        type: docType,
        url: publicUrl,
        status: 'pending',
        metadata: {
          originalName: file.name,
          size: file.size,
          type: file.type,
        },
      }

      const updatedDocs = [...company.verification_documents, newDoc]
      const { data: updatedCompany, error: updateError } = await supabase
        .from('companies')
        .update({ verification_documents: updatedDocs })
        .eq('id', company.id)
        .select()
        .single()

      if (updateError) throw updateError

      toast.success('Document uploaded successfully')
      onUpdate?.(updatedCompany)
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error('Failed to upload document')
    } finally {
      setUploadingDoc(null)
    }
  }

  const getDocumentStatus = (docType: string) => {
    const doc = company.verification_documents.find(d => d.type === docType)
    if (!doc) return 'missing'
    return doc.status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-500'
      case 'rejected':
        return 'text-red-500'
      case 'pending':
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  const verificationProgress = () => {
    const totalDocs = COMPANY_VERIFICATION_DOCUMENTS.filter(doc => doc.required).length
    const verifiedDocs = company.verification_documents.filter(
      doc => doc.status === 'verified'
    ).length
    return (verifiedDocs / totalDocs) * 100
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Company Verification</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Verification Progress</span>
          <Progress value={verificationProgress()} className="w-32" />
        </div>
      </div>

      <div className="grid gap-6">
        {COMPANY_VERIFICATION_DOCUMENTS.map((doc) => {
          const status = getDocumentStatus(doc.type)
          const existingDoc = company.verification_documents.find(d => d.type === doc.type)

          return (
            <Card key={doc.type}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{doc.name}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </div>
                  {getStatusIcon(status)}
                </div>
              </CardHeader>
              <CardContent>
                {existingDoc ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${getStatusColor(status)}`}>
                        Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {existingDoc.verified_at && (
                        <span className="text-sm text-muted-foreground">
                          Verified: {new Date(existingDoc.verified_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(existingDoc.url, '_blank')}
                      >
                        View Document
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleFileUpload(file, doc.type)
                          }
                          input.click()
                        }}
                      >
                        Replace Document
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Upload Document</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (file) handleFileUpload(file, doc.type)
                          }
                          input.click()
                        }}
                        disabled={isLoading && uploadingDoc === doc.type}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isLoading && uploadingDoc === doc.type
                          ? 'Uploading...'
                          : 'Upload Document'}
                      </Button>
                      {!doc.required && (
                        <span className="text-sm text-muted-foreground">(Optional)</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            // Handle verification submission
            toast.info('Verification request submitted')
          }}
          disabled={isLoading || verificationProgress() < 100}
        >
          Submit for Verification
        </Button>
      </div>
    </div>
  )
} 