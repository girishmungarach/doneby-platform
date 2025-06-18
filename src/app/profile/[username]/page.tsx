'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';
import { ProfileWithDetails, ProfileSkill, TimelineEntry } from '@/lib/types/profile';
import { toast } from 'sonner';
import { Metadata } from 'next';
import Timeline from '@/components/timeline/Timeline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MailIcon, PhoneIcon, LinkIcon, MapPinIcon, LinkedinIcon, TrophyIcon, ZapIcon, Share2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import ProfileCard from '@/components/profile/ProfileCard';
import EditTimelineEntryDrawer from '@/components/timeline/EditTimelineEntryDrawer';

interface ProfilePageProps {
  params: { username: string };
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const supabase = createClientComponentClient<Database>();
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, headline, bio, avatar_url, username')
    .eq('username', params.username)
    .single();

  if (!profileData) {
    return {};
  }

  const title = `${profileData.full_name} | DoneBy Profile`;
  const description = profileData.headline || profileData.bio || 'Professional profile on DoneBy verification platform.';
  const imageUrl = profileData.avatar_url || '/default-avatar.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'profile',
      url: `https://doneby.in/profile/${profileData.username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimelineEntry | null>(null);

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndUser() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();

      const { data, error } = await supabase
        .from('profiles')
        .select(
          `
          *,
          timeline_entries(*, skills!inner(id, name, category, description, created_at), files(*)),
          achievements(*),
          metrics(*),
          connections(*),
          profile_skills(*, skill(*))
        `
        )
        .eq('username', params.username)
        .single();

      if (error || !data) {
        console.error('Error fetching profile:', error);
        router.push('/404'); // Redirect to a 404 page or handle error
        toast.error('Could not load profile.');
        setLoading(false);
        return;
      }

      setProfile(data);
      if (sessionData?.session?.user?.id === data.user_id) {
        setIsOwnProfile(true);
      }
      setLoading(false);
    }

    fetchProfileAndUser();
  }, [params.username, router, supabase]);

  const handleProfileSave = async (updatedFields: { full_name: string; headline: string; bio: string }) => {
    if (!profile) return;

    // Optimistic UI update
    const originalProfile = { ...profile };
    setProfile(prev => prev ? { ...prev, ...updatedFields } : null);

    const { error } = await supabase
      .from('profiles')
      .update(updatedFields)
      .eq('id', profile.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
      // Revert optimistic update
      setProfile(originalProfile);
    } else {
      toast.success('Profile updated successfully!');
    }
  };

  const handleEditTimelineEntry = (entry: TimelineEntry) => {
    setEditingEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleTimelineEntrySaveSuccess = (updatedEntry: TimelineEntry) => {
    setProfile(prevProfile => {
      if (!prevProfile) return null;
      const updatedEntries = prevProfile.timeline_entries.map(entry =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      );
      return { ...prevProfile, timeline_entries: updatedEntries };
    });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">Profile not found.</div>; // Should be caught by router.push('/404')
  }

  // Calculate simple aggregate metrics (TrustMetrics/ProfileStats can be more complex)
  const totalSkills = profile.profile_skills?.length || 0;
  const totalAchievements = profile.achievements?.length || 0;
  const totalConnections = profile.connections?.length || 0;
  const verifiedEntriesCount = profile.timeline_entries?.filter(entry => entry.verification_status === 'verified').length || 0;

  // Sort timeline entries by start_date descending
  const sortedTimelineEntries = profile.timeline_entries
    ? [...profile.timeline_entries].sort((a, b) => {
        const dateA = new Date(a.start_date).getTime();
        const dateB = new Date(b.start_date).getTime();
        return dateB - dateA;
      })
    : [];

  const profileUrl = `https://doneby.in/profile/${profile.username}`;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      {/* Profile Header */}
      <ProfileCard
        name={profile.full_name || ''}
        headline={profile.headline || ''}
        bio={profile.bio || ''}
        imageUrl={profile.avatar_url || undefined}
        isOwnProfile={isOwnProfile}
        onSave={handleProfileSave}
      />

      <Separator className="my-6" /> {/* Moved separator to be between profile card and metrics */}

      <Card className="mb-8">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <ZapIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Verification Score:</span>
              <span>{profile.verification_score || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Total Achievements:</span>
              <span>{totalAchievements}</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2Icon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Total Connections:</span>
              <span>{totalConnections}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Verified Entries:</span>
              <span>{verifiedEntriesCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <ZapIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Total Skills:</span>
              <span>{totalSkills}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Social Info */}
      <Card className="mb-8">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-bold">Contact & Social</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            {profile.email && (
              <span className="flex items-center"><MailIcon className="mr-1 h-4 w-4" /> {profile.email}</span>
            )}
            {profile.phone && (
              <span className="flex items-center"><PhoneIcon className="mr-1 h-4 w-4" /> {profile.phone}</span>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline"><LinkIcon className="mr-1 h-4 w-4" /> Website</a>
            )}
            {profile.linkedin && (
              <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline"><LinkedinIcon className="mr-1 h-4 w-4" /> LinkedIn</a>
            )}
            {profile.location && (
              <span className="flex items-center"><MapPinIcon className="mr-1 h-4 w-4" /> {profile.location}</span>
            )}
          </div>
          {/* Social Sharing */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(profileUrl)}>
              Copy Link
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(profileUrl)}&title=${encodeURIComponent(profile.full_name || '')}&summary=${encodeURIComponent(profile.headline || '')}`} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="h-4 w-4 mr-1" /> Share on LinkedIn
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(`${profile.full_name || ''} - ${profile.headline || ''}`)}`} target="_blank" rel="noopener noreferrer">
                <Share2Icon className="h-4 w-4 mr-1" /> Share on X
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Professional Timeline</h2>
        <Suspense fallback={<div>Loading timeline...</div>}>
          <Timeline
            timelineEntries={sortedTimelineEntries}
            isOwnProfile={isOwnProfile}
            onEdit={handleEditTimelineEntry}
          />
        </Suspense>
      </section>

      {/* Skills Section (Enhanced display) */}
      {profile.profile_skills && profile.profile_skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
          <Card>
            <CardContent className="flex flex-wrap gap-2 p-4">
              {profile.profile_skills.map((profileSkill: ProfileSkill) => (
                <Badge key={profileSkill.id} variant="secondary" className="text-base px-3 py-1">
                  {profileSkill.skill?.name} ({profileSkill.level})
                </Badge>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Achievements Section (Basic display) */}
      {profile.achievements && profile.achievements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Achievements</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profile.achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{new Date(achievement.date).getFullYear()}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {achievement.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {editingEntry && (
        <EditTimelineEntryDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          entry={editingEntry}
          onSaveSuccess={handleTimelineEntrySaveSuccess}
        />
      )}
    </div>
  );
} 