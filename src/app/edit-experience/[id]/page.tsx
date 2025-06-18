'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { TimelineEntryType, VerificationStatus, TimelineEntry } from '@/lib/types/profile';
import AddExperienceForm from '@/components/timeline/AddExperienceForm';
import { TimelineEntryFormValues } from '@/lib/validations/timeline';
import { useEffect, useState } from 'react';

interface EditExperiencePageProps {
  params: {
    id: string;
  };
}

export default function EditExperiencePage({ params }: EditExperiencePageProps) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [timelineEntry, setTimelineEntry] = useState<TimelineEntry | null>(null);

  useEffect(() => {
    const fetchTimelineEntry = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          toast.error('Authentication Error', { description: 'You must be logged in to edit an experience.' });
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('timeline_entries')
          .select(`
            *,
            skills:timeline_skills(
              skill:skills(*)
            ),
            files(*)
          `)
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Timeline entry not found');
        }

        // Check if the user owns this timeline entry
        if (data.profile_id !== userData.user.id) {
          toast.error('Permission Denied', { description: 'You can only edit your own timeline entries.' });
          router.push('/profile/' + userData.user.user_metadata.username);
          return;
        }

        setTimelineEntry(data);
      } catch (error: any) {
        console.error('Error fetching timeline entry:', error);
        toast.error('Failed to load timeline entry', { description: error.message });
        router.push('/profile/' + userData.user.user_metadata.username);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimelineEntry();
  }, [params.id, router, supabase]);

  const handleSubmit = async (values: TimelineEntryFormValues) => {
    try {
      setIsSaving(true);
      const userResponse = await supabase.auth.getUser();
      if (!userResponse.data.user) {
        toast.error('Authentication Error', { description: 'You must be logged in to edit an experience.' });
        return;
      }

      // Update the timeline entry
      const { error: updateError } = await supabase
        .from('timeline_entries')
        .update({
          type: values.type,
          title: values.title,
          description: values.description || null,
          start_date: values.start_date,
          end_date: values.end_date || null,
          is_current: values.is_current,
          location: values.location || null,
          organization: values.organization || null,
          url: values.url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id);

      if (updateError) {
        throw updateError;
      }

      // Handle file uploads
      if (values.files && values.files.length > 0) {
        const uploadedFilesMetadata: { file_url: string; file_name: string; file_type: string | null; file_size: number | null }[] = [];

        for (const file of values.files) {
          const fileExtension = file.name.split('.').pop();
          const filePath = `${userResponse.data.user.id}/${params.id}/${uuidv4()}.${fileExtension}`;

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
            timeline_entry_id: params.id,
            profile_id: userResponse.data.user.id,
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

      // Handle skills
      if (values.skills && values.skills.length > 0) {
        // First, remove existing skills
        const { error: deleteSkillsError } = await supabase
          .from('timeline_skills')
          .delete()
          .eq('timeline_entry_id', params.id);

        if (deleteSkillsError) {
          throw deleteSkillsError;
        }

        // Then add new skills
        const skillInserts = [];

        for (const skillName of values.skills) {
          let { data: existingSkill, error: fetchSkillError } = await supabase
            .from('skills')
            .select('id')
            .ilike('name', skillName)
            .single();

          if (fetchSkillError && fetchSkillError.code !== 'PGRST116') {
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
              timeline_entry_id: params.id,
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

      toast.success('Timeline entry updated successfully!', {
        description: 'Your experience has been updated.',
      });

      router.push(`/profile/${userResponse.data.user.user_metadata.username}`);
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error('Failed to update entry', { description: error.message || 'An unknown error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!timelineEntry) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Experience</h1>
      <AddExperienceForm
        initialData={timelineEntry}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />
    </div>
  );
}
