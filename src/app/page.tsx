'use client';

import { useState, useEffect } from 'react';
import { Word } from '@/types/word';
import { sampleWords } from '@/data/words';
import { filterWordsBySubject, filterWordsByCategory } from '@/data/words';
import WordList from '@/components/WordList';
import CSVImporter from '@/components/CSVImporter';
import QuizMode from '@/components/QuizMode';
import SearchBar from '@/components/SearchBar';

type Mode = 'list' | 'quiz';

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [mode, setMode] = useState<Mode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);

  // 初期データの読み込み
  useEffect(() => {
    const savedWords = localStorage.getItem('tnago-words');
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    } else {
      setWords(sampleWords);
    }
  }, []);

  // 単語データの保存
  useEffect(() => {
    localStorage.setItem('tnago-words', JSON.stringify(words));
  }, [words]);

  // 検索・フィルタリング
  useEffect(() => {
    let filtered = words;

    // 教科でフィルタリング
    if (selectedSubject !== 'all') {
      filtered = filterWordsBySubject(filtered, selectedSubject);
    }

    // カテゴリでフィルタリング
    if (selectedCategory !== 'all') {
      filtered = filterWordsByCategory(filtered, selectedCategory);
    }

    // キーワード検索
    if (searchQuery.trim()) {
      filtered = filtered.filter(word =>
        word.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.meaning.includes(searchQuery)
      );
    }

    setFilteredWords(filtered);
  }, [words, searchQuery, selectedSubject, selectedCategory]);

  const handleToggleLearned = (wordId: string) => {
    setWords(prev =>
      prev.map(word =>
        word.id === wordId
          ? { ...word, isLearned: !word.isLearned, lastReviewed: new Date() }
          : word
      )
    );
  };

  const handleImportWords = (newWords: Word[]) => {
    setWords(newWords);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSubjectFilter = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Tnago</h1>
        <p className="text-gray-600">オフラインで使える学習用語アプリ</p>
      </header>

      {/* モード切り替え */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setMode('list')}
            className={`px-6 py-2 rounded-md transition-colors ${mode === 'list'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            用語一覧
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-6 py-2 rounded-md transition-colors ${mode === 'quiz'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            クイズモード
          </button>
        </div>
      </div>

      {/* CSVインポーター */}
      <CSVImporter onImport={handleImportWords} currentWords={words} />

      {/* 検索・フィルターバー */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          onSubjectFilter={handleSubjectFilter}
          onCategoryFilter={handleCategoryFilter}
          selectedSubject={selectedSubject}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* メインコンテンツ */}
      <main>
        {mode === 'list' ? (
          <WordList
            words={filteredWords}
            onToggleLearned={handleToggleLearned}
          />
        ) : (
          <QuizMode
            words={filteredWords}
            onToggleLearned={handleToggleLearned}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>© 2024 Tnago - 学習用語アプリ</p>
        <p className="mt-1">オフライン対応・PWA対応・全教科対応</p>
      </footer>
    </div>
  );
} 