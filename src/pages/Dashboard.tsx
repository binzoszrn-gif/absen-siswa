import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  School, 
  UserCheck, 
  Clock, 
  Calendar as CalendarIcon,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    staffPresentToday: 0,
    studentsPresentToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const today = new Date().toISOString().split('T')[0];

        const [
          { count: userCount },
          { count: studentCount },
          { count: staffPresent },
          { count: studentsPresent }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('staff_attendance').select('*', { count: 'exact', head: true }).eq('date', today),
          supabase.from('student_attendance').select('*', { count: 'exact', head: true }).eq('date', today).eq('status', 'hadir')
        ]);

        setStats({
          totalUsers: userCount || 0,
          totalStudents: studentCount || 0,
          staffPresentToday: staffPresent || 0,
          studentsPresentToday: studentsPresent || 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Karyawan', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Siswa', value: stats.totalStudents, icon: School, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Karyawan Hadir (Hari Ini)', value: stats.staffPresentToday, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Siswa Hadir (Hari Ini)', value: stats.studentsPresentToday, icon: TrendingUp, color: 'text-brand', bg: 'bg-red-50' },
  ];

  if (loading) return (
    <div className="flex animate-pulse flex-col gap-8">
      <div className="h-32 bg-white rounded-3xl" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <section className="bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Halo, {user?.full_name?.split(' ')[0]}! 👋</h2>
          <p className="text-gray-500 font-medium mt-1">Hari ini adalah {format(new Date(), 'EEEE, dd MMMM yyyy')}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
             <Clock className="text-brand" size={18} />
             <span className="text-sm font-bold text-gray-700">{format(new Date(), 'HH:mm')} WIB</span>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-tight mb-2">{card.name}</p>
            <p className="text-3xl font-black text-gray-900">{card.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions / Role Specific Info */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-[32px] border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <CalendarIcon size={20} className="text-brand" />
                 Pengumuman Sekolah
              </h3>
              <div className="space-y-4">
                 {[1, 2].map(i => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-50 group hover:bg-white hover:border-gray-100 transition-all cursor-pointer">
                       <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                          <AlertTriangle className="text-amber-500" size={20} />
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-brand transition-colors">Persiapan Ujian Tengah Semester</p>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">Mohon kepada seluruh guru untuk segera mengumpukan draf soal melalui portal kurikulum.</p>
                       </div>
                       <ChevronRight size={16} className="text-gray-300 self-center" />
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Info Side */}
        <div className="space-y-6">
           <div className="bg-brand p-8 rounded-[32px] text-white shadow-xl shadow-red-100">
              <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
              <p className="text-sm opacity-80 leading-relaxed mb-6 font-medium">Jika Anda mengalami kendala pada sistem absensi, silakan hubungi tim IT Sekolah.</p>
              <button className="w-full py-3 bg-white text-brand rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all">
                 Hubungi IT Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
