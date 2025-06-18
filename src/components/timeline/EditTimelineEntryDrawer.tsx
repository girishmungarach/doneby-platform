'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { TimelineEntry, TimelineEntryFormValues } from '@/lib/types/profile';
import AddExperienceForm from '@/components/timeline/AddExperienceForm'; // We'll create this soon
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface EditTimelineEntryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entry: TimelineEntry | null;
  onSaveSuccess: (updatedEntry: TimelineEntry) => void;
}

export default function EditTimelineEntryDrawer({
  isOpen,
  onClose,
  entry,
  onSaveSuccess,
}: EditTimelineEntryDrawerProps) {
  const supabase = createClientComponentClient<Database>();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (values: TimelineEntryFormValues) => {
    if (!entry) return;

    setIsSaving(true);
    try {
      // For now, let's just update the timeline entry itself
      // File uploads and skill linking will be more complex and done in AddExperienceForm
      const updatedEntryData = {
        type: values.type,
        title: values.title,
        description: values.description || null,
        start_date: values.start_date,
        end_date: values.is_current ? null : (values.end_date || null),
        is_current: values.is_current,
        location: values.location || null,
        organization: values.organization || null,
        url: values.url || null,
      };

      const { data, error } = await supabase
        .from('timeline_entries')
        .update(updatedEntryData)
        .eq('id', entry.id)
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Optimistically update the UI with the new data
        onSaveSuccess({
          ...entry,
          ...data[0],
          // files and skills will need more complex handling
          files: entry.files,
          skills: entry.skills, // For now, keep existing. Skills/Files update will be handled in AddExperienceForm
        });
        toast.success('Timeline entry updated successfully.');
        onClose();
      }
    } catch (error: any) {
      console.error('Error saving timeline entry:', error);
      toast.error('Failed to update timeline entry.', { description: error.message || 'An unknown error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90%] w-full max-w-2xl mx-auto flex flex-col">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Timeline Entry</DrawerTitle>
          <DrawerDescription>Make changes to your professional experience here.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-grow overflow-y-auto p-4">
          {entry && (
            <AddExperienceForm
              initialData={entry}
              onSubmit={handleSave}
              isSaving={isSaving}
              // Add props for file uploads and skill linking here if needed in the future
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
} 