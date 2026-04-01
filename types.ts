export enum Subject {
  SCIENCE = '과학',
  HISTORY = '역사',
  ART = '미술',
  GEOGRAPHY = '지리',
  LITERATURE = '문학',
  GENERAL = '일반 학습'
}

export enum TextLanguage {
  KOREAN = '한국어',
  ENGLISH = '영어',
  MIXED = '한국어 & 영어'
}

export interface SourceUrl {
  title: string;
  uri: string;
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
  subject: Subject;
  timestamp: number;
  sourceUrls?: SourceUrl[];
}

export interface GenerationState {
  isLoading: boolean;
  loadingStage: 'idle' | 'verifying' | 'generating';
  error: string | null;
  currentImage: GeneratedImage | null;
}