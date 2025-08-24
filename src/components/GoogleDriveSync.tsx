'use client';

import { useState, useCallback } from 'react';
import { Word } from '@/types/word';

interface GoogleDriveSyncProps {
  words: Word[];
  onWordsUpdate: (words: Word[]) => void;
}

export default function GoogleDriveSync({ words, onWordsUpdate }: GoogleDriveSyncProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [fileName, setFileName] = useState('tnago_words.csv');

  // Google Drive APIの初期化
  const initializeGoogleDrive = useCallback(async () => {
    try {
      setIsLoading(true);

      // Google Drive APIの認証と初期化
      const gapi = await import('gapi-script').then(pkg => pkg.gapi);

      await gapi.load('client:auth2', async () => {
        await gapi.client.init({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.file'
        });

        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          setIsConnected(true);
        }
      });
    } catch (error) {
      console.error('Google Drive初期化エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Googleアカウントでログイン
  const signIn = useCallback(async () => {
    try {
      setIsLoading(true);
      const gapi = await import('gapi-script').then(pkg => pkg.gapi);
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      setIsConnected(true);
    } catch (error) {
      console.error('ログインエラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Google DriveにCSVファイルをアップロード
  const uploadToDrive = useCallback(async () => {
    try {
      setIsLoading(true);

      // CSVデータを作成
      const csvContent = [
        'Term,Meaning,Subject,Category,Difficulty,Tags,Learned',
        ...words.map(word =>
          `${word.term},${word.meaning},${word.subject},${word.category || ''},${word.difficulty || ''},${word.tags?.join(';') || ''},${word.isLearned ? 'true' : 'false'}`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], fileName, { type: 'text/csv' });

      const gapi = await import('gapi-script').then(pkg => pkg.gapi);

      // 既存ファイルを検索
      const response = await gapi.client.drive.files.list({
        q: `name='${fileName}' and trashed=false`,
        spaces: 'drive'
      });

      if (response.result.files && response.result.files.length > 0) {
        // 既存ファイルを更新
        const fileId = response.result.files[0].id;
        await gapi.client.drive.files.update({
          fileId: fileId!,
          media: {
            mimeType: 'text/csv',
            body: file
          }
        });
      } else {
        // 新規ファイルを作成
        await gapi.client.drive.files.create({
          requestBody: {
            name: fileName,
            mimeType: 'text/csv'
          },
          media: {
            mimeType: 'text/csv',
            body: file
          }
        });
      }

      alert('Google Driveに保存しました！');
    } catch (error) {
      console.error('アップロードエラー:', error);
      alert('アップロードに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [words, fileName]);

  // Google DriveからCSVファイルをダウンロード
  const downloadFromDrive = useCallback(async () => {
    try {
      setIsLoading(true);

      const gapi = await import('gapi-script').then(pkg => pkg.gapi);

      // ファイルを検索
      const response = await gapi.client.drive.files.list({
        q: `name='${fileName}' and trashed=false`,
        spaces: 'drive'
      });

      if (!response.result.files || response.result.files.length === 0) {
        alert('ファイルが見つかりません');
        return;
      }

      const fileId = response.result.files[0].id;

      // ファイルの内容を取得
      const fileResponse = await gapi.client.drive.files.get({
        fileId: fileId!,
        alt: 'media'
      });

      // CSVデータを解析
      const csvText = fileResponse.body as string;
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');

      const newWords: Word[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const word: Word = {
            id: `word-${Date.now() + i}`,
            term: values[0] || '',
            meaning: values[1] || '',
            subject: (values[2] as any) || 'english',
            category: values[3] || undefined,
            difficulty: (values[4] as 'easy' | 'medium' | 'hard') || undefined,
            tags: values[5] ? values[5].split(';') : undefined,
            isLearned: values[6] === 'true',
            createdAt: new Date()
          };
          newWords.push(word);
        }
      }

      onWordsUpdate(newWords);
      alert('Google Driveから読み込みました！');
    } catch (error) {
      console.error('ダウンロードエラー:', error);
      alert('ダウンロードに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [fileName, onWordsUpdate]);

  // ログアウト
  const signOut = useCallback(async () => {
    try {
      const gapi = await import('gapi-script').then(pkg => pkg.gapi);
      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setIsConnected(false);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🔄 Google Drive同期
      </h3>

      <div className="space-y-4">
        {/* ファイル名設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ファイル名
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tnago_words.csv"
          />
        </div>

        {/* 接続状態 */}
        {!isConnected ? (
          <div className="space-y-3">
            <button
              onClick={initializeGoogleDrive}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? '初期化中...' : 'Google Drive初期化'}
            </button>

            <button
              onClick={signIn}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'ログイン中...' : 'Googleアカウントでログイン'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-green-600 text-sm font-medium">
              ✅ Google Driveに接続済み
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={uploadToDrive}
                disabled={isLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'アップロード中...' : '📤 Driveに保存'}
              </button>

              <button
                onClick={downloadFromDrive}
                disabled={isLoading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'ダウンロード中...' : '📥 Driveから読み込み'}
              </button>
            </div>

            <button
              onClick={signOut}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        💡 この機能で、PCとスマホで学習データを同期できます！
      </div>
    </div>
  );
} 