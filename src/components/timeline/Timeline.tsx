import { TimelineEntry } from '@/lib/types/profile';
import TimelineItem from './TimelineItem';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimelineProps {
  timelineEntries: TimelineEntry[];
  isOwnProfile?: boolean;
  onEdit?: (entry: TimelineEntry) => void;
}

export default function Timeline({ timelineEntries, isOwnProfile, onEdit }: TimelineProps) {
  // Placeholder for filtering and search logic
  const filteredEntries = timelineEntries;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search timeline..." className="flex-grow" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="work">Work Experience</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="project">Projects</SelectItem>
            <SelectItem value="achievement">Achievements</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        <div className="relative">
          {/* Main vertical line for the timeline */}
          <div className="absolute left-[calc(0.5rem)] top-0 h-full w-0.5 bg-border transform -translate-x-1/2"></div>

          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                isOwnProfile={isOwnProfile}
                onEdit={onEdit}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">No timeline entries to display.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 