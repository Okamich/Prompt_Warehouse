import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { ImageFilters } from "@/types/image";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  availableTags: string[];
  filters: ImageFilters;
  onFiltersChange: (filters: ImageFilters) => void;
  className?: string;
}

export function TagFilter({
  availableTags,
  filters,
  onFiltersChange,
  className,
}: TagFilterProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];

    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const handleSortChange = (sortBy: "newest" | "oldest" | "name") => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: "",
      selectedTags: [],
      sortBy: "newest",
    });
  };

  const hasActiveFilters =
    filters.searchTerm || filters.selectedTags.length > 0;
  const displayedTags = showAllTags
    ? availableTags
    : availableTags.slice(0, 12);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search prompts, models, tags..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="icon" onClick={clearAllFilters}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {filters.searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.searchTerm}"
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleSearchChange("")}
              />
            </Badge>
          )}

          {filters.selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filter by tags</h3>
            {availableTags.length > 12 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags
                  ? "Show less"
                  : `Show all (${availableTags.length})`}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag) => (
              <Badge
                key={tag}
                variant={
                  filters.selectedTags.includes(tag) ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
