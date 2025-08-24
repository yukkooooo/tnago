'use client';

import { useState, useEffect } from 'react';
import { Word } from '@/types/word';
import { shuffleWords } from '@/data/words';

interface QuizModeProps {
  words: Word[];
  onToggleLearned: (wordId: string) => void;
}

export default function QuizMode({ words, onToggleLearned }: QuizModeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    if (words.length > 0) {
      setQuizWords(shuffleWords(words));
      setCurrentWordIndex(0);
      setShowAnswer(false);
      setScore({ correct: 0, total: 0 });
    }
  }, [words]);

  const currentWord = quizWords[currentWordIndex];

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentWordIndex < quizWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowAnswer(false);
    }
  };

  const handleMarkAsLearned = () => {
    if (currentWord) {
      onToggleLearned(currentWord.id);
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    }
  };

  const handleMarkAsUnlearned = () => {
    if (currentWord) {
      onToggleLearned(currentWord.id);
    }
  };

  const handleRestart = () => {
    setQuizWords(shuffleWords(words));
    setCurrentWordIndex(0);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">クイズする用語がありません</div>
        <p className="text-gray-400 mt-2">まずは用語を追加してください</p>
      </div>
    );
  }

  if (currentWordIndex >= quizWords.length) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl font-bold text-gray-800 mb-4">クイズ完了！</div>
        <div className="text-lg text-gray-600 mb-6">
          正解率: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
          ({score.correct}/{score.total})
        </div>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          もう一度クイズする
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 進捗バー */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>問題 {currentWordIndex + 1} / {quizWords.length}</span>
          <span>正解: {score.correct}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentWordIndex + 1) / quizWords.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 問題カード */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {currentWord?.term}
          </h2>
          <p className="text-gray-600">この用語の意味は何ですか？</p>
        </div>

        {showAnswer ? (
          <div className="space-y-6">
            <div className="text-2xl font-bold text-blue-600">
              {currentWord?.meaning}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleMarkAsLearned}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                知っていた
              </button>
              <button
                onClick={handleMarkAsUnlearned}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                知らなかった
              </button>
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              次の問題
            </button>
          </div>
        ) : (
          <button
            onClick={handleShowAnswer}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            答えを見る
          </button>
        )}
      </div>

      {/* スキップボタン */}
      <div className="text-center mt-4">
        <button
          onClick={handleNext}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          この問題をスキップ
        </button>
      </div>
    </div>
  );
} 