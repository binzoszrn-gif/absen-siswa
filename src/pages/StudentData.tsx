import React, { useEffect, useState } from 'react';
import { supabase, Student } from '../lib/supabase';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  Loader2, 
  X,
  Check,
  School
} from 'lucide-react';

export default function StudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ id: '', nis: '', nama: '', kelas: 'X TKJ' });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('nama');
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('students')
          .update({ nis: formData.nis, nama: formData.nama, kelas: formData.kelas })
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('students')
          .insert({ nis: formData.nis, nama: formData.nama, kelas: formData.kelas });
        if (error) throw error;
      }
      setIsModalOpen(false);
      setFormData({ id: '', nis: '', nama: '', kelas: 'X TKJ' });
      fetchStudents();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(id: string) {
    if (!confirm('Hapus data siswa ini?')) return;
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  }

  const editStudent = (s: Student) => {
    setFormData({ id: s.id, nis: s.nis, nama: s.nama, kelas: s.kelas });
    setIsModalOpen(true);
  };

  const filtered = students.filter(s => 
    s.nama.toLowerCase().includes(search.toLowerCase()) || 
    s.nis.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Data Siswa</h2>
           <p className="text-gray-500 font-medium mt-1">Kelola daftar siswa SMK Prima Unggul</p>
        </div>
        <button 
           onClick={() => {
             setFormData({ id: '', nis: '', nama: '', kelas: 'X TKJ' });
             setIsModalOpen(true);
           }}
           className="flex items-center gap-2 px-8 py-4 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          Tambah Siswa
        </button>
      </div>

      <div className="relative group">
         <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" />
         <input 
            type="text" 
            placeholder="Cari NIS atau Nama Siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none text-sm font-medium transition-all"
         />
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">NIS</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Nama Lengkap</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Kelas</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium">Memuat data...</td></tr>
               ) : filtered.length === 0 ? (
                 <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium">Belum ada data siswa.</td></tr>
               ) : (
                 filtered.map(s => (
                   <tr key={s.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6 font-mono text-xs font-bold text-gray-500">{s.nis}</td>
                      <td className="px-8 py-6 font-bold text-gray-900 text-sm">{s.nama}</td>
                      <td className="px-8 py-6">
                         <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{s.kelas}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => editStudent(s)}
                              className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100"
                            >
                               <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => deleteStudent(s.id)}
                              className="w-10 h-10 rounded-xl bg-red-50 text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-all shadow-sm shadow-red-100"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
           <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
              >
                 <X size={24} />
              </button>

              <div className="mb-8">
                 <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-brand mb-4">
                    <School size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">{formData.id ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
                 <p className="text-gray-500 font-medium text-sm">Pastikan data yang dimasukkan sudah benar.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Nama Lengkap</label>
                       <input 
                         required
                         type="text" 
                         value={formData.nama}
                         onChange={(e) => setFormData({...formData, nama: e.target.value})}
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-semibold"
                         placeholder="Contoh: Ahmad Subardjo"
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">NIS</label>
                       <input 
                         required
                         type="text" 
                         value={formData.nis}
                         onChange={(e) => setFormData({...formData, nis: e.target.value})}
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-semibold"
                         placeholder="8 digit angka..."
                       />
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Kelas</label>
                       <select 
                         value={formData.kelas}
                         onChange={(e) => setFormData({...formData, kelas: e.target.value})}
                         className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-bold"
                       >
                         <option>X TKJ</option>
                         <option>X DKV</option>
                         <option>XI TKJ</option>
                         <option>XI DKV</option>
                         <option>XII TKJ</option>
                         <option>XII DKV</option>
                       </select>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 px-6 border-2 border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-4 px-6 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-red-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {saving && <Loader2 className="animate-spin" size={18} />}
                      Simpan Data
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
