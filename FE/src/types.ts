export interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  createdAt?: string;
  artworks?: Artwork[];
}

export interface ChatExchange {
  userMessage: Message;
  assistantMessage: Message;
}

export type WorkCategory = '3d' | 'illustration' | 'photo' | 'code';

export interface Artwork {
  id: string;
  tag: string;
  title: string;
  authorName: string;
  authorId: string;
  imageUrl: string;
  description: string;
  likes?: number;
  category?: WorkCategory;
  model3dType?: 'cyber-cube' | 'retro-torus' | 'crystal-sphere' | 'game-asset';
  
  modelUrl?: string;
}

export interface Member {
  id: string;
  name: string;
  nickname: string;
  role: string;
  avatar: string;
  skills: string;
  bio: string;
  projects: {
    title: string;
    description: string;
    tech: string;
    image?: string;
  }[];
  artworks: Artwork[];
}
