import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Fungsi pembantu untuk memvalidasi token dan memastikan dia adalah Super Admin
async function konfigurasiSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_jwt_key_dispuspa_batang_2026_xyz123');
    const { payload } = await jwtVerify(token, secret) as any;

    // Pastikan role-nya adalah superadmin
    if (payload.role !== 'superadmin') return null;

    return payload;
  } catch (error) {
    return null;
  }
}

// 1. [GET] Mengambil seluruh daftar admin/petugas (Untuk Tabel Super Admin)
export async function GET() {
  const adminAktif = await konfigurasiSuperAdmin();
  if (!adminAktif) {
    return NextResponse.json({ error: 'Akses ditolak. Khusus Super Admin.' }, { status: 403 });
  }

  try {
    // Ambil data user, password tidak usah diikutkan demi keamanan
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, is_active, last_login, created_at FROM admin_users ORDER BY id DESC'
    );
    return NextResponse.json({ users: rows });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data pengguna' }, { status: 500 });
  }
}

// 2. [POST] Membuat akun admin/petugas baru
export async function POST(request: Request) {
  const adminAktif = await konfigurasiSuperAdmin();
  if (!adminAktif) {
    return NextResponse.json({ error: 'Akses ditolak. Khusus Super Admin.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi' }, { status: 400 });
    }

    // Cek apakah email sudah terdaftar
    const [existing]: any = await pool.execute('SELECT id FROM admin_users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email/Username sudah digunakan' }, { status: 400 });
    }

    // Hash password baru petugas
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO admin_users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, 1)',
      [name, email, hashedPassword, role]
    );

    return NextResponse.json({ message: 'Akun baru berhasil dibuat' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal membuat akun baru' }, { status: 500 });
  }
}

// 3. [PUT] Memperbarui atau Reset Akun Pengguna Lain
export async function PUT(request: Request) {
  const adminAktif = await konfigurasiSuperAdmin();
  if (!adminAktif) {
    return NextResponse.json({ error: 'Akses ditolak. Khusus Super Admin.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, name, email, password, role, is_active } = body;

    if (!id || !name || !email || !role) {
      return NextResponse.json({ error: 'Data tidak lengkap untuk pembaruan' }, { status: 400 });
    }

    if (password) {
      // Jika superadmin mereset password
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.execute(
        'UPDATE admin_users SET name = ?, email = ?, password = ?, role = ?, is_active = ? WHERE id = ?',
        [name, email, hashedPassword, role, is_active, id]
      );
    } else {
      // Jika mengupdate tanpa ganti password
      await pool.execute(
        'UPDATE admin_users SET name = ?, email = ?, role = ?, is_active = ? WHERE id = ?',
        [name, email, role, is_active, id]
      );
    }

    return NextResponse.json({ message: 'Data pengguna berhasil diperbarui' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal memperbarui data pengguna' }, { status: 500 });
  }
}

// 4. [DELETE] Menghapus akun pengguna
export async function DELETE(request: Request) {
  const adminAktif = await konfigurasiSuperAdmin();
  if (!adminAktif) {
    return NextResponse.json({ error: 'Akses ditolak. Khusus Super Admin.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID Pengguna wajib disertakan' }, { status: 400 });
    }

    // Mencegah Super Admin tidak sengaja menghapus dirinya sendiri
    if (Number(id) === adminAktif.id) {
      return NextResponse.json({ error: 'Anda tidak bisa menghapus akun sendiri!' }, { status: 400 });
    }

    await pool.execute('DELETE FROM admin_users WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Akun berhasil dihapus permanen' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus akun' }, { status: 500 });
  }
}