import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  FileText, 
  Search, 
  Download, 
  Calendar,
  Filter 
} from 'lucide-react';
import { clsx } from 'clsx';

export default function RecapSiswa() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchRecap();
  }, [selectedMonth]);

  async function fetchRecap() {
    setLoading(true);
    try {
      // Fetch all students and their attendance for the selected month
      const { data: students, error: sError } = await supabase.from('students').select('*').order('nama');
      if (sError) throw sError;

      const firstDay = new Date(new Date().getFullYear(), selectedMonth - 1, 1).toISOString();
      const lastDay = new Date(new Date().getFullYear(), selectedMonth, 0).toISOString();

      const { data: att, error: aError } = await supabase
        .from('student_attendance')
        .select('*')
        .gte('date', firstDay)
        .lte('date', lastDay);
      
      if (aError) throw aError;

      const recap = students.map(s => {
        const studentAtt = att.filter(a => a.student_id === s.id);
        return {
          ...s,
          hadir: studentAtt.filter(a => a.status === 'hadir').length,
          sakit: studentAtt.filter(a => a.status === 'sakit').length,
          izin: studentAtt.filter(a => a.status === 'izin').length,
          alpa: studentAtt.filter(a => a.status === 'alpa').length,
        };
      });

      setData(recap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = data.filter(d => 
    d.nama.toLowerCase().includes(search.toLowerCase()) || 
    d.nis.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Rekap Absensi Siswa</h2>
           <p className="text-gray-500 font-medium mt-1">Laporan bulanan kehadiran siswa</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 hover:scale-105 active:scale-95 transition-all">
          <Download size={20} />
          Ekspor PDF
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" />
           <input 
              type="text" 
              placeholder="Cari Siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none text-sm font-medium transition-all"
           />
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100">
           <Calendar size={18} className="ml-3 text-gray-400" />
           <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="pr-4 py-2 bg-transparent border-none outline-none text-sm font-bold text-gray-700"
           >
              {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
               <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Siswa</th>
                  <th className="px-4 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Hadir</th>
                  <th className="px-4 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Sakit</th>
                  <th className="px-4 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Izin</th>
                  <th className="px-4 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Alpa</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">% Kehadiran</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr><td colSpan={6} className="px-8 py-10 text-center text-gray-400 font-medium">Memuat rekap...</td></tr>
               ) : (
                 filtered.map(s => {
                    const total = s.hadir + s.sakit + s.izin + s.alpa;
                    const percent = total > 0 ? Math.round((s.hadir / total) * 100) : 0;
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-8 py-6">
                            <div>
                                <p className="text-sm font-bold text-gray-900 mb-0.5">{s.nama}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.nis} • {s.kelas}</p>
                            </div>
                        </td>
                        <td className="px-4 py-6 text-center text-green-600 font-black text-sm">{s.hadir}</td>
                        <td className="px-4 py-6 text-center text-amber-600 font-black text-sm">{s.sakit}</td>
                        <td className="px-4 py-6 text-center text-blue-600 font-black text-sm">{s.izin}</td>
                        <td className="px-4 py-6 text-center text-brand font-black text-sm">{s.alpa}</td>
                        <td className="px-8 py-6 text-center">
                           <div className="flex flex-col items-center gap-1">
                              <span className={clsx("text-xs font-black", percent >= 80 ? "text-green-600" : percent >= 60 ? "text-amber-500" : "text-brand")}>{percent}%</span>
                              <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                 <div className={clsx("h-full rounded-full transition-all duration-500", percent >= 80 ? "bg-green-600" : percent >= 60 ? "bg-amber-500" : "bg-brand")} style={{ width: `${percent}%` }} />
                              </div>
                           </div>
                        </td>
                      </tr>
                    );
                 })
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}
