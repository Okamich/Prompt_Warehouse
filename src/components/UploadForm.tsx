import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { imageStore, fileToBase64 } from "@/lib/imageStore";
import { cn } from "@/lib/utils";

const uploadSchema = z.object({
  positivePrompt: z.string().min(1, "Positive prompt is required"),
  negativePrompt: z.string().default(""),
  seed: z.number().int().min(0),
  model: z.string().min(1, "Model is required"),
  lora: z.string().optional(),
  cfg: z.number().min(1).max(30),
  steps: z.number().int().min(1).max(150),
  sampler: z.string().min(1, "Sampler is required"),
  scheduler: z.string().min(1, "Scheduler is required"),
  imageSize: z.string().min(1, "Image size is required"),
  tags: z.array(z.string()).default([]),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadFormProps {
  onSuccess?: (imageId: string) => void;
  className?: string;
}

export function UploadForm({ onSuccess, className }: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentTag, setCurrentTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      positivePrompt: "",
      negativePrompt: "",
      seed: 0,
      model: "",
      lora: "",
      cfg: 7,
      steps: 20,
      sampler: "DPM++ 2M Karras",
      scheduler: "Karras",
      imageSize: "512x512",
      tags: [],
    },
  });

  const tags = watch("tags");

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setValue("tags", newTags);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setValue("tags", newTags);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFile) {
      alert("Please select an image file");
      return;
    }

    setIsUploading(true);

    try {
      const imageUrl = await fileToBase64(selectedFile);

      const newImage = imageStore.saveImage({
        ...data,
        imageUrl,
        fileName: selectedFile.name,
      });

      if (onSuccess) {
        onSuccess(newImage.id);
      } else {
        navigate(`/image/${newImage.id}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Upload Stable Diffusion Image
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image File</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25",
                previewUrl ? "p-4" : "",
              )}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded"
                  />
                  <p className="text-sm text-muted-foreground">
                    {selectedFile?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Drag and drop an image here, or click to select
                  </p>
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="positivePrompt">Positive Prompt *</Label>
              <Textarea
                id="positivePrompt"
                placeholder="Enter the positive prompt used to generate this image..."
                className="min-h-[100px]"
                {...register("positivePrompt")}
              />
              {errors.positivePrompt && (
                <p className="text-sm text-destructive">
                  {errors.positivePrompt.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="negativePrompt">Negative Prompt</Label>
              <Textarea
                id="negativePrompt"
                placeholder="Enter the negative prompt (optional)..."
                className="min-h-[100px]"
                {...register("negativePrompt")}
              />
            </div>
          </div>

          {/* Generation Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seed">Seed *</Label>
              <Input
                id="seed"
                type="number"
                placeholder="123456789"
                {...register("seed", { valueAsNumber: true })}
              />
              {errors.seed && (
                <p className="text-sm text-destructive">
                  {errors.seed.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cfg">CFG Scale *</Label>
              <Input
                id="cfg"
                type="number"
                step="0.5"
                min="1"
                max="30"
                {...register("cfg", { valueAsNumber: true })}
              />
              {errors.cfg && (
                <p className="text-sm text-destructive">{errors.cfg.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Steps *</Label>
              <Input
                id="steps"
                type="number"
                min="1"
                max="150"
                {...register("steps", { valueAsNumber: true })}
              />
              {errors.steps && (
                <p className="text-sm text-destructive">
                  {errors.steps.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageSize">Image Size *</Label>
              <Input
                id="imageSize"
                placeholder="512x512"
                {...register("imageSize")}
              />
              {errors.imageSize && (
                <p className="text-sm text-destructive">
                  {errors.imageSize.message}
                </p>
              )}
            </div>
          </div>

          {/* Model and Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model (Checkpoint) *</Label>
              <Input
                id="model"
                placeholder="e.g., Realistic Vision v3.0"
                {...register("model")}
              />
              {errors.model && (
                <p className="text-sm text-destructive">
                  {errors.model.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sampler">Sampler *</Label>
              <Input
                id="sampler"
                placeholder="e.g., DPM++ 2M Karras"
                {...register("sampler")}
              />
              {errors.sampler && (
                <p className="text-sm text-destructive">
                  {errors.sampler.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduler">Scheduler *</Label>
              <Input
                id="scheduler"
                placeholder="e.g., Karras"
                {...register("scheduler")}
              />
              {errors.scheduler && (
                <p className="text-sm text-destructive">
                  {errors.scheduler.message}
                </p>
              )}
            </div>
          </div>

          {/* LoRA */}
          <div className="space-y-2">
            <Label htmlFor="lora">LoRA (Optional)</Label>
            <Input
              id="lora"
              placeholder="e.g., DetailTweaker_v1.2"
              {...register("lora")}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add Tag
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/gallery")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
