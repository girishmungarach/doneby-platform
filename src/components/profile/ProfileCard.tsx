'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile'; // Import the schema
import { useDebounce } from '@/hooks/useDebounce'; // Import the debounce hook

interface ProfileCardProps {
  name: string;
  headline: string;
  bio: string;
  imageUrl?: string;
  isOwnProfile?: boolean;
  onSave: (data: ProfileFormValues) => void;
}

export default function ProfileCard({
  name,
  headline,
  bio,
  imageUrl,
  isOwnProfile,
  onSave,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: name,
      headline: headline,
      bio: bio,
    },
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = form;

  useEffect(() => {
    reset({ full_name: name, headline: headline, bio: bio });
  }, [name, headline, bio, reset]);

  // Watch for changes in form fields
  const formValues = watch();
  const debouncedFormValues = useDebounce(formValues, 1000); // Debounce for 1 second

  // Auto-save effect
  useEffect(() => {
    if (isEditing) {
      // Check if values have actually changed before saving
      const hasChanged = 
        debouncedFormValues.full_name !== name ||
        debouncedFormValues.headline !== headline ||
        debouncedFormValues.bio !== bio;

      if (hasChanged && Object.keys(errors).length === 0) {
        // Only save if there are no validation errors
        onSave(debouncedFormValues);
      }
    }
  }, [debouncedFormValues, isEditing, onSave, name, headline, bio, errors]);

  const onSubmit = (data: ProfileFormValues) => {
    onSave(data);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {imageUrl ? (
              <img
                className="h-16 w-16 rounded-full"
                src={imageUrl}
                alt={name}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">{(name && name[0]) || ''}</span>
              </div>
            )}
          </div>
          <div className="flex-grow">
            {isEditing ? (
              <input
                type="text"
                {...register("full_name")}
                className="text-xl font-semibold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
            )}
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}

            {isEditing ? (
              <input
                type="text"
                {...register("headline")}
                className="text-sm text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              />
            ) : (
              <p className="text-sm text-gray-500">{headline}</p>
            )}
            {errors.headline && <p className="text-red-500 text-xs mt-1">{errors.headline.message}</p>}
          </div>
          {isOwnProfile && (
            <div className="flex-shrink-0">
              {isEditing ? (
                <Button type="submit" size="sm">Save</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">Edit</Button>
              )}
            </div>
          )}
        </div>
        <div className="mt-4">
          {isEditing ? (
            <textarea
              {...register("bio")}
              className="text-gray-600 border border-gray-300 focus:outline-none focus:border-blue-500 w-full p-2 rounded-md"
              rows={4}
            />
          ) : (
            <p className="text-gray-600">{bio}</p>
          )}
          {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
        </div>
      </form>
    </div>
  );
} 