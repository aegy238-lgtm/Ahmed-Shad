
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Trash2, ExternalLink, Clock, HardDrive } from 'lucide-react';
import { SharedFile } from '../types';

interface DashboardProps {
  files: Record<string, SharedFile>;
  onDelete?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ files, onDelete }) => {
  // Fix: Explicitly type fileList as SharedFile[] to ensure TypeScript recognizes properties of SharedFile
  const fileList: SharedFile[] = (Object.values(files) as SharedFile[]).sort((a, b) => 
    new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (fileList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <HardDrive className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">لا توجد ملفات مرفوعة بعد</h2>
        <p className="text-slate-500 mb-8">ابدأ برفع ملفك الأول ليظهر هنا في لوحة التحكم</p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold inline-flex items-center gap-2"
        >
          رفع ملف الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ملفاتي المرفوعة</h1>
          <p className="text-slate-500">إدارة الملفات وتتبع إحصائيات التنزيل</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <span className="text-blue-700 font-bold">{fileList.length}</span>
          <span className="text-blue-600 mr-2">ملفات إجمالاً</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">اسم الملف</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">الحجم</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">التنزيلات</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {fileList.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700 truncate max-w-[200px]" title={file.originalName}>
                        {file.originalName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                    {formatSize(file.size)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {file.uploadTime.split(',')[0]}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <Download className="w-4 h-4 text-blue-500" />
                      {file.downloadCount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <Link 
                        to={`/file/${file.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="عرض صفحة التحميل"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(file.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="حذف الملف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
