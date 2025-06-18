import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type {
  Profile,
  ProfileWithDetails,
  ProfileStats,
  TrustMetrics,
  TimelineEntry,
  ProfileSkill,
  Achievement,
  Metric,
} from '@/lib/types/profile';

export async function getProfile(username: string): Promise<ProfileWithDetails | null> {
  const supabase = createClientComponentClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      skills:profile_skills(
        *,
        skill:skills(*)
      ),
      timeline_entries(*),
      achievements(*),
      metrics(*),
      connections(*)
    `)
    .eq('username', username)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile as ProfileWithDetails;
}

export async function getProfileStats(profileId: string): Promise<ProfileStats> {
  const supabase = createClientComponentClient();
  
  const [
    { count: totalSkills },
    { count: totalEndorsements },
    { count: totalConnections },
    { count: totalAchievements },
    { count: totalVerifiedEntries },
    { data: skills }
  ] = await Promise.all([
    supabase.from('profile_skills').select('*', { count: 'exact' }).eq('profile_id', profileId),
    supabase.from('profile_skills').select('endorsement_count', { count: 'exact' }).eq('profile_id', profileId),
    supabase.from('connections').select('*', { count: 'exact' }).eq('profile_id', profileId),
    supabase.from('achievements').select('*', { count: 'exact' }).eq('profile_id', profileId),
    supabase.from('timeline_entries').select('*', { count: 'exact' }).eq('profile_id', profileId).eq('verification_status', 'verified'),
    supabase.from('profile_skills').select('level').eq('profile_id', profileId)
  ]);

  const skillLevels = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4
  };

  const averageSkillLevel = skills?.length
    ? skills.reduce((acc, skill) => acc + skillLevels[skill.level], 0) / skills.length
    : 0;

  const verificationRate = totalVerifiedEntries / (totalVerifiedEntries + (totalSkills || 0));

  return {
    total_skills: totalSkills || 0,
    total_endorsements: totalEndorsements || 0,
    total_connections: totalConnections || 0,
    total_achievements: totalAchievements || 0,
    total_verified_entries: totalVerifiedEntries || 0,
    verification_rate: verificationRate,
    average_skill_level: averageSkillLevel
  };
}

export async function getTrustMetrics(profileId: string): Promise<TrustMetrics> {
  const supabase = createClientComponentClient();
  
  const [
    { data: profile },
    { count: endorsementCount },
    { count: connectionCount },
    { count: achievementCount },
    { count: verifiedEntriesCount },
    { data: lastVerification }
  ] = await Promise.all([
    supabase.from('profiles').select('verification_score').eq('id', profileId).single(),
    supabase.from('profile_skills').select('endorsement_count', { count: 'exact' }).eq('profile_id', profileId),
    supabase.from('connections').select('*', { count: 'exact' }).eq('profile_id', profileId),
    supabase.from('achievements').select('*', { count: 'exact' }).eq('profile_id', profileId),
    supabase.from('timeline_entries').select('*', { count: 'exact' }).eq('profile_id', profileId).eq('verification_status', 'verified'),
    supabase.from('verifications')
      .select('created_at')
      .eq('verifier_id', profileId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
  ]);

  return {
    verification_score: profile?.verification_score || 0,
    endorsement_count: endorsementCount || 0,
    connection_count: connectionCount || 0,
    achievement_count: achievementCount || 0,
    verified_entries_count: verifiedEntriesCount || 0,
    last_verified_at: lastVerification?.created_at || null
  };
}

export async function updateProfile(profileId: string, data: Partial<Profile>): Promise<Profile | null> {
  const supabase = createClientComponentClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', profileId)
    .select()
    .single();

  if (error) {
    return null;
  }

  return profile;
}

export async function addTimelineEntry(profileId: string, data: TimelineEntry): Promise<TimelineEntry | null> {
  const supabase = createClientComponentClient();
  
  const { data: entry, error } = await supabase
    .from('timeline_entries')
    .insert({
      ...data,
      profile_id: profileId
    })
    .select()
    .single();

  if (error) {
    return null;
  }

  return entry;
}

export async function addSkill(profileId: string, skillId: string, level: string): Promise<ProfileSkill | null> {
  const supabase = createClientComponentClient();
  
  const { data: skill, error } = await supabase
    .from('profile_skills')
    .insert({
      profile_id: profileId,
      skill_id: skillId,
      level
    })
    .select()
    .single();

  if (error) {
    return null;
  }

  return skill;
}

export async function addAchievement(profileId: string, data: Achievement): Promise<Achievement | null> {
  const supabase = createClientComponentClient();
  
  const { data: achievement, error } = await supabase
    .from('achievements')
    .insert({
      ...data,
      profile_id: profileId
    })
    .select()
    .single();

  if (error) {
    return null;
  }

  return achievement;
}

export async function addMetric(profileId: string, data: Metric): Promise<Metric | null> {
  const supabase = createClientComponentClient();
  
  const { data: metric, error } = await supabase
    .from('metrics')
    .insert({
      ...data,
      profile_id: profileId
    })
    .select()
    .single();

  if (error) {
    return null;
  }

  return metric;
}

export async function requestVerification(timelineEntryId: string, verifierId: string): Promise<boolean> {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('verifications')
    .insert({
      timeline_entry_id: timelineEntryId,
      verifier_id: verifierId,
      status: 'pending'
    });

  return !error;
}

export async function updateVerificationStatus(
  verificationId: string,
  status: 'verified' | 'rejected',
  comment?: string,
  evidenceUrl?: string
): Promise<boolean> {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('verifications')
    .update({
      status,
      comment,
      evidence_url: evidenceUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', verificationId);

  if (!error && status === 'verified') {
    // Update verification count and status in timeline entry
    const { data: verification } = await supabase
      .from('verifications')
      .select('timeline_entry_id')
      .eq('id', verificationId)
      .single();

    if (verification) {
      await supabase
        .from('timeline_entries')
        .update({
          verification_status: 'verified',
          verification_count: supabase.rpc('increment'),
          updated_at: new Date().toISOString()
        })
        .eq('id', verification.timeline_entry_id);
    }
  }

  return !error;
}

export async function connectProfiles(profileId: string, connectedProfileId: string): Promise<boolean> {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('connections')
    .insert({
      profile_id: profileId,
      connected_profile_id: connectedProfileId,
      status: 'pending'
    });

  return !error;
}

export async function updateConnectionStatus(
  connectionId: string,
  status: 'accepted' | 'rejected'
): Promise<boolean> {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase
    .from('connections')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', connectionId);

  return !error;
} 