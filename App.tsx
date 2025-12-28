
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { FileUploader } from './components/FileUploader';
import { FileViewer } from './components/FileViewer';
import { Dashboard } from './components/Dashboard';
import { SharedFile } from './types';

const App: React.FC = () => {
  const [files, setFiles] = useState<Record<string, SharedFile>>({});

  // Initialize from localStorage for persistence in demo
  useEffect(() => {
    const saved = localStorage.getItem('shared_files_metadata');
    if (saved) {
      try {
        setFiles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load files from storage", e);
      }
    }
  }, []);

  const persistMetadata = (updatedFiles: Record<string, SharedFile>) => {
    // Note: We don't save the full dataUrl to localStorage to avoid QuotaExceededError
    const metadataOnly: Record<string, SharedFile> = {};
    Object.keys(updatedFiles).forEach(id => {
      const f = updatedFiles[id];
      if (f) {
        metadataOnly[id] = { ...f, dataUrl: f.dataUrl ? 'HIDDEN_FOR_STORAGE' : '' };
      }
    });
    localStorage.setItem('shared_files_metadata', JSON.stringify(metadataOnly));
  };

  const handleFileUpload = (newFile: SharedFile) => {
    setFiles(prev => {
      const updated = { ...prev, [newFile.id]: newFile };
      persistMetadata(updated);
      return updated;
    });
  };

  const incrementDownload = (id: string) => {
    if (!files[id]) return;
    setFiles(prev => {
      const updated = {
        ...prev,
        [id]: { ...prev[id], downloadCount: prev[id].downloadCount + 1 }
      };
      persistMetadata(updated);
      return updated;
    });
  };

  const deleteFile = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      setFiles(prev => {
        const { [id]: _, ...remaining } = prev;
        persistMetadata(remaining);
        return remaining;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route 
            path="/" 
            element={<FileUploader onUpload={handleFileUpload} />} 
          />
          <Route 
            path="/file/:id" 
            element={<FileViewer files={files} onDownload={incrementDownload} />} 
          />
          <Route 
            path="/dashboard" 
            element={<Dashboard files={files} onDelete={deleteFile} />} 
          />
          <Route 
            path="*" 
            element={
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-700">الصفحة غير موجودة</h2>
                <button 
                  onClick={() => window.location.hash = '/'}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  العودة للرئيسية
                </button>
              </div>
            } 
          />
        </Routes>
      </main>
      <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} سحابة شارك - حلول ذكية لمشاركة الملفات</p>
      </footer>
    </div>
  );
};

export default App;
