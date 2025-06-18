'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { CheckIcon, PlusCircledIcon, XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skill, SkillLevel } from '@/lib/types/profile';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { toast } from 'sonner';

interface SkillsInputProps {
  value?: string[]; // Array of skill names
  onChange: (skills: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SkillsInput({
  value = [],
  onChange,
  placeholder = 'Add skills...',
  disabled,
}: SkillsInputProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(value);
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  const supabase = createClientComponentClient<Database>();

  // Debounce search input and fetch skills
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchSkills = async () => {
        if (search.trim() === '') {
          setAvailableSkills([]);
          return;
        }
        setLoading(true);
        const { data, error } = await supabase
          .from('skills')
          .select('id, name, category')
          .ilike('name', `%${search.trim()}%`)
          .limit(10);

        setLoading(false);
        if (error) {
          console.error('Error fetching skills:', error);
          toast.error('Failed to fetch skills', { description: error.message });
        } else {
          setAvailableSkills(data || []);
        }
      };
      fetchSkills();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, supabase]);

  const handleSelectSkill = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      const newSkills = [...selectedSkills, skillName];
      setSelectedSkills(newSkills);
      onChange(newSkills);
      setSearch('');
      setOpen(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = selectedSkills.filter((skill) => skill !== skillToRemove);
    setSelectedSkills(newSkills);
    onChange(newSkills);
  };

  const handleAddNewSkill = async () => {
    const trimmedSearch = search.trim();
    if (trimmedSearch && !selectedSkills.includes(trimmedSearch)) {
      setLoading(true);
      // Check if skill already exists in DB (case-insensitive)
      const { data: existingSkill, error: fetchError } = await supabase
        .from('skills')
        .select('id')
        .ilike('name', trimmedSearch)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error checking skill existence:', fetchError);
        toast.error('Failed to check skill existence', { description: fetchError.message });
        setLoading(false);
        return;
      }

      if (existingSkill) {
        // Skill already exists, just add to selected
        handleSelectSkill(trimmedSearch);
        toast.info(`Skill \'${trimmedSearch}\' already exists and was added.`);
      } else {
        // Add new skill to DB
        const { data: newSkill, error: insertError } = await supabase
          .from('skills')
          .insert([{ name: trimmedSearch }])
          .select('id, name, category')
          .single();
        
        if (insertError) {
          console.error('Error adding new skill:', insertError);
          toast.error('Failed to add new skill', { description: insertError.message });
        } else if (newSkill) {
          handleSelectSkill(newSkill.name);
          toast.success(`New skill \'${newSkill.name}\' added.`);
        } else {
          toast.error('Failed to add new skill', { description: 'Unknown error.' });
        }
      }
      setLoading(false);
      setSearch('');
      setOpen(false);
    } else if (selectedSkills.includes(trimmedSearch)) {
      toast.info(`Skill \'${trimmedSearch}\' is already selected.`);
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={disabled}
          >
            <span className="flex flex-wrap gap-1">
              {selectedSkills.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <XIcon
                      className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSkill(skill);
                      }}
                    />
                  </Badge>
                ))
              )}
            </span>
            <PlusCircledIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" sideOffset={5}>
          <Command>
            <CommandInput
              placeholder="Search or add skill..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {loading && <CommandEmpty>Loading skills...</CommandEmpty>}
              {!loading && availableSkills.length === 0 && search.trim() !== '' && (
                <CommandEmpty>
                  No skills found. <Button variant="link" onClick={handleAddNewSkill}>Add &quot;{search}&quot;?</Button>
                </CommandEmpty>
              )}
              <CommandGroup>
                {availableSkills.map((skill) => (
                  <CommandItem
                    key={skill.id}
                    value={skill.name}
                    onSelect={() => handleSelectSkill(skill.name)}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedSkills.includes(skill.name) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {skill.name}
                    {skill.category && <span className="ml-2 text-xs text-muted-foreground">({skill.category})</span>}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
} 