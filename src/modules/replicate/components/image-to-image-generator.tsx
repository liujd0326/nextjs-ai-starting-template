"use client";

import { Download, Image as ImageIcon, Settings,Upload, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useRef,useState } from 'react';
import { toast } from 'sonner';

import { SignInDialog } from '@/components/auth/sign-in-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

import { generateImageToImage } from '../actions/image-to-image';
import { FaceToManyKontextInput } from '../types';

interface ImageToImageGeneratorProps {
  className?: string;
}

const STYLE_OPTIONS: { value: FaceToManyKontextInput['style']; label: string }[] = [
  { value: 'Random', label: 'Random' },
  { value: 'Anime', label: 'Anime' },
  { value: 'Cartoon', label: 'Cartoon' },
  { value: 'Clay', label: 'Clay' },
  { value: 'Gothic', label: 'Gothic' },
  { value: 'Graphic Novel', label: 'Graphic Novel' },
  { value: 'Lego', label: 'Lego' },
  { value: 'Memoji', label: 'Memoji' },
  { value: 'Minecraft', label: 'Minecraft' },
  { value: 'Minimalist', label: 'Minimalist' },
  { value: 'Pixel Art', label: 'Pixel Art' },
  { value: 'Simpsons', label: 'Simpsons' },
  { value: 'Sketch', label: 'Sketch' },
  { value: 'South Park', label: 'South Park' },
  { value: 'Toy', label: 'Toy' },
  { value: 'Watercolor', label: 'Watercolor' },
];

const PERSONA_OPTIONS: { value: FaceToManyKontextInput['persona']; label: string }[] = [
  { value: 'None', label: 'None' },
  { value: 'Random', label: 'Random' },
  { value: 'Angel', label: 'Angel' },
  { value: 'Astronaut', label: 'Astronaut' },
  { value: 'Demon', label: 'Demon' },
  { value: 'Mage', label: 'Mage' },
  { value: 'Ninja', label: 'Ninja' },
  { value: "Na'vi", label: "Na'vi" },
  { value: 'Robot', label: 'Robot' },
  { value: 'Samurai', label: 'Samurai' },
  { value: 'Vampire', label: 'Vampire' },
  { value: 'Werewolf', label: 'Werewolf' },
  { value: 'Zombie', label: 'Zombie' },
];

