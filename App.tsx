
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { FileUploader } from './components/FileUploader';
import { FileViewer } from './components/FileViewer';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { SharedFile } from './types';

const App: React.FC = () => {
  const [files, setFiles] = useState<Record<string, SharedFile>>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });

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
        [id]: { ...prev[id], downloadCount: (prev[id].downloadCount || 0) + 1 }
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
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
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard files={files} onDelete={deleteFile} /> : <Navigate to="/login" />} 
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
      <footer className="bg-white border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-4">© {new Date().getFullYear()} سحابة شارك - حلول ذكية لمشاركة الملفات</p>
          <div className="flex justify-center items-center gap-4 text-xs text-slate-300">
            <a href="#/login" className="hover:text-blue-400 transition-colors">دخول الإدارة</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
