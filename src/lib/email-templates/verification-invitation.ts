import { Verification } from '@/lib/types/verification'
import { TimelineEntry } from '@/lib/types/timeline'
import { Profile } from '@/lib/types/profile'

interface VerificationEmailData {
  verification: Verification
  timelineEntry: TimelineEntry
  requester: Profile
  verifier: Profile
  verificationUrl: string
}

export function generateVerificationInvitationEmail({
  verification,
  timelineEntry,
  requester,
  verifier,
  verificationUrl,
}: VerificationEmailData) {
  const subject = `${requester.full_name} has requested your verification`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Request</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .content {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Verification Request</h1>
        </div>
        
        <div class="content">
          <p>Hello ${verifier.full_name},</p>
          
          <p>${requester.full_name} has requested your verification for the following timeline entry:</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${timelineEntry.title}</h3>
            <p>${timelineEntry.description}</p>
            <p><strong>Date:</strong> ${new Date(timelineEntry.date).toLocaleDateString()}</p>
          </div>
          
          <p>They have provided the following evidence:</p>
          <ul>
            ${verification.evidence.map(e => `
              <li>
                <strong>${e.evidence_type}:</strong> ${e.evidence_description}
                <br>
                <a href="${e.evidence_url}" target="_blank">View Evidence</a>
              </li>
            `).join('')}
          </ul>
          
          <p>Please review this information and verify the timeline entry by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Review Verification Request</a>
          </div>
          
          <p>If you have any questions or need additional information, please don't hesitate to contact us.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated message from DoneBy. Please do not reply to this email.</p>
          <p>© ${new Date().getFullYear()} DoneBy. All rights reserved.</p>
        </div>
      </body>
    </html>
  `

  const text = `
    Hello ${verifier.full_name},

    ${requester.full_name} has requested your verification for the following timeline entry:

    ${timelineEntry.title}
    ${timelineEntry.description}
    Date: ${new Date(timelineEntry.date).toLocaleDateString()}

    They have provided the following evidence:
    ${verification.evidence.map(e => `
      - ${e.evidence_type}: ${e.evidence_description}
        View Evidence: ${e.evidence_url}
    `).join('\n')}

    Please review this information and verify the timeline entry by visiting:
    ${verificationUrl}

    If you have any questions or need additional information, please don't hesitate to contact us.

    This is an automated message from DoneBy. Please do not reply to this email.
    © ${new Date().getFullYear()} DoneBy. All rights reserved.
  `

  return {
    subject,
    html,
    text,
  }
} 