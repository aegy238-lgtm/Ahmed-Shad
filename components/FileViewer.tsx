
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, FileText, Calendar, BarChart3, ArrowRight, AlertTriangle } from 'lucide-react';
import { SharedFile } from '../types';

interface FileViewerProps {
  files: Record<string, SharedFile>;
  onDownload: (id: string) => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({ files, onDownload }) => {
  const { id } = useParams<{ id: string }>();
  const file = id ? files[id] : null;

  if (!file) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 bg-white p-12 rounded-2xl shadow-xl border border-slate-100">
        <div className="bg-red-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">عفواً، الملف غير موجود</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          ربما انتهت صلاحية الرابط أو تم حذفه من قبل صاحب الملف. تأكد من صحة الرابط وحاول مرة أخرى.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold"
        >
          <ArrowRight className="w-5 h-5" />
          الذهاب لرفع ملف جديد
        </Link>
      </div>
    );
  }

  const handleDownload = () => {
    onDownload(file.id);
    
    // Create a temporary link to download
    // If it's a demo link without dataUrl, we show a mock success
    if (file.dataUrl) {
        const link = document.createElement('a');
        link.href = file.dataUrl;
        link.download = file.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('هذا عرض توضيحي للملف. في النسخة الكاملة سيبدأ التحميل الآن.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white text-center">
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl inline-block mb-6">
            <FileText className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold mb-2 break-all">{file.originalName}</h1>
          <p className="text-blue-100">جاهز للتحميل الآمن والسريع</p>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-transform hover:scale-105">
              <div className="flex items-center gap-3 text-blue-600 mb-3">
                <FileText className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">حجم الملف</span>
              </div>
              <p className="text-xl font-bold text-slate-800">{formatSize(file.size)}</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-transform hover:scale-105">
              <div className="flex items-center gap-3 text-blue-600 mb-3">
                <Calendar className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">تاريخ الرفع</span>
              </div>
              <p className="text-xl font-bold text-slate-800">{file.uploadTime.split(' ')[0]}</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-transform hover:scale-105">
              <div className="flex items-center gap-3 text-blue-600 mb-3">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">التنزيلات</span>
              </div>
              <p className="text-xl font-bold text-slate-800">{file.downloadCount} مرة</p>
            </div>
          </div>

          <div className="text-center space-y-6">
            <button 
              onClick={handleDownload}
              className="w-full bg-blue-600 text-white py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all text-2xl font-bold shadow-xl shadow-blue-200"
            >
              <Download className="w-8 h-8" />
              تحميل الملف الآن
            </button>
            
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 text-right">
                <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  إذا واجهت أي مشكلة في التحميل المباشر، يرجى النقر بزر الماوس الأيمن على زر التحميل واختيار "حفظ الرابط باسم" أو التأكد من عدم وجود حظر للنوافذ المنبثقة.
                </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
            <p className="text-slate-400 text-sm mb-4">هل تريد مشاركة ملفاتك الخاصة؟</p>
            <Link to="/" className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-2">
                ابدأ الرفع مجاناً الآن
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </div>
    </div>
  );
};
