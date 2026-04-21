import React, { useEffect, useState } from 'react';
import { supabase, UserProfile, Role } from '../lib/supabase';
import { 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Loader2, 
  X,
  Mail,
  User,
  Info
} from 'lucide-react';

export default function UserManagement() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State (Managing profiles)
  const [formData, setFormData] = useState({ 
    id: '', 
    full_name: '', 
    role: 'tenaga_kependidikan' as Role,
    nip: ''
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: formData.full_name, 
          role: formData.role,
          nip: formData.nip
        })
        .eq('id', formData.id);
      
      if (error) throw error;
      setIsModalOpen(false);
      fetchProfiles();
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui profil.');
    } finally {
      setSaving(false);
    }
  }

  const editProfile = (p: UserProfile) => {
    setFormData({ id: p.id, full_name: p.full_name, role: p.role, nip: p.nip || '' });
    setIsModalOpen(true);
  };

  const filtered = profiles.filter(p => 
    p.full_name.toLowerCase().includes(search.toLowerCase()) || 
    p.role.includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h2>
           <p className="text-gray-500 font-medium mt-1">Kelola peran dan data karyawan SMK Prima Unggul</p>
        </div>
        
        {/* Instruction note */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold ring-1 ring-blue-100 max-w-sm">
           <Info size={16} className="shrink-0" />
           <p>Gunakan Dashboard Supabase untuk menambah user baru (Auth), lalu edit role mereka di sini.</p>
        </div>
      </div>

      <div className="relative group">
         <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand transition-colors" />
         <input 
            type="text" 
            placeholder="Cari Nama atau Role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand outline-none text-sm font-medium transition-all"
         />
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Karyawan</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">NIP</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Role</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium">Memuat data...</td></tr>
               ) : (
                 filtered.map(p => (
                   <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold shrink-0 uppercase">
                               {p.full_name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-gray-900 mb-0.5">{p.full_name}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {p.id.substring(0, 8)}...</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-xs font-bold text-gray-500">{p.nip || '-'}</td>
                      <td className="px-8 py-6">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                           p.role === 'admin' ? 'bg-red-50 text-brand' : 
                           p.role === 'guru' ? 'bg-blue-50 text-blue-600' : 
                           'bg-gray-100 text-gray-600'
                         }`}>
                           {p.role?.replace('_', ' ')}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => editProfile(p)}
                              className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-brand hover:text-white transition-all shadow-sm shadow-gray-50"
                            >
                               <Edit3 size={16} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

      {/* Modal Edit Profile */}
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
                    <ShieldCheck size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">Edit Peran User</h3>
                 <p className="text-gray-500 font-medium text-sm">Sesuaikan hak akses karyawan sistem.</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Nama Lengkap</label>
                    <input 
                      required
                      type="text" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-semibold"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">NIP (Opsional)</label>
                        <input 
                          type="text" 
                          value={formData.nip}
                          onChange={(e) => setFormData({...formData, nip: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-semibold"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Role Aplikasi</label>
                        <select 
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-bold"
                        >
                          <option value="admin">Admin</option>
                          <option value="guru">Guru</option>
                          <option value="tenaga_kependidikan">Tenaga Kependidikan</option>
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
                      Simpan Perubahan
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
