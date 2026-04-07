export interface Word {
  id: number;
  word: string;
  description: string;
  example?: string;
  category?: string;
}

export interface ProgressData {
  skipped: Word[];
  learnt: Word[];
}

export type AppView = 'learning' | 'complete';
