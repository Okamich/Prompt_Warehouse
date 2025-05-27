import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MetadataDisplay } from "@/components/MetadataDisplay";
import { ArrowLeft, Download, Trash2, Edit, ExternalLink } from "lucide-react";
import { imageStore } from "@/lib/imageStore";
import { SDImage } from "@/types/image";

export default function ImageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [image, setImage] = useState<SDImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundImage = imageStore.getImageById(id);
      setImage(foundImage);
    }
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (image && confirm("Are you sure you want to delete this image?")) {
      const success = imageStore.deleteImage(image.id);
      if (success) {
        navigate("/gallery");
      }
    }
  };

  const handleDownload = () => {
    if (image) {
      const link = document.createElement("a");
      link.href = image.imageUrl;
      link.download = image.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openImageInNewTab = () => {
    if (image) {
      window.open(image.imageUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="aspect-square bg-muted rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">Image not found</h2>
          <p className="text-muted-foreground mb-6">
            The image you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/gallery">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/gallery">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
        </Link>

        <div className="flex gap-2">
          <Button variant="outline" onClick={openImageInNewTab}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Full Size
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            <img
              src={image.imageUrl}
              alt={image.positivePrompt.slice(0, 100)}
              className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={openImageInNewTab}
            />
          </div>

          {/* Image Info */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">{image.fileName}</h1>
            <p className="text-muted-foreground">
              Created on {image.createdAt.toLocaleDateString()} at{" "}
              {image.createdAt.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <MetadataDisplay image={image} />
        </div>
      </div>
    </div>
  );
}
