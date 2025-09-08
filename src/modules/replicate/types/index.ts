export interface FaceToManyKontextInput {
  input_image: string;
  style?: 'Anime' | 'Cartoon' | 'Clay' | 'Gothic' | 'Graphic Novel' | 'Lego' | 'Memoji' | 'Minecraft' | 'Minimalist' | 'Pixel Art' | 'Random' | 'Simpsons' | 'Sketch' | 'South Park' | 'Toy' | 'Watercolor';
  persona?: 'Angel' | 'Astronaut' | 'Demon' | 'Mage' | 'Ninja' | "Na'vi" | 'None' | 'Random' | 'Robot' | 'Samurai' | 'Vampire' | 'Werewolf' | 'Zombie';
  num_images?: number;
  aspect_ratio?: 'match_input_image' | '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3' | '4:5' | '5:4' | '21:9' | '9:21' | '2:1' | '1:2';
  preserve_outfit?: boolean;
  preserve_background?: boolean;
  seed?: number;
  output_format?: 'jpg' | 'png';
  safety_tolerance?: 0 | 1 | 2;
}

export interface ImageToImageGenerationParams {
  style: FaceToManyKontextInput['style'];
  persona: FaceToManyKontextInput['persona'];
  numImages: number;
  aspectRatio: FaceToManyKontextInput['aspect_ratio'];
  preserveOutfit: boolean;
  preserveBackground: boolean;
  seed?: number;
  outputFormat: FaceToManyKontextInput['output_format'];
  safetyTolerance: FaceToManyKontextInput['safety_tolerance'];
}

export interface GenerationResult {
  success: boolean;
  generationId?: string;
  message: string;
  outputUrls?: string[];
}