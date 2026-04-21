/* 
  RUN THIS IN YOUR SUPABASE SQL EDITOR 
  ------------------------------------
  
  -- 1. Create User Profiles
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'guru', 'tenaga_kependidikan')) DEFAULT 'tenaga_kependidikan',
    nip TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
  );

  -- 2. Create Students Table
  CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nis TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    kelas TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
  );

  -- 3. Create Staff Attendance Table
  CREATE TABLE staff_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    check_in TIME WITH TIME ZONE DEFAULT now() NOT NULL,
    check_out TIME WITH TIME ZONE,
    UNIQUE(user_id, date)
  );

  -- 4. Create Student Attendance Table
  CREATE TABLE student_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students ON DELETE CASCADE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    status TEXT CHECK (status IN ('hadir', 'sakit', 'izin', 'alpa')) NOT NULL,
    marked_by UUID REFERENCES auth.users ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, date)
  );

  -- 5. Enable Row Level Security (RLS)
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE students ENABLE ROW LEVEL SECURITY;
  ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
  ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;

  -- 6. Basic RLS Policies (example: everyone can see students, but only admin can edit)
  CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
  CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "Admins can do everything on profiles." ON profiles FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

  CREATE POLICY "Everyone can see students." ON students FOR SELECT USING (true);
  CREATE POLICY "Only admin and guru can manage students." ON students FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'guru')
  );

  -- Helper to sync auth.users with public.profiles
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger AS $$
  BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
      CASE 
        WHEN (SELECT COUNT(*) FROM auth.users) = 1 THEN 'admin' 
        ELSE 'tenaga_kependidikan' 
      END
    );
    RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
*/
