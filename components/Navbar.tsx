
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Upload, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-blue-600">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Cloud className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">سحابة شارك</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              location.pathname === '/dashboard' 
              ? 'bg-slate-100 text-blue-600' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">لوحة التحكم</span>
          </Link>
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold ${
              location.pathname === '/' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>رفع ملف</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
