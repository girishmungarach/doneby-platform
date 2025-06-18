import { Button } from '@/components/ui/button';
import Timeline from '@/components/timeline/Timeline';
import { TimelineEntry, TimelineEntryType, VerificationStatus } from '@/lib/types/profile';

export default function Home() {
  const mockTimelineEntries: TimelineEntry[] = [
    {
      id: '1',
      profile_id: 'mock-profile-1',
      type: 'work' as TimelineEntryType,
      title: 'Senior Software Engineer',
      description: 'Developed and maintained web applications using React and Node.js.',
      start_date: '2020-01-15',
      end_date: '2023-05-20',
      is_current: false,
      location: 'San Francisco, CA',
      organization: 'Tech Solutions Inc.',
      url: 'https://techsolutions.com',
      metadata: {},
      verification_status: 'verified' as VerificationStatus,
      verification_count: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      skills: [
        { id: 's1', profile_id: 'mock-profile-1', skill_id: 'skill1', level: 'expert', endorsement_count: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), skill: { id: 'skill1', name: 'React', category: 'Frontend', description: 'React.js framework', created_at: new Date().toISOString() } },
        { id: 's2', profile_id: 'mock-profile-1', skill_id: 'skill2', level: 'advanced', endorsement_count: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), skill: { id: 'skill2', name: 'Node.js', category: 'Backend', description: 'Node.js runtime', created_at: new Date().toISOString() } },
      ],
    },
    {
      id: '2',
      profile_id: 'mock-profile-1',
      type: 'education' as TimelineEntryType,
      title: 'Master of Science in Computer Science',
      description: 'Specialized in Artificial Intelligence and Machine Learning.',
      start_date: '2018-09-01',
      end_date: '2020-05-25',
      is_current: false,
      location: 'Stanford University, CA',
      organization: 'Stanford University',
      url: 'https://stanford.edu',
      metadata: {},
      verification_status: 'verified' as VerificationStatus,
      verification_count: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      skills: [
        { id: 's3', profile_id: 'mock-profile-1', skill_id: 'skill3', level: 'expert', endorsement_count: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), skill: { id: 'skill3', name: 'Machine Learning', category: 'AI', description: 'ML Algorithms', created_at: new Date().toISOString() } },
      ],
    },
    {
      id: '3',
      profile_id: 'mock-profile-1',
      type: 'project' as TimelineEntryType,
      title: 'DoneBy Professional Verification Platform',
      description: 'Designed and developed a platform for professional verification.',
      start_date: '2023-06-01',
      is_current: true,
      location: 'Remote',
      organization: 'Self-Employed',
      url: 'https://doneby.com',
      metadata: {},
      verification_status: 'pending' as VerificationStatus,
      verification_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      skills: [
        { id: 's4', profile_id: 'mock-profile-1', skill_id: 'skill4', level: 'advanced', endorsement_count: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), skill: { id: 'skill4', name: 'Next.js', category: 'Frontend', description: 'Next.js framework', created_at: new Date().toISOString() } },
        { id: 's5', profile_id: 'mock-profile-1', skill_id: 'skill5', level: 'advanced', endorsement_count: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), skill: { id: 'skill5', name: 'Supabase', category: 'Backend', description: 'Supabase BaaS', created_at: new Date().toISOString() } },
      ],
    },
    {
      id: '4',
      profile_id: 'mock-profile-1',
      type: 'achievement' as TimelineEntryType,
      title: 'Published Research Paper on AI Ethics',
      description: 'Authored a paper exploring ethical considerations in AI development.',
      start_date: '2019-11-01',
      end_date: '2019-11-01',
      is_current: false,
      location: 'Remote',
      organization: null,
      url: null,
      metadata: {},
      verification_status: 'pending' as VerificationStatus,
      verification_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      skills: [],
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Professional Timeline</h1>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Timeline timelineEntries={mockTimelineEntries} />
      </div>
    </main>
  );
}
