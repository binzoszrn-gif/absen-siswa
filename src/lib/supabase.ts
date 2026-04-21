import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please set them in the Secrets panel.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export type Role = 'admin' | 'guru' | 'tenaga_kependidikan';

export interface UserProfile {
  id: string;
  full_name: string;
  role: Role;
  nip?: string;
  email?: string;
}

export interface Student {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
}

export interface StaffAttendance {
  id: string;
  user_id: string;
  date: string;
  check_in: string;
  check_out?: string;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alpa';
  marked_by: string;
}
