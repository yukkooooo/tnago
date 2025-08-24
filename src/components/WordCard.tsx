'use client';

import { useState, useCallback, memo } from 'react';
import { Word } from '@/types/word';
import { getSubjectConfig } from '@/data/subjects';

interface WordCardProps {
  word: Word;
  onToggleLearned: (wordId: string) => void;
}

const WordCard = memo(({ word, onToggleLearned }: WordCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const subjectConfig = getSubjectConfig(word.subject);

  const handleCardClick = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleToggleLearned = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLearned(word.id);
  }, [word.id, onToggleLearned]);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getDifficultyText = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '簡単';
      case 'medium': return '普通';
      case 'hard': return '難しい';
      default: return '未設定';
    }
  }, []);

  return (
    <div className="card-flip w-full h-64 cursor-pointer" onClick={handleCardClick}>
      <div className={`card-inner relative w-full h-full ${isFlipped ? 'flipped' : ''}`}>
        {/* 表面（用語） */}
        <div className="card-front bg-white rounded-lg shadow-lg border-2 border-gray-200 flex flex-col items-center justify-center p-6 hover:shadow-xl transition-shadow">
          {/* 教科とカテゴリ */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">{subjectConfig.icon}</span>
            <span className="text-sm font-medium text-gray-600">{subjectConfig.name}</span>
            {word.category && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {word.category}
              </span>
            )}
          </div>

          {/* 用語 */}
          <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center leading-tight">
            {word.term}
          </h3>

          {/* 難易度とタグ */}
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {word.difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                {getDifficultyText(word.difficulty)}
              </span>
            )}
            {word.tags && word.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>

          {/* 学習状態とボタン */}
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${word.isLearned
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}>
              {word.isLearned ? '学習済み' : '未学習'}
            </span>
            <button
              onClick={handleToggleLearned}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${word.isLearned
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
            >
              {word.isLearned ? '未学習に戻す' : '学習済みにする'}
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-3">クリックして意味を表示</p>
        </div>

        {/* 裏面（意味・説明） */}
        <div className="card-back bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex flex-col items-center justify-center p-6 text-white">
          <h3 className="text-2xl font-bold mb-4 text-center leading-tight">{word.meaning}</h3>
          <p className="text-xl text-blue-100 mb-4">意味・説明</p>

          {/* 教科情報 */}
          <div className="text-center mb-3">
            <div className="text-3xl mb-1">{subjectConfig.icon}</div>
            <div className="text-sm text-blue-100">{subjectConfig.name}</div>
            {word.category && (
              <div className="text-xs text-blue-200 mt-1">{word.category}</div>
            )}
          </div>

          <p className="text-blue-50 text-sm text-center">クリックして用語に戻る</p>
        </div>
      </div>
    </div>
  );
});

WordCard.displayName = 'WordCard';

export default WordCard; 