import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Settings } from "lucide-react";
import { SDImage } from "@/types/image";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  image: SDImage;
  onDelete?: (id: string) => void;
  className?: string;
}

export function ImageCard({ image, onDelete, className }: ImageCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm("Are you sure you want to delete this image?")) {
      onDelete(image.id);
    }
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-lg transition-all duration-200",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image.imageUrl}
          alt={image.positivePrompt.slice(0, 100)}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <Link to={`/image/${image.id}`}>
            <Button size="sm" variant="secondary">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Generation info badge */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Badge variant="secondary" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            {image.steps} steps
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Prompt preview */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Prompt
            </p>
            <p className="text-sm line-clamp-2 leading-relaxed">
              {image.positivePrompt}
            </p>
          </div>

          {/* Model and generation info */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="font-medium">{image.model}</span>
            <span>{image.imageSize}</span>
          </div>

          {/* Tags */}
          {image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {image.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {image.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{image.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Date */}
          <p className="text-xs text-muted-foreground">
            {image.createdAt.toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
