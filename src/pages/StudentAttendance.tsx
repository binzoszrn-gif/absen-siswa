import React, { useEffect, useState } from 'react';
import { supabase, Student } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  Calendar,
  Save,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'hadir' | 'sakit' | 'izin' | 'alpa'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [kelas, setKelas] = useState('Semua Kelas');
  const [markedCount, setMarkedCount] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchStudents();
    fetchTodayAttendance();
  }, [kelas]);

  async function fetchStudents() {
    setLoading(true);
    try {
      let query = supabase.from('students').select('*').order('nama');
      if (kelas !== 'Semua Kelas') {
        query = query.eq('kelas', kelas);
      }
      const { data, error } = await query;
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTodayAttendance() {
    try {
      const { data, error } = await supabase
        .from('student_attendance')
        .select('*')
        .eq('date', today);
      
      if (error) throw error;
      
      const attMap: Record<string, any> = {};
      data?.forEach(att => {
        attMap[att.student_id] = att.status;
      });
      setAttendance(attMap);
      setMarkedCount(data?.length || 0);
    } catch (err) {
      console.error(err);
    }
  }

  const markAttendance = (stdId: string, status: 'hadir' | 'sakit' | 'izin' | 'alpa') => {
    setAttendance(prev => ({ ...prev, [stdId]: status }));
  };

  async function saveAttendance() {
    setSaving(true);
    try {
      const upserts = Object.entries(attendance).map(([student_id, status]) => ({
        student_id,
        status,
        date: today,
        marked_by: user?.id
      }));

      const { error } = await supabase
        .from('student_attendance')
        .upsert(upserts, { onConflict: 'student_id,date' });

      if (error) throw error;
      setMarkedCount(Object.keys(attendance).length);
      alert('Berhasil menyimpan absensi hari ini!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan absensi.');
    } finally {
      setSaving(false);
    }
  }

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(search.toLowerCase()) || 
    s.nis.includes(search)
  );

  const stats = [
    { label: 'Hadir', count: Object.values(attendance).filter(v => v === 'hadir').length, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Sakit', count: Object.values(attendance).filter(v => v === 'sakit').length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Izin', count: Object.values(attendance).filter(v => v === 'izin').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Alpa', count: Object.values(attendance).filter(v => v === 'alpa').length, color: 'text-brand', bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Absensi Siswa</h2>
           <p className="text-gray-500 font-medium mt-1">Hari ini: {today}</p>
        </div>
        <button 
          onClick={saveAttendance}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Simpan Absensi
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={clsx("p-4 rounded-2xl border border-gray-100 flex items-center justify-between", s.bg)}>
            <span className={clsx("text-xs font-bold uppercase tracking-widest", s.color)}>{s.label}</span>
            <span className={clsx("text-xl font-black", s.color)}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" />
           <input 
              type="text" 
              placeholder="Cari NIS atau Nama Siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none text-sm font-medium transition-all"
           />
        </div>
        <select 
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-brand outline-none transition-all"
        >
          <option>Semua Kelas</option>
          <hr />
          <option>X TKJ</option>
          <option>X DKV</option>
          <option>XI TKJ</option>
          <option>XI DKV</option>
          <option>XII TKJ</option>
          <option>XII DKV</option>
        </select>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Siswa</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Status Kehadiran</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr>
                    <td colSpan={2} className="px-8 py-10 text-center text-gray-400 font-medium">Mohon tunggu...</td>
                 </tr>
               ) : filteredStudents.length === 0 ? (
                 <tr>
                    <td colSpan={2} className="px-8 py-10 text-center text-gray-400 font-medium tracking-tight">Tidak ada siswa ditemukan.</td>
                 </tr>
               ) : (
                 filteredStudents.map(student => (
                   <tr key={student.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold shrink-0 uppercase">
                               {student.nama.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-gray-900 mb-0.5">{student.nama}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{student.nis} • {student.kelas}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-center gap-2">
                            {[
                              { id: 'hadir', label: 'H' },
                              { id: 'sakit', label: 'S' },
                              { id: 'izin', label: 'I' },
                              { id: 'alpa', label: 'A' },
                            ].map(btn => (
                              <button
                                key={btn.id}
                                onClick={() => markAttendance(student.id, btn.id as any)}
                                className={clsx(
                                  "w-10 h-10 rounded-xl font-black text-xs transition-all duration-200 border-2",
                                  attendance[student.id] === btn.id
                                    ? {
                                      'hadir': 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100',
                                      'sakit': 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100',
                                      'izin': 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-100',
                                      'alpa': 'bg-brand border-brand text-white shadow-lg shadow-red-100',
                                    }[btn.id as string]
                                    : "bg-white border-gray-100 text-gray-300 hover:border-gray-300 hover:text-gray-500"
                                )}
                              >
                                {btn.label}
                              </button>
                            ))}
                         </div>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
