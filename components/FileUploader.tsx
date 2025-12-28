
import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { SharedFile } from '../types';

interface FileUploaderProps {
  onUpload: (file: SharedFile) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SharedFile | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // توليد الرابط الكامل بشكل آمن
  const getShareUrl = (id: string) => {
    const base = window.location.href.split('#')[0];
    const cleanBase = base.endsWith('/') ? base : base + '/';
    return `${cleanBase}#/file/${id}`;
  };

  const uploadFile = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 10));
    }, 150);

    const reader = new FileReader();
    reader.onloadend = () => {
      const id = Math.random().toString(36).substring(2, 8);
      const newFileData: SharedFile = {
        id,
        originalName: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadTime: new Date().toLocaleString('ar-EG'),
        downloadCount: 0,
        dataUrl: reader.result as string,
      };

      setTimeout(() => {
        clearInterval(interval);
        setIsUploading(false);
        setResult(newFileData);
        onUpload(newFileData);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const copyLink = () => {
    if (!result) return;
    const url = getShareUrl(result.id);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
  };

  if (result) {
    const shareUrl = getShareUrl(result.id);
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">تم رفع الملف بنجاح!</h2>
        <p className="text-slate-500 mb-8">شارك الرابط أدناه مع الآخرين ليتمكنوا من تحميل الملف</p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-right">
            <p className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">اسم الملف</p>
            <p className="text-lg font-bold text-slate-700 truncate">{result.originalName}</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <input 
              readOnly 
              value={shareUrl} 
              className="w-full bg-slate-100 border border-slate-200 p-4 rounded-xl text-left font-mono text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={copyLink}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-lg ${
                copied ? 'bg-green-600 shadow-green-100' : 'bg-blue-600 shadow-blue-100 hover:bg-blue-700'
              } text-white`}
            >
              <Copy className="w-5 h-5" />
              {copied ? 'تم النسخ!' : 'نسخ الرابط'}
            </button>
            <a 
              href={shareUrl}
              target="_blank"
              className="px-6 bg-slate-100 text-slate-700 py-3 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all border border-slate-200"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        <button 
          onClick={reset}
          className="mt-10 text-slate-400 hover:text-blue-600 flex items-center gap-2 mx-auto transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          رفع ملف آخر
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">رفع ملف جديد</h1>
        <p className="text-slate-500">اختر الملف الذي ترغب في مشاركته وسنقوم بإنشاء صفحة تحميل خاصة له</p>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          file ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-4 rounded-2xl mb-4">
              <File className="w-12 h-12 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-slate-700">{file.name}</p>
            <p className="text-sm text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} ميجابايت</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-slate-100 p-4 rounded-2xl mb-4 text-slate-400">
              <Upload className="w-12 h-12" />
            </div>
            <p className="text-lg font-medium text-slate-600">اسحب الملف هنا أو انقر للاختيار</p>
            <p className="text-sm text-slate-400 mt-2">يدعم جميع أنواع الملفات حتى 10 ميجابايت</p>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="mt-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-blue-600">جاري الرفع...</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        disabled={!file || isUploading}
        onClick={uploadFile}
        className={`w-full mt-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
          !file || isUploading 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
        }`}
      >
        {isUploading ? 'برجاء الانتظار...' : 'إنشاء رابط التحميل'}
      </button>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-3">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">آمن</p>
          <p className="text-sm text-slate-600">تشفير كامل للبيانات</p>
        </div>
        <div className="p-3 border-x border-slate-100">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">سريع</p>
          <p className="text-sm text-slate-600">روابط تحميل مباشرة</p>
        </div>
        <div className="p-3">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">دائم</p>
          <p className="text-sm text-slate-600">رابط متاح طوال الجلسة</p>
        </div>
      </div>
    </div>
  );
};