const ASPECT_RATIO_OPTIONS: { value: FaceToManyKontextInput['aspect_ratio']; label: string }[] = [
  { value: 'match_input_image', label: 'Match Input Image' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '16:9', label: '16:9 (Landscape)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
  { value: '3:2', label: '3:2' },
  { value: '2:3', label: '2:3' },
  { value: '4:5', label: '4:5' },
  { value: '5:4', label: '5:4' },
  { value: '21:9', label: '21:9 (Ultra Wide)' },
  { value: '9:21', label: '9:21' },
  { value: '2:1', label: '2:1' },
  { value: '1:2', label: '1:2' },
];

export const ImageToImageGenerator = ({ className }: ImageToImageGeneratorProps) => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [style, setStyle] = useState<FaceToManyKontextInput['style']>('Random');
  const [persona, setPersona] = useState<FaceToManyKontextInput['persona']>('None');
  const [numImages, setNumImages] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<FaceToManyKontextInput['aspect_ratio']>('match_input_image');
  const [preserveOutfit, setPreserveOutfit] = useState(false);
  const [preserveBackground, setPreserveBackground] = useState(false);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [outputFormat, setOutputFormat] = useState<FaceToManyKontextInput['output_format']>('png');
  const [safetyTolerance, setSafetyTolerance] = useState<FaceToManyKontextInput['safety_tolerance']>(2);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setInputFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setInputPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!inputFile) {
      toast.error('Please select an input image');
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      const formData = new FormData();
      formData.append('inputFile', inputFile);
      formData.append('style', style || 'Random');
      formData.append('persona', persona || 'None');
      formData.append('numImages', numImages.toString());
      formData.append('aspectRatio', aspectRatio || 'match_input_image');
      formData.append('preserveOutfit', preserveOutfit.toString());
      formData.append('preserveBackground', preserveBackground.toString());
      formData.append('outputFormat', outputFormat || 'png');
      formData.append('safetyTolerance', safetyTolerance.toString());
      
      if (seed) {
        formData.append('seed', seed.toString());
      }

      const result = await generateImageToImage(formData);

      if (result.success && result.outputUrls) {
        setGeneratedImages(result.outputUrls);
        toast.success(result.message);
      } else {
        // Check if error is due to authentication
        if (result.message === "Please sign in to continue") {
          setShowSignInDialog(true);
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-image-${index + 1}.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Image to Image Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <Label htmlFor="image-upload" className="text-base font-medium">
              Upload Image
            </Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-dashed"
                  disabled={isGenerating}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Click to upload image</span>
                    <span className="text-xs text-muted-foreground">
                      JPEG, PNG, GIF, WebP (Max 10MB)
                    </span>
                  </div>
                </Button>
              </div>
              {inputPreview && (
                <div className="relative">
                  <Image
                    src={inputPreview}
                    alt="Input preview"
                    className="w-full h-32 object-cover rounded-lg"
                    width={200}
                    height={128}
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Basic Settings */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style || 'Random'} onValueChange={(value) => setStyle(value as FaceToManyKontextInput['style'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value || 'Random'}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona">Persona</Label>
              <Select value={persona || 'None'} onValueChange={(value) => setPersona(value as FaceToManyKontextInput['persona'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select persona" />
                </SelectTrigger>
                <SelectContent>
                  {PERSONA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value || 'None'}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="num-images">Number of Images</Label>
              <Select value={numImages.toString()} onValueChange={(value) => setNumImages(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Image' : 'Images'} ({num} {num === 1 ? 'Credit' : 'Credits'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as FaceToManyKontextInput['aspect_ratio'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-0 h-auto font-normal"
            >
              <Settings className="h-4 w-4 mr-2" />
              Advanced Settings
            </Button>
            <Badge variant="secondary" className="text-xs">
              Optional
            </Badge>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserve-outfit"
                    checked={preserveOutfit}
                    onCheckedChange={setPreserveOutfit}
                  />
                  <Label htmlFor="preserve-outfit">Preserve Outfit</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserve-background"
                    checked={preserveBackground}
                    onCheckedChange={setPreserveBackground}
                  />
                  <Label htmlFor="preserve-background">Preserve Background</Label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seed">Seed (Optional)</Label>
                  <Input
                    id="seed"
                    type="number"
                    placeholder="Leave empty for random"
                    value={seed || ''}
                    onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="output-format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={(value) => setOutputFormat(value as FaceToManyKontextInput['output_format'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpg">JPG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="safety-tolerance">Safety Tolerance</Label>
                <Select 
                  value={safetyTolerance.toString()} 
                  onValueChange={(value) => setSafetyTolerance(parseInt(value) as FaceToManyKontextInput['safety_tolerance'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 (Most Strict)</SelectItem>
                    <SelectItem value="1">1 (Moderate)</SelectItem>
                    <SelectItem value="2">2 (Most Permissive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Separator />

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!inputFile || isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner className="mr-2" />
                Generating Images...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate {numImages} {numImages === 1 ? 'Image' : 'Images'} ({numImages} {numImages === 1 ? 'Credit' : 'Credits'})
              </>
            )}
          </Button>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Generated Images
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Generated image ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                        width={300}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => downloadImage(url, index)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sign In Dialog */}
      <SignInDialog
        open={showSignInDialog}
        onOpenChange={setShowSignInDialog}
        callbackURL="/"
        onSuccess={() => {
          // Login successful, retry generation
          setShowSignInDialog(false);
          setTimeout(() => {
            handleGenerate();
          }, 1000); // Delay 1 second to ensure auth state is updated
        }}
      />
    </div>
  );
};

export default ImageToImageGenerator;