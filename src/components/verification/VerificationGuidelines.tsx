import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const guidelines = [
  {
    title: 'Verification Process',
    content: `
      The verification process consists of three main steps:
      1. Review the timeline entry and evidence
      2. Evaluate the quality and validity of the evidence
      3. Make a decision and provide comments

      Take your time to thoroughly review all provided information before making a decision.
    `,
  },
  {
    title: 'Evidence Quality Assessment',
    content: `
      When assessing evidence quality, consider the following:
      - Authenticity: Is the evidence genuine and unaltered?
      - Relevance: Does it directly support the timeline entry?
      - Timeliness: Is the evidence from the relevant time period?
      - Completeness: Does it provide sufficient information?

      Rate the evidence as:
      - Excellent: Meets all criteria with high confidence
      - Good: Meets most criteria with reasonable confidence
      - Fair: Meets some criteria but has limitations
      - Poor: Fails to meet most criteria
    `,
  },
  {
    title: 'Verification Methods',
    content: `
      Choose the most appropriate verification method:
      - Direct Knowledge: You have first-hand experience or knowledge
      - Document Review: You've reviewed official documents or records
      - Third Party Confirmation: You've verified through reliable sources

      Select the method that best reflects how you verified the information.
    `,
  },
  {
    title: 'Making a Decision',
    content: `
      When making your decision:
      - Verify: If you're confident the information is accurate
      - Reject: If you have concerns about accuracy or evidence

      Provide clear, constructive comments explaining your decision.
      For rejections, explain what additional evidence might be needed.
    `,
  },
  {
    title: 'Best Practices',
    content: `
      Follow these best practices:
      - Be thorough in your review
      - Maintain objectivity
      - Consider all available evidence
      - Provide clear, specific feedback
      - Respect privacy and confidentiality
      - Report any suspicious activity
    `,
  },
  {
    title: 'Quality Scoring',
    content: `
      Your verification quality score is based on:
      - Accuracy of verifications
      - Completeness of reviews
      - Timeliness of responses
      - Quality of feedback
      - Consistency in assessments

      Maintain a high score by following guidelines and best practices.
    `,
  },
]

export function VerificationGuidelines() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Verification Guidelines</h3>
          <p className="text-sm text-muted-foreground">
            Review these guidelines to ensure high-quality verifications.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {guidelines.map((guideline, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {guideline.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-sm max-w-none">
                  {guideline.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-2">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-medium">Need Help?</h4>
          <p className="text-sm text-muted-foreground">
            If you have any questions or need assistance, please contact our support team.
          </p>
          <a
            href="/support"
            className="text-primary hover:underline"
          >
            Contact Support
          </a>
        </div>
      </div>
    </Card>
  )
} 