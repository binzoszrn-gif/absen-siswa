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

export default function RecapKaryawan() {
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
      const { data: profiles, error: pError } = await supabase.from('profiles').select('*').order('full_name');
      if (pError) throw pError;

      const firstDay = new Date(new Date().getFullYear(), selectedMonth - 1, 1).toISOString();
      const lastDay = new Date(new Date().getFullYear(), selectedMonth, 0).toISOString();

      const { data: att, error: aError } = await supabase
        .from('staff_attendance')
        .select('*')
        .gte('date', firstDay)
        .lte('date', lastDay);
      
      if (aError) throw aError;

      const recap = profiles.map(p => {
        const staffAtt = att.filter(a => a.user_id === p.id);
        return {
          ...p,
          hadir: staffAtt.length,
          // In a real app we'd have hours worked calculation here
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
    d.full_name.toLowerCase().includes(search.toLowerCase()) || 
    d.role.includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Rekap Absensi Karyawan</h2>
           <p className="text-gray-500 font-medium mt-1">Laporan bulanan kehadiran guru & staf</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 hover:scale-105 active:scale-95 transition-all">
          <Download size={20} />
          Ekspor CSV
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
           <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" />
           <input 
              type="text" 
              placeholder="Cari Karyawan..."
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
         <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
               <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Karyawan</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Role</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Total Kehadiran</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium">Memuat rekap...</td></tr>
               ) : (
                 filtered.map(p => (
                   <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                         <p className="text-sm font-bold text-gray-900 mb-0.5">{p.full_name}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.nip || 'Tanpa NIP'}</p>
                      </td>
                      <td className="px-8 py-6 uppercase text-[10px] font-black tracking-widest text-gray-400">
                        {p.role.replace('_', ' ')}
                      </td>
                      <td className="px-8 py-6 text-center text-lg font-black text-gray-900">{p.hadir} Hari</td>
                      <td className="px-8 py-6 text-center">
                         <span className={clsx("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", p.hadir >= 20 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600")}>
                            {p.hadir >= 20 ? 'Sangat Baik' : 'Cukup'}
                         </span>
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
