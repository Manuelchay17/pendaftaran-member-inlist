import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Tidak ada sesi aktif' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_jwt_key_dispuspa_batang_2026_xyz123');
    const { payload } = await jwtVerify(token, secret);
    
    const { newPassword } = await request.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.execute('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, payload.id as number]);

    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengganti password' }, { status: 500 });
  }
}
