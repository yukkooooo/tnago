'use client';

import { useState } from 'react';
import { Word } from '@/types/word';
import { filterWords, shuffleWords } from '@/data/words';
import WordCard from './WordCard';

interface WordListProps {
  words: Word[];
  onToggleLearned: (wordId: string) => void;
}

export default function WordList({ words, onToggleLearned }: WordListProps) {
  const [filter, setFilter] = useState<'all' | 'learned' | 'unlearned'>('all');
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentWords, setCurrentWords] = useState<Word[]>(words);

  const filteredWords = filterWords(words, filter);
  const displayWords = isShuffled ? shuffleWords(filteredWords) : filteredWords;

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled) {
      setCurrentWords(shuffleWords(filteredWords));
    } else {
      setCurrentWords(filteredWords);
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'learned' | 'unlearned') => {
    setFilter(newFilter);
    setIsShuffled(false);
  };

  const stats = {
    total: words.length,
    learned: words.filter(w => w.isLearned).length,
    unlearned: words.filter(w => !w.isLearned).length,
  };

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">総単語数</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.learned}</div>
          <div className="text-sm text-green-800">学習済み</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.unlearned}</div>
          <div className="text-sm text-yellow-800">未学習</div>
        </div>
      </div>

      {/* フィルターとシャッフル */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            すべて ({stats.total})
          </button>
          <button
            onClick={() => handleFilterChange('learned')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'learned'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            学習済み ({stats.learned})
          </button>
          <button
            onClick={() => handleFilterChange('unlearned')}
            className={`px-4 py-2 rounded-md transition-colors ${filter === 'unlearned'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            未学習 ({stats.unlearned})
          </button>
        </div>

        <button
          onClick={handleShuffle}
          className={`px-4 py-2 rounded-md transition-colors ${isShuffled
            ? 'bg-purple-600 text-white'
            : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
        >
          {isShuffled ? 'シャッフル解除' : 'シャッフル'}
        </button>
      </div>

      {/* 単語カード一覧 */}
      {displayWords.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {filter === 'all' ? '単語がありません' : '該当する単語がありません'}
          </div>
          <p className="text-gray-400 mt-2">
            CSVで単語をインポートするか、手動で追加してください
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onToggleLearned={onToggleLearned}
            />
          ))}
        </div>
      )}
    </div>
  );
} 