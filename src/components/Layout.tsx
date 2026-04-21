import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ClipboardList, 
  Settings, 
  LogOut,
  ChevronRight,
  School
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/app', 
      icon: LayoutDashboard,
      roles: ['admin', 'guru', 'tenaga_kependidikan']
    },
    { 
      name: 'Absensi Karyawan', 
      path: '/app/absensi-karyawan', 
      icon: UserCheck,
      roles: ['admin', 'guru', 'tenaga_kependidikan']
    },
    { 
      name: 'Absensi Siswa', 
      path: '/app/absensi-siswa', 
      icon: ClipboardList,
      roles: ['admin', 'guru']
    },
    { 
      name: 'Data Siswa', 
      path: '/app/data-siswa', 
      icon: School,
      roles: ['admin']
    },
    { 
      name: 'User Management', 
      path: '/app/user-management', 
      icon: Settings,
      roles: ['admin']
    },
  ];

  const recapItems = [
    {
      name: 'Rekap Karyawan',
      path: '/app/rekap-karyawan',
      roles: ['admin']
    },
    {
      name: 'Rekap Siswa',
      path: '/app/rekap-siswa',
      roles: ['admin', 'guru']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role || ''));
  const filteredRecapItems = recapItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-50">
          <Link to="/app" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-200">
              S
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-none">Absensi</h1>
              <p className="text-xs text-gray-400 mt-1">SMK Prima Unggul</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                location.pathname === item.path
                  ? "bg-brand text-white shadow-md shadow-red-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-brand"
              )}
            >
              <item.icon size={18} className={clsx(location.pathname === item.path ? "text-white" : "text-gray-400 group-hover:text-brand")} />
              {item.name}
            </Link>
          ))}

          {filteredRecapItems.length > 0 && (
            <div className="pt-4">
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recap Submenu</p>
              {filteredRecapItems.map((item) => (
                 <Link
                 key={item.path}
                 to={item.path}
                 className={cn(
                   "flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 group text-sm font-medium",
                   location.pathname === item.path
                     ? "text-brand bg-red-50"
                     : "text-gray-500 hover:text-brand"
                 )}
               >
                 <span className="flex items-center gap-3">
                   <ChevronRight size={14} className={clsx(location.pathname === item.path ? "text-brand" : "text-gray-300 group-hover:text-brand")} />
                   {item.name}
                 </span>
               </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-gray-50">
           <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-900">{user?.full_name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-end px-8 z-10">
          <button 
            onClick={signOut}
            className="flex items-center gap-2 text-gray-500 hover:text-brand transition-colors text-sm font-semibold"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
