'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { TimelineEntryType, VerificationStatus } from '@/lib/types/profile';
import AddExperienceForm from '@/components/timeline/AddExperienceForm';
import { TimelineEntryFormValues } from '@/lib/validations/timeline';
import { useState } from 'react';

export default function AddExperiencePage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (values: TimelineEntryFormValues) => {
    try {
      setIsSaving(true);
      const userResponse = await supabase.auth.getUser();
      if (!userResponse.data.user) {
        toast.error('Authentication Error', { description: 'You must be logged in to add an experience.' });
        return;
      }

      const profileResponse = await supabase.from('profiles').select('id').eq('id', userResponse.data.user.id).single();
      if (profileResponse.error || !profileResponse.data) {
        throw new Error('Profile not found. Please complete your profile first.');
      }
      const profileId = profileResponse.data.id;

      const newTimelineEntry = {
        profile_id: profileId,
        type: values.type,
        title: values.title,
        description: values.description || null,
        start_date: values.start_date,
        end_date: values.end_date || null,
        is_current: values.is_current,
        location: values.location || null,
        organization: values.organization || null,
        url: values.url || null,
        metadata: {},
        verification_status: 'pending' as VerificationStatus,
        verification_count: 0,
      };

      const { data: entryData, error: entryError } = await supabase
        .from('timeline_entries')
        .insert([newTimelineEntry])
        .select();

      if (entryError) {
        throw entryError;
      }

      const timelineEntryId = entryData[0].id;
      const uploadedFilesMetadata: { file_url: string; file_name: string; file_type: string | null; file_size: number | null }[] = [];

      if (values.files && values.files.length > 0) {
        for (const file of values.files) {
          const fileExtension = file.name.split('.').pop();
          const filePath = `${profileId}/${timelineEntryId}/${uuidv4()}.${fileExtension}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('timeline-documents')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`Failed to upload file ${file.name}: ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase.storage.from('timeline-documents').getPublicUrl(filePath);
          if (publicUrlData) {
            uploadedFilesMetadata.push({
              file_url: publicUrlData.publicUrl,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
            });
          }
        }

        if (uploadedFilesMetadata.length > 0) {
          const fileInserts = uploadedFilesMetadata.map((fileMeta) => ({
            timeline_entry_id: timelineEntryId,
            profile_id: profileId,
            ...fileMeta,
          }));

          const { error: filesInsertError } = await supabase
            .from('files')
            .insert(fileInserts);

          if (filesInsertError) {
            throw filesInsertError;
          }
        }
      }

      if (values.skills && values.skills.length > 0) {
        const skillInserts = [];

        for (const skillName of values.skills) {
          let { data: existingSkill, error: fetchSkillError } = await supabase
            .from('skills')
            .select('id')
            .ilike('name', skillName)
            .single();

          if (fetchSkillError && fetchSkillError.code !== 'PGRST116') { // PGRST116 means no rows found
            throw fetchSkillError;
          }

          let skillId = existingSkill?.id;

          if (!skillId) {
            const { data: newSkillData, error: newSkillError } = await supabase
              .from('skills')
              .insert([{ name: skillName }])
              .select('id')
              .single();

            if (newSkillError) {
              throw newSkillError;
            }
            skillId = newSkillData.id;
          }

          if (skillId) {
            skillInserts.push({
              timeline_entry_id: timelineEntryId,
              skill_id: skillId,
            });
          }
        }

        if (skillInserts.length > 0) {
          const { error: timelineSkillsError } = await supabase
            .from('timeline_skills')
            .insert(skillInserts);

          if (timelineSkillsError) {
            throw timelineSkillsError;
          }
        }
      }

      toast.success('Timeline entry saved successfully!', {
        description: 'Your experience has been added to your profile.',
      });

      router.push(`/profile/${userResponse.data.user.user_metadata.username}`);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error('Failed to save entry', { description: error.message || 'An unknown error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Experience</h1>
      <AddExperienceForm onSubmit={handleSubmit} isSaving={isSaving} />
    </div>
  );
} 