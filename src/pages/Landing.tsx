import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, School, Laptop, Camera, Calculator, Radio, Briefcase, BarChart3 } from 'lucide-react';

export default function Landing() {
  const majors = [
    { name: 'TKJ', desc: 'Teknik Komputer & Jaringan', icon: Laptop, color: 'bg-blue-500' },
    { name: 'DKV', desc: 'Desain Komunikasi Visual', icon: Camera, color: 'bg-purple-500' },
    { name: 'AK', desc: 'Akuntansi', icon: Calculator, color: 'bg-green-500' },
    { name: 'BC', desc: 'Broadcasting', icon: Radio, color: 'bg-orange-500' },
    { name: 'MPLB', desc: 'Manajemen Perkantoran', icon: Briefcase, color: 'bg-indigo-500' },
    { name: 'BD', desc: 'Bisnis Digital', icon: BarChart3, color: 'bg-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 h-20 flex items-center px-8 md:px-16 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-200">S</div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900">SMK Prima Unggul</span>
        </div>
        <Link 
          to="/login" 
          className="bg-brand text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-100"
        >
          Masuk ke Aplikasi
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-brand text-xs font-bold mb-6 tracking-wide uppercase">
            Official Attendance System
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
            Digitalisasi Pendidikan Bersama <span className="text-brand">Prima Unggul</span>.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-10">
            Platform absensi terpadu untuk siswa dan tenaga kependidikan SMK Prima Unggul. 
            Membangun kedisiplinan dan transparansi di era digital.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
              Mulai Sekarang <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden group">
                 <img 
                    src="https://picsum.photos/seed/school/800/800" 
                    alt="School Building" 
                    className="w-full h-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                 />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-brand text-white p-8 rounded-3xl shadow-xl max-w-[240px]">
                 <p className="text-sm font-medium opacity-80 mb-2">Terakreditasi A</p>
                 <p className="text-xl font-bold leading-tight">Visi: Menjadi sekolah vokasi unggulan yang berbasis teknologi.</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">Tentang Kami</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                SMK Prima Unggul adalah lembaga pendidikan vokasi yang berfokus pada pengembangan 
                kompetensi teknis dan karakter siswa. Kami percaya setiap siswa memiliki potensi 
                unik yang harus diasah sesuai dengan kebutuhan industri modern.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                  <p className="text-3xl font-black text-brand mb-1">6</p>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Jurusan Unggulan</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                  <p className="text-3xl font-black text-brand mb-1">100%</p>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Digital Record</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Majors */}
      <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Jurusan Kami</h2>
          <p className="text-gray-500">Program keahlian yang tersedia di SMK Prima Unggul</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {majors.map((major) => (
            <div key={major.name} className="p-8 bg-white rounded-[32px] border border-gray-100 hover:border-brand/20 hover:shadow-xl hover:shadow-red-50 transition-all duration-300 group">
              <div className={`w-14 h-14 ${major.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <major.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{major.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{major.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 px-8 text-center text-gray-400 text-sm font-medium">
        &copy; 2024 SMK Prima Unggul. All rights reserved.
      </footer>
    </div>
  );
}
