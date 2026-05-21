import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Tidak ada sesi aktif' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_jwt_key_dispuspa_batang_2026_xyz123');
    const { payload } = await jwtVerify(token, secret);
    
    return NextResponse.json({ user: payload });
  } catch (error) {
    return NextResponse.json({ error: 'Token tidak valid atau kedaluwarsa' }, { status: 401 });
  }
}
