import { SubjectConfig } from '@/types/word';

export const subjectConfigs: SubjectConfig[] = [
  {
    id: 'english',
    name: '英語',
    icon: '🇺🇸',
    color: 'blue',
    categories: ['単語', '熟語', '文法', '会話', 'その他']
  },
  {
    id: 'social',
    name: '社会',
    icon: '🌍',
    color: 'green',
    categories: ['歴史', '地理', '公民', '政治', '経済', '国際関係']
  },
  {
    id: 'science',
    name: '理科',
    icon: '🔬',
    color: 'purple',
    categories: ['物理', '化学', '生物', '地学', '実験', 'その他']
  },
  {
    id: 'math',
    name: '数学',
    icon: '📐',
    color: 'red',
    categories: ['代数', '幾何', '関数', '統計', '確率', 'その他']
  },
  {
    id: 'japanese',
    name: '国語',
    icon: '📚',
    color: 'orange',
    categories: ['漢字', '熟語', '古文', '現代文', '文学', 'その他']
  },
  {
    id: 'other',
    name: 'その他',
    icon: '📝',
    color: 'gray',
    categories: ['一般常識', '時事問題', 'その他']
  }
];

export const getSubjectConfig = (subject: string): SubjectConfig => {
  return subjectConfigs.find(config => config.id === subject) || subjectConfigs[5]; // デフォルトはother
};

export const getSubjectColor = (subject: string): string => {
  const config = getSubjectConfig(subject);
  return config.color;
}; 