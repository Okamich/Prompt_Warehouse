export interface SDImage {
  id: string;
  imageUrl: string;
  positivePrompt: string;
  negativePrompt: string;
  seed: number;
  model: string;
  lora?: string;
  cfg: number;
  steps: number;
  sampler: string;
  scheduler: string;
  imageSize: string;
  tags: string[];
  createdAt: Date;
  fileName: string;
}

export interface ImageFilters {
  searchTerm: string;
  selectedTags: string[];
  sortBy: "newest" | "oldest" | "name";
}
