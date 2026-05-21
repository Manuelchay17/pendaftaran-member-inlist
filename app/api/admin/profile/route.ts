import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: any;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_jwt_key_dispuspa_batang_2026_xyz123');
    const verification = await jwtVerify(token, secret);
    payload = verification.payload;
  } catch (error) {
    return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Nama dan Email wajib diisi' }, { status: 400 });
    }

    // Check if email is taken by another user
    const [existing]: any = await pool.execute('SELECT id FROM admin_users WHERE email = ? AND id != ?', [email, payload.id]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email sudah terdaftar pada pengguna lain' }, { status: 400 });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.execute(
        'UPDATE admin_users SET name = ?, email = ?, password = ? WHERE id = ?',
        [name, email, hashedPassword, payload.id]
      );
    } else {
      await pool.execute(
        'UPDATE admin_users SET name = ?, email = ? WHERE id = ?',
        [name, email, payload.id]
      );
    }

    return NextResponse.json({ message: 'Profil berhasil diperbarui' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_jwt_key_dispuspa_batang_2026_xyz123');
    const { payload } = await jwtVerify(token, secret) as any;

    const [rows]: any = await pool.execute('SELECT id, name, email, role FROM admin_users WHERE id = ?', [payload.id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 });
  }
}
