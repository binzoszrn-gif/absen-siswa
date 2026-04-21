import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/app');
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login Error:', error);
        throw error;
      }
      
      console.log('Login success, checking profile...');
      navigate('/app');
    } catch (err: any) {
      console.error('Caught error:', err);
      setError(err.message || 'Gagal masuk. Periksa koneksi dan kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-brand rounded-2xl items-center justify-center text-white font-black text-3xl shadow-xl shadow-red-200 mb-6">
            S
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Selamat Datang</h2>
          <p className="text-gray-500 mt-2 font-medium">Masuk untuk mengelola absensi</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-medium"
                  placeholder="admin@smkprimaunggul.sch.id"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand focus:bg-white transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold ring-1 ring-red-100">
                <AlertCircle size={16} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-brand hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-100 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Belum punya akun? Hubungi Admin Sekolah
            </p>
          </div>
        </div>

        <button 
           onClick={() => navigate('/')}
           className="w-full mt-6 text-sm text-gray-500 font-bold hover:text-gray-700 transition-colors"
        >
          &larr; Kembali ke Landing Page
        </button>
      </div>
    </div>
  );
}
