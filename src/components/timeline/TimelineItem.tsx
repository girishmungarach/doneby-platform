'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TimelineEntry, ProfileSkill, Skill, FileEntry } from '@/lib/types/profile';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { PaperclipIcon, FileIcon, ImageIcon, FileTextIcon, EditIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineItemProps {
  entry: TimelineEntry;
  isOwnProfile?: boolean;
  onEdit?: (entry: TimelineEntry) => void;
}

export default function TimelineItem({ entry, isOwnProfile, onEdit }: TimelineItemProps) {
  const {
    type,
    title,
    description,
    start_date,
    end_date,
    is_current,
    location,
    organization,
    url,
    verification_status,
    skills,
    files,
  } = entry;

  const verificationStatusMap = {
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
    verified: { color: 'bg-green-100 text-green-800', text: 'Verified' },
    rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
  };

  const statusInfo = verificationStatusMap[verification_status];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const getFileDisplayIcon = (fileType: string | null) => {
    if (!fileType) return <FileIcon className="h-4 w-4 mr-1" />;
    if (fileType.startsWith('image/')) return <ImageIcon className="h-4 w-4 mr-1" />;
    if (fileType === 'application/pdf') return <FileTextIcon className="h-4 w-4 mr-1" />;
    if (fileType.includes('word')) return <FileTextIcon className="h-4 w-4 mr-1" />;
    return <PaperclipIcon className="h-4 w-4 mr-1" />;
  };

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline connector line */}
      <div className="absolute left-[calc(0.5rem)] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
      {/* Timeline dot */}
      <div className="absolute left-[calc(0.5rem)] top-2 z-10 w-3 h-3 rounded-full bg-primary ring-4 ring-background -translate-x-1/2"></div>

      <Card className="ml-4 w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg md:text-xl">
              <span>{title}</span>
              {organization && <span className="text-base text-muted-foreground ml-2">{organization}</span>}
            </CardTitle>
            {isOwnProfile && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entry)}
                className="ml-auto"
              >
                <EditIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription className="text-sm md:text-base">
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>
                {formatDate(start_date)} - {is_current ? 'Present' : formatDate(end_date)}
              </span>
            </div>
            {location && <span className="text-muted-foreground block text-sm">{location}</span>}
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                View Link
              </a>
            )}
          </CardDescription>
        </CardHeader>
        {description && (
          <CardContent className="text-sm md:text-base text-muted-foreground">
            {description}
          </CardContent>
        )}
        <CardFooter className="flex flex-wrap items-center gap-2 pt-4">
          {skills && skills.length > 0 && (
            <>
              {skills.map((profileSkill: ProfileSkill) => (
                <Badge key={profileSkill.skill.id} variant="secondary">
                  {(profileSkill.skill as Skill).name}
                </Badge>
              ))}
              <Separator orientation="vertical" className="h-4" />
            </>
          )}
          {files && files.length > 0 && (
            <>
              {files.map((file: FileEntry) => (
                <a
                  key={file.id}
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                >
                  {getFileDisplayIcon(file.file_type)}
                  {file.file_name}
                </a>
              ))}
              <Separator orientation="vertical" className="h-4" />
            </>
          )}
          {verification_status && statusInfo && (
            <Badge className={cn(statusInfo.color, 'text-xs')}>
              {statusInfo.text} {entry.verification_count > 0 && `(${entry.verification_count})`}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 