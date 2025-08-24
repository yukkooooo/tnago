'use client';

import { useState, useRef } from 'react';
import { Word, Subject } from '@/types/word';
import { importWordsFromCSV, exportWordsToCSV } from '@/data/words';
import { subjectConfigs } from '@/data/subjects';

interface CSVImporterProps {
  onImport: (words: Word[]) => void;
  currentWords: Word[];
}

export default function CSVImporter({ onImport, currentWords }: CSVImporterProps) {
  const [csvText, setCsvText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('other');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSubjectConfig = subjectConfigs.find(config => config.id === selectedSubject);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!csvText.trim()) return;

    setIsImporting(true);
    try {
      const newWords = importWordsFromCSV(csvText);
      onImport([...currentWords, ...newWords]);
      setCsvText('');
      alert(`${newWords.length}個の用語をインポートしました！`);
    } catch (error) {
      alert('CSVのインポートに失敗しました。形式を確認してください。');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = () => {
    const csvContent = exportWordsToCSV(currentWords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `words_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTemplate = () => {
    const template = 'Term,Meaning,Subject,Category,Difficulty,Tags\napple,りんご,english,単語,easy,基本単語\n明治維新,1868年に始まった政治・社会の大変革,social,歴史,medium,重要|テスト範囲';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'words_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addSingleWord = () => {
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      alert('用語と意味を入力してください');
      return;
    }

    const [term, meaning] = lines[0].split(',').map(s => s.trim());
    if (!term || !meaning) {
      alert('用語と意味を正しく入力してください');
      return;
    }

    const newWord: Word = {
      id: Date.now().toString(),
      term,
      meaning,
      subject: selectedSubject,
      category: selectedCategory || undefined,
      isLearned: false,
      createdAt: new Date(),
      difficulty: 'medium',
    };

    onImport([...currentWords, newWord]);
    setCsvText('');
    alert('用語を追加しました！');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">用語インポート/エクスポート</h3>

      <div className="space-y-4">
        {/* 教科とカテゴリ選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              教科を選択
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value as Subject);
                setSelectedCategory('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {subjectConfigs.map(config => (
                <option key={config.id} value={config.id}>
                  {config.icon} {config.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリを選択
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">カテゴリなし</option>
              {currentSubjectConfig?.categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ファイルアップロード */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSVファイルをアップロード
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* CSVテキスト入力 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            または、CSVテキストを直接入力
          </label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Term,Meaning,Subject,Category,Difficulty,Tags&#10;apple,りんご,english,単語,easy,基本単語&#10;明治維新,1868年に始まった政治・社会の大変革,social,歴史,medium,重要|テスト範囲"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* ボタン群 */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleImport}
            disabled={!csvText.trim() || isImporting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? 'インポート中...' : 'CSVインポート'}
          </button>

          <button
            onClick={addSingleWord}
            disabled={!csvText.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            単語追加
          </button>

          <button
            onClick={handleExport}
            disabled={currentWords.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            エクスポート
          </button>

          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            テンプレートダウンロード
          </button>
        </div>

        {/* ヘルプテキスト */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">CSV形式について：</p>
          <p>1行目：ヘッダー（Term,Meaning,Subject,Category,Difficulty,Tags）</p>
          <p>2行目以降：用語,意味,教科,カテゴリ,難易度,タグ（|区切り）</p>
          <p>例：apple,りんご,english,単語,easy,基本単語</p>
          <p>例：明治維新,1868年に始まった政治・社会の大変革,social,歴史,medium,重要|テスト範囲</p>
        </div>
      </div>
    </div>
  );
} 