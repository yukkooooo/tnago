export type Subject = 'english' | 'social' | 'science' | 'math' | 'japanese' | 'other';

export interface Word {
  id: string;
  term: string;           // 用語（英単語や社会用語など）
  meaning: string;        // 意味・説明
  subject: Subject;       // 教科
  category?: string;      // カテゴリ（例：歴史、地理、公民など）
  isLearned: boolean;
  createdAt: Date;
  lastReviewed?: Date;
  difficulty?: 'easy' | 'medium' | 'hard'; // 難易度
  tags?: string[];        // タグ（例：重要、テスト範囲など）
}

export interface WordStats {
  total: number;
  learned: number;
  unlearned: number;
  reviewCount: number;
  bySubject: Record<Subject, number>;
}

export interface SubjectConfig {
  id: Subject;
  name: string;
  icon: string;
  color: string;
  categories: string[];
} 