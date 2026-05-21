import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'pas_foto' | 'foto_ktp'
    const ticketNo = formData.get('ticket_no') as string;

    // 1. Validasi Inputan Awal di sisi Next.js (Vercel)
    if (!file || !type || !ticketNo) {
      return NextResponse.json({ error: 'file, type, dan ticket_no wajib diisi' }, { status: 400 });
    }

    // 2. Validasi Ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file melebihi 2MB' }, { status: 400 });
    }

    // 3. Validasi Tipe Berkas File
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format file harus JPG atau PNG' }, { status: 400 });
    }

    // 4. Buat Nama File Unik Berdasarkan Aturan Asli Proyek Kamu
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${type}_${ticketNo}_${Date.now()}.${ext}`;
    const folder = type === 'pas_foto' ? 'pas_foto' : 'foto_ktp';

    // 5. Bungkus kembali datanya ke FormData baru untuk diteruskan ke PHP Hostinger
    const phpFormData = new FormData();
    phpFormData.append('file', file);
    phpFormData.append('type', folder);         // Mengirim 'pas_foto' atau 'foto_ktp'
    phpFormData.append('filename', fileName);   // Mengirim nama file unik buatan Next.js ke PHP

    // 6. Lempar file-nya menembak script upload.php di Hostinger
    const phpResponse = await fetch('https://api-repo.pendaftaran-perpus-batang.my.id/upload.php', {
      method: 'POST',
      headers: {
        'X-UPLOAD-SECRET': 'dispuspa-batang-upload-secret-key-2026' // Kunci otentikasi rahasia internal
      },
      body: phpFormData
    });

    // Jika server Hostinger menolak request/down
    if (!phpResponse.ok) {
      const errorText = await phpResponse.text();
      console.error('PHP Upload Error:', errorText);
      return NextResponse.json({ error: 'Gagal melakukan upload ke server repositori utama' }, { status: phpResponse.status });
    }

    const data = await phpResponse.json();

    // Jika script PHP mengembalikan error validasi internal
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    // 7. Kembalikan response sukses beserta URL publik absolut gambar Hostinger ke Frontend
    return NextResponse.json({
      success: true,
      url: data.url, // Menggunakan URL absolut dari Hostinger (misal: https://pendaftaran-perpus-batang.my.id/uploads/...)
      fileName: fileName
    });

  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}