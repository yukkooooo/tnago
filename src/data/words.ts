import { Word } from '@/types/word';

// サンプル単語データ
export const sampleWords: Word[] = [
  // 英語のサンプル
  {
    id: '1',
    term: 'apple',
    meaning: 'りんご',
    subject: 'english',
    category: '単語',
    isLearned: false,
    createdAt: new Date(),
    difficulty: 'easy',
    tags: ['基本単語']
  },
  {
    id: '2',
    term: 'democracy',
    meaning: '民主主義',
    subject: 'english',
    category: '単語',
    isLearned: false,
    createdAt: new Date(),
    difficulty: 'medium',
    tags: ['重要']
  },
  // 社会のサンプル
  {
    id: '3',
    term: '明治維新',
    meaning: '1868年に始まった、江戸幕府を倒して明治政府を樹立した政治・社会の大変革',
    subject: 'social',
    category: '歴史',
    isLearned: false,
    createdAt: new Date(),
    difficulty: 'medium',
    tags: ['重要', 'テスト範囲']
  },
  {
    id: '4',
    term: '三権分立',
    meaning: '立法権（国会）、行政権（内閣）、司法権（裁判所）を分離し、互いに抑制・均衡を保つ制度',
    subject: 'social',
    category: '公民',
    isLearned: false,
    createdAt: new Date(),
    difficulty: 'hard',
    tags: ['重要', '憲法']
  },
  {
    id: '5',
    term: '地球温暖化',
    meaning: '人間活動による温室効果ガスの増加により、地球の平均気温が上昇する現象',
    subject: 'social',
    category: '地理',
    isLearned: false,
    createdAt: new Date(),
    difficulty: 'medium',
    tags: ['環境問題', '時事']
  }
];

// CSVから単語をインポートする関数
export const importWordsFromCSV = (csvText: string): Word[] => {
  const lines = csvText.trim().split('\n');
  const words: Word[] = [];

  // ヘッダー行をスキップ
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // 新しいCSV形式: Term,Meaning,Subject,Category,Difficulty,Tags
    const [term, meaning, subject = 'other', category = '', difficulty = 'medium', tags = ''] = line.split(',').map(s => s.trim());

    if (term && meaning) {
      words.push({
        id: Date.now().toString() + i,
        term,
        meaning,
        subject: subject as any || 'other',
        category: category || undefined,
        isLearned: false,
        createdAt: new Date(),
        difficulty: difficulty as any || 'medium',
        tags: tags ? tags.split('|').map(t => t.trim()) : undefined,
      });
    }
  }

  return words;
};

// 単語をCSV形式でエクスポートする関数
export const exportWordsToCSV = (words: Word[]): string => {
  const header = 'Term,Meaning,Subject,Category,Difficulty,Tags\n';
  const rows = words.map(word => {
    const tags = word.tags ? word.tags.join('|') : '';
    return `${word.term},${word.meaning},${word.subject},${word.category || ''},${word.difficulty || 'medium'},${tags}`;
  }).join('\n');
  return header + rows;
};

// 単語をシャッフルする関数
export const shuffleWords = (words: Word[]): Word[] => {
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 学習済み/未学習でフィルタリングする関数
export const filterWords = (words: Word[], filter: 'all' | 'learned' | 'unlearned'): Word[] => {
  switch (filter) {
    case 'learned':
      return words.filter(word => word.isLearned);
    case 'unlearned':
      return words.filter(word => !word.isLearned);
    default:
      return words;
  }
};

// 教科でフィルタリングする関数
export const filterWordsBySubject = (words: Word[], subject: string): Word[] => {
  if (subject === 'all') return words;
  return words.filter(word => word.subject === subject);
};

// カテゴリでフィルタリングする関数
export const filterWordsByCategory = (words: Word[], category: string): Word[] => {
  if (category === 'all') return words;
  return words.filter(word => word.category === category);
}; 