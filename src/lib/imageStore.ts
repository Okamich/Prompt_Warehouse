import { SDImage, ImageFilters } from "@/types/image";

const STORAGE_KEY = "sd-images";

export const imageStore = {
  // Get all images from localStorage
  getAllImages(): SDImage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const images = JSON.parse(stored);
      return images.map((img: any) => ({
        ...img,
        createdAt: new Date(img.createdAt),
      }));
    } catch (error) {
      console.error("Error loading images:", error);
      return [];
    }
  },

  // Save image to localStorage
  saveImage(image: Omit<SDImage, "id" | "createdAt">): SDImage {
    const newImage: SDImage = {
      ...image,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    const images = this.getAllImages();
    images.unshift(newImage); // Add to beginning

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      return newImage;
    } catch (error) {
      console.error("Error saving image:", error);
      throw new Error("Failed to save image. Storage might be full.");
    }
  },

  // Get image by ID
  getImageById(id: string): SDImage | null {
    const images = this.getAllImages();
    return images.find((img) => img.id === id) || null;
  },

  // Delete image by ID
  deleteImage(id: string): boolean {
    const images = this.getAllImages();
    const filteredImages = images.filter((img) => img.id !== id);

    if (filteredImages.length === images.length) {
      return false; // Image not found
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredImages));
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  },

  // Get all unique tags
  getAllTags(): string[] {
    const images = this.getAllImages();
    const tagSet = new Set<string>();

    images.forEach((image) => {
      image.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  },

  // Filter images based on criteria
  filterImages(filters: ImageFilters): SDImage[] {
    let images = this.getAllImages();

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      images = images.filter(
        (img) =>
          img.positivePrompt.toLowerCase().includes(term) ||
          img.negativePrompt.toLowerCase().includes(term) ||
          img.model.toLowerCase().includes(term) ||
          img.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    // Filter by tags
    if (filters.selectedTags.length > 0) {
      images = images.filter((img) =>
        filters.selectedTags.every((tag) => img.tags.includes(tag)),
      );
    }

    // Sort images
    images.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "name":
          return a.fileName.localeCompare(b.fileName);
        default:
          return 0;
      }
    });

    return images;
  },
};

// Utility function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
