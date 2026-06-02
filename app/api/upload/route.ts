import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const ticketNo = formData.get('ticket_no') as string;

    if (!file || !type || !ticketNo) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${type}_${ticketNo}_${Date.now()}.${ext}`;
    
    // Tentukan folder berdasarkan tipe upload (pas_foto atau foto_ktp)
    const folder = type === 'pas_foto' ? 'pas_foto' : 'foto_ktp';

    const phpFormData = new FormData();
    phpFormData.append('file', file);
    phpFormData.append('type', folder);
    phpFormData.append('filename', fileName);

    // ============================================================
    // SEKARANG MENEMBAK KE ENDPOINT ONLINE (HOSTINGER)
    // ============================================================
    const phpResponse = await fetch('https://api.pendaftaran-perpus-batang.my.id/upload.php', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer dispuspa-batang-upload-secret-key-2026'
      },
      body: phpFormData
    });

    const data = await phpResponse.json();

    if (!phpResponse.ok) {
      return NextResponse.json({ error: data.error || 'Gagal upload ke Hostinger' }, { status: phpResponse.status });
    }

    // ============================================================
    // Kode manipulasi port lokal (localhost:8123) SUDAH DIHAPUS
    // karena URL yang didapat langsung berupa URL publik Hostinger yang valid
    // ============================================================

    // Mengembalikan URL publik asli dari Hostinger agar bisa tampil di inlist
    return NextResponse.json({ success: true, url: data.url, fileName });

  } catch (err: any) {
    console.error('Upload Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}