import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Upload,
  Gallery,
  Search,
  Tags,
  Settings,
  Palette,
  Brain,
  Zap,
} from "lucide-react";
import { imageStore } from "@/lib/imageStore";
import { useState, useEffect } from "react";

export default function Index() {
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    const images = imageStore.getAllImages();
    setImageCount(images.length);
  }, []);

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Easy Upload",
      description:
        "Drag and drop your Stable Diffusion images with complete metadata",
    },
    {
      icon: <Gallery className="w-6 h-6" />,
      title: "Beautiful Gallery",
      description:
        "Organize and showcase your AI art in a stunning grid layout",
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description:
        "Find images by prompts, models, tags, or generation parameters",
    },
    {
      icon: <Tags className="w-6 h-6" />,
      title: "Tag System",
      description:
        "Categorize your images with custom tags for better organization",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Complete Metadata",
      description:
        "Store all generation details: seeds, models, CFG, steps, and more",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Prompt Management",
      description:
        "Save both positive and negative prompts with easy copy functionality",
    },
  ];

  const techDetails = [
    "Seed values and generation parameters",
    "Model checkpoints and LoRA information",
    "Sampling methods and schedulers",
    "CFG scale and step counts",
    "Image dimensions and file details",
    "Custom tags and categories",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Art Portfolio
            </h1>
          </div>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Your personal showcase for Stable Diffusion generated images.
            Upload, organize, and share your AI art with complete generation
            metadata.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/gallery">
              <Button size="lg" className="flex items-center gap-2">
                <Gallery className="w-5 h-5" />
                View Gallery
                {imageCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {imageCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/upload">
              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          {imageCount > 0 && (
            <div className="bg-muted/30 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon className="w-5 h-5" />
                <span className="text-lg">
                  <strong className="text-foreground">{imageCount}</strong>{" "}
                  image{imageCount === 1 ? "" : "s"} in your collection
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and showcase your AI-generated
              artwork
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                Complete Metadata Support
              </h2>
              <p className="text-muted-foreground">
                Store and display all the technical details of your Stable
                Diffusion generations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Generation Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {techDetails.map((detail, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Prompt Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                      Positive Prompts
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Store the creative descriptions that brought your images
                      to life
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                      Negative Prompts
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Keep track of what you wanted to avoid in your generations
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to organize your AI art?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start building your personal AI art collection today. Upload your
            first image and experience the power of organized creativity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Your First Image
              </Button>
            </Link>

            {imageCount > 0 && (
              <Link to="/gallery">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Gallery className="w-5 h-5" />
                  Browse Your Gallery
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
