import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/ImageCard";
import { TagFilter } from "@/components/TagFilter";
import { Plus, Image as ImageIcon, Upload } from "lucide-react";
import { imageStore } from "@/lib/imageStore";
import { SDImage, ImageFilters } from "@/types/image";

export default function Gallery() {
  const [images, setImages] = useState<SDImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<SDImage[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<ImageFilters>({
    searchTerm: "",
    selectedTags: [],
    sortBy: "newest",
  });

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    const filtered = imageStore.filterImages(filters);
    setFilteredImages(filtered);
  }, [filters, images]);

  const loadImages = () => {
    const allImages = imageStore.getAllImages();
    const tags = imageStore.getAllTags();
    setImages(allImages);
    setAvailableTags(tags);
  };

  const handleDeleteImage = (id: string) => {
    const success = imageStore.deleteImage(id);
    if (success) {
      loadImages(); // Reload data after deletion
    }
  };

  const handleFiltersChange = (newFilters: ImageFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ImageIcon className="w-8 h-8" />
            AI Art Gallery
          </h1>
          <p className="text-muted-foreground mt-2">
            {images.length === 0
              ? "No images uploaded yet"
              : `${images.length} image${images.length === 1 ? "" : "s"} in your collection`}
          </p>
        </div>

        <Link to="/upload">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Upload New Image
          </Button>
        </Link>
      </div>

      {images.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No images yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start building your AI art collection by uploading your first Stable
            Diffusion generated image.
          </p>
          <Link to="/upload">
            <Button size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Upload First Image
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Filters */}
          <TagFilter
            availableTags={availableTags}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            className="mb-8"
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredImages.length} of {images.length} images
            </p>
          </div>

          {/* Image Grid */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No images match your filters
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or removing some filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onDelete={handleDeleteImage}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
