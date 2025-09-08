import { ImageToImageGenerator } from '@/modules/replicate/components/image-to-image-generator';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              AI Image Transformation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your photos into stunning artwork with our AI-powered image-to-image generator. 
              Choose from various styles and personas to create unique variations of your images.
            </p>
          </div>

          {/* Image Generator */}
          <ImageToImageGenerator />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
