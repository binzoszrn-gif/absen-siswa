import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';

export default function StaffAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  async function fetchTodayAttendance() {
    try {
      const { data, error } = await supabase
        .from('staff_attendance')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      setAttendance(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn() {
    setActionLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('staff_attendance')
        .insert({
          user_id: user?.id,
          date: today,
          check_in: new Date().toLocaleTimeString('id-ID', { hour12: false })
        })
        .select()
        .single();
      
      if (error) throw error;
      setAttendance(data);
    } catch (err: any) {
      setError(err.message === 'duplicate key value violates unique constraint "staff_attendance_user_id_date_key"' 
        ? 'Anda sudah melakukan absen masuk hari ini.' 
        : 'Gagal melakukan absen masuk.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut() {
    setActionLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('staff_attendance')
        .update({
          check_out: new Date().toLocaleTimeString('id-ID', { hour12: false })
        })
        .eq('id', attendance.id)
        .select()
        .single();
      
      if (error) throw error;
      setAttendance(data);
    } catch (err: any) {
      setError('Gagal melakukan absen keluar.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-brand" size={32} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      <div className="text-center">
         <h2 className="text-3xl font-black text-gray-900 tracking-tight">Absensi Mandiri</h2>
         <p className="text-gray-500 font-medium mt-1">Rekam kehadiran Anda hari ini</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
           <AlertCircle size={18} />
           <p>{error}</p>
        </div>
      )}

      {/* Main Status Card */}
      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
         <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 mb-6">
            <UserCheck size={40} />
         </div>
         
         <div className="space-y-1 mb-8">
            <h3 className="text-2xl font-black text-gray-900">
              {attendance ? (attendance.check_out ? 'Presensi Selesai' : 'Anda Sudah Hadir') : 'Siap Berkerja?'}
            </h3>
            <p className="text-gray-500 font-medium px-4">
               {attendance ? 'Terima kasih atas dedikasi Anda hari ini.' : 'Pastikan Anda sudah berada di lingkungan sekolah.'}
            </p>
         </div>

         <div className="grid grid-cols-2 gap-4 w-full mb-10">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check In</p>
               <p className="text-lg font-black text-gray-900">{attendance?.check_in || '--:--'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check Out</p>
               <p className="text-lg font-black text-gray-900">{attendance?.check_out || '--:--'}</p>
            </div>
         </div>

         {!attendance ? (
           <button
             onClick={handleCheckIn}
             disabled={actionLoading}
             className="w-full py-5 bg-brand text-white rounded-2xl font-bold text-lg shadow-lg shadow-red-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
           >
             {actionLoading ? <Loader2 className="animate-spin" /> : 'Absen Masuk Sekarang'}
           </button>
         ) : !attendance.check_out ? (
           <button
             onClick={handleCheckOut}
             disabled={actionLoading}
             className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-lg shadow-gray-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
           >
             {actionLoading ? <Loader2 className="animate-spin" /> : 'Absen Keluar (Pulang)'}
           </button>
         ) : (
           <div className="w-full py-5 bg-green-50 text-green-600 rounded-2xl font-bold text-lg border border-green-100 flex items-center justify-center gap-3">
              <CheckCircle2 />
              Sudah Absen Hari Ini
           </div>
         )}
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Clock className="text-brand shrink-0" size={24} />
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waktu Sekarang</p>
               <p className="text-sm font-black text-gray-900">{format(new Date(), 'HH:mm')} WIB</p>
            </div>
         </div>
         <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <MapPin className="text-brand shrink-0" size={24} />
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lokasi</p>
               <p className="text-sm font-black text-gray-900">SMK Prima Unggul</p>
            </div>
         </div>
      </div>
    </div>
  );
}
