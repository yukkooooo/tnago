'use client';

import { useState } from 'react';
import { Subject } from '@/types/word';
import { subjectConfigs } from '@/data/subjects';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSubjectFilter: (subject: string) => void;
  onCategoryFilter: (category: string) => void;
  selectedSubject: string;
  selectedCategory: string;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  onSubjectFilter,
  onCategoryFilter,
  selectedSubject,
  selectedCategory,
  placeholder = "用語を検索..."
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const currentSubjectConfig = subjectConfigs.find(config => config.id === selectedSubject);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="space-y-4">
      {/* 教科・カテゴリフィルター */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            教科で絞り込み
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              onSubjectFilter(e.target.value);
              onCategoryFilter('all');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">すべての教科</option>
            {subjectConfigs.map(config => (
              <option key={config.id} value={config.id}>
                {config.icon} {config.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリで絞り込み
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">すべてのカテゴリ</option>
            {currentSubjectConfig?.categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            キーワード検索
          </label>
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
              >
                検索
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 