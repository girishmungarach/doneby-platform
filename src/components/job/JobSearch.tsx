import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Search, MapPin, Building2, Code, ChevronDown, X } from 'lucide-react'
import { JobSearchSuggestion } from '@/lib/types/job-listing'
import { useDebounce } from '@/lib/hooks/use-debounce'

export function JobSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [suggestions, setSuggestions] = useState<JobSearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(async (value: string) => {
    if (!value) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      // Replace with actual API call
      const response = await fetch(`/api/jobs/suggestions?q=${encodeURIComponent(value)}`)
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    handleSearch(debouncedSearch)
  }, [debouncedSearch, handleSearch])

  const handleSuggestionClick = (suggestion: JobSearchSuggestion) => {
    setSearch(suggestion.text)
    setIsOpen(false)

    const params = new URLSearchParams(searchParams.toString())
    params.set('search', suggestion.text)
    router.push(`/jobs?${params.toString()}`)
  }

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2" ref={searchRef}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {suggestions.length > 0 && (
                  <>
                    <CommandGroup heading="Jobs">
                      {suggestions
                        .filter((s) => s.type === 'job')
                        .map((suggestion) => (
                          <CommandItem
                            key={suggestion.id}
                            onSelect={() => handleSuggestionClick(suggestion)}
                          >
                            <Search className="mr-2 h-4 w-4" />
                            {suggestion.text}
                            {suggestion.count && (
                              <span className="ml-2 text-muted-foreground">
                                ({suggestion.count})
                              </span>
                            )}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Companies">
                      {suggestions
                        .filter((s) => s.type === 'company')
                        .map((suggestion) => (
                          <CommandItem
                            key={suggestion.id}
                            onSelect={() => handleSuggestionClick(suggestion)}
                          >
                            <Building2 className="mr-2 h-4 w-4" />
                            {suggestion.text}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Skills">
                      {suggestions
                        .filter((s) => s.type === 'skill')
                        .map((suggestion) => (
                          <CommandItem
                            key={suggestion.id}
                            onSelect={() => handleSuggestionClick(suggestion)}
                          >
                            <Code className="mr-2 h-4 w-4" />
                            {suggestion.text}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Locations">
                      {suggestions
                        .filter((s) => s.type === 'location')
                        .map((suggestion) => (
                          <CommandItem
                            key={suggestion.id}
                            onSelect={() => handleSuggestionClick(suggestion)}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            {suggestion.text}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Select
          defaultValue={searchParams.get('sort') || 'relevance'}
          onValueChange={handleSort}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most Relevant</SelectItem>
            <SelectItem value="date">Most Recent</SelectItem>
            <SelectItem value="salary">Highest Salary</SelectItem>
            <SelectItem value="rating">Company Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filters */}
      <div className="flex flex-wrap gap-2">
        {searchParams.get('location') && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete('location')
              router.push(`/jobs?${params.toString()}`)
            }}
          >
            Location: {searchParams.get('location')}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {searchParams.get('type') && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete('type')
              router.push(`/jobs?${params.toString()}`)
            }}
          >
            Type: {searchParams.get('type')}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {/* Add more active filter buttons */}
      </div>
    </div>
  )
} 