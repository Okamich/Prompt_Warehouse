import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Settings,
  Image as ImageIcon,
  Palette,
  Clock,
} from "lucide-react";
import { SDImage } from "@/types/image";
import { cn } from "@/lib/utils";

interface MetadataDisplayProps {
  image: SDImage;
  className?: string;
}

export function MetadataDisplay({ image, className }: MetadataDisplayProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    });
  };

  const copyAllMetadata = () => {
    const metadata = `Positive Prompt: ${image.positivePrompt}
Negative Prompt: ${image.negativePrompt}
Model: ${image.model}
${image.lora ? `LoRA: ${image.lora}` : ""}
Seed: ${image.seed}
CFG Scale: ${image.cfg}
Steps: ${image.steps}
Sampler: ${image.sampler}
Scheduler: ${image.scheduler}
Image Size: ${image.imageSize}
Tags: ${image.tags.join(", ")}`;

    copyToClipboard(metadata, "All metadata");
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with copy all button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Generation Details
        </h2>
        <Button onClick={copyAllMetadata} variant="outline" size="sm">
          <Copy className="w-4 h-4 mr-2" />
          Copy All
        </Button>
      </div>

      {/* Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5" />
            Prompts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-green-600 dark:text-green-400">
                Positive Prompt
              </label>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  copyToClipboard(image.positivePrompt, "Positive prompt")
                }
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm bg-muted p-3 rounded-md leading-relaxed">
              {image.positivePrompt}
            </p>
          </div>

          {image.negativePrompt && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-red-600 dark:text-red-400">
                  Negative Prompt
                </label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyToClipboard(image.negativePrompt, "Negative prompt")
                  }
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm bg-muted p-3 rounded-md leading-relaxed">
                {image.negativePrompt}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            Generation Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Seed
              </label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm">{image.seed}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(image.seed.toString(), "Seed")}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                CFG Scale
              </label>
              <p className="font-mono text-sm">{image.cfg}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Steps
              </label>
              <p className="font-mono text-sm">{image.steps}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sampler
              </label>
              <p className="text-sm">{image.sampler}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Scheduler
              </label>
              <p className="text-sm">{image.scheduler}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Image Size
              </label>
              <p className="text-sm font-mono">{image.imageSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="w-5 h-5" />
            Model & LoRA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Model (Checkpoint)
            </label>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-medium">{image.model}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(image.model, "Model")}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {image.lora && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                LoRA
              </label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm">{image.lora}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(image.lora!, "LoRA")}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags and Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {image.tags.length > 0 && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider">
                File Name
              </label>
              <p className="mt-1 font-mono">{image.fileName}</p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider">
                Created
              </label>
              <p className="mt-1">{image.createdAt.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
