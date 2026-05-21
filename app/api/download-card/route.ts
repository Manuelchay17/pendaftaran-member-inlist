import React from 'react';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { renderToStream } from '@react-pdf/renderer';
import { LibraryCardPDF } from '@/app/components/LibraryCardPDF';
import QRCode from 'qrcode';
import { STATUS_CONFIG } from '@/lib/constants';

/**
 * Fungsi helper untuk mengunduh gambar dari URL eksternal (Hostinger)
 * dan mengkonversinya ke format Base64 Data URL agar dapat digunakan
 * oleh @react-pdf/renderer di sisi server tanpa masalah CORS.
 *
 * Mengembalikan null jika gambar tidak dapat diunduh (misal 404, 403,
 * atau koneksi gagal), sehingga proses pembuatan PDF tetap berjalan
 * tanpa gambar daripada crash seluruhnya.
 */
async function getBase64Image(url: string): Promise<string | null> {
  try {
    console.log('[download-card] Fetching image from:', url);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      console.error(`[download-card] Failed to fetch image. Status: ${res.status} ${res.statusText}. URL: ${url}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    console.log(`[download-card] Image fetched successfully. ContentType: ${contentType}, Size: ${buffer.byteLength} bytes`);
    return `data:${contentType};base64,${base64}`;

  } catch (err: any) {
    console.error('[download-card] Exception fetching image:', err?.message || err);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tiket = searchParams.get('tiket');

    if (!tiket) {
      return NextResponse.json({ error: 'Parameter tiket diperlukan' }, { status: 400 });
    }

    // Cari data pendaftaran berdasarkan nomor tiket via MySQL
    const [rows] = await pool.execute(
      'SELECT * FROM registrations WHERE ticket_no = ?',
      [tiket]
    );
    const registrations = rows as any[];
    const registration = registrations[0];

    if (!registration) {
      return NextResponse.json({ error: 'Data pendaftaran tidak ditemukan' }, { status: 404 });
    }

    if (registration.status !== 'Disetujui') {
      return NextResponse.json({ error: 'Pendaftaran belum disetujui, kartu belum tersedia' }, { status: 403 });
    }

    // 1. Generate QR Code untuk verifikasi online
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || STATUS_CONFIG.SITE_URL_FALLBACK;
    const url = `${baseUrl}/cek-status?tiket=${registration.ticket_no}`;
    const qrCodeData = await QRCode.toDataURL(url, {
      margin: 1,
      width: 150,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#1e3a5f',
        light: '#ffffff',
      }
    });

    // 2. Resolve URL gambar pas foto (Lokal /uploads atau Absolut dari Hostinger)
    let pasFotoPublicUrl = '';
    if (registration.pas_foto_url) {
      const cleanPath = registration.pas_foto_url.trim();
      if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        pasFotoPublicUrl = cleanPath;
      } else {
        const imagePath = cleanPath.startsWith('/uploads/')
          ? cleanPath
          : `/uploads/${cleanPath}`;
        pasFotoPublicUrl = `${baseUrl}${imagePath}`;
      }
    }

    // 3. Konversi gambar ke Base64 agar aman digunakan oleh @react-pdf/renderer di server
    //    Jika gagal, pasFotoBase64 = null → kartu tetap tercetak tanpa foto
    const pasFotoBase64 = pasFotoPublicUrl
      ? await getBase64Image(pasFotoPublicUrl)
      : null;

    // 4. Render PDF ke stream
    const pdfStream = await renderToStream(
      React.createElement(LibraryCardPDF, {
        registration: {
          fullname: registration.fullname,
          ticketNumber: registration.ticket_no
        },
        qrCodeUrl: qrCodeData,
        pasFotoPublicUrl: pasFotoBase64 || ''
      }) as any
    );

    // 5. Return PDF stream dengan header attachment
    const memberNo = registration.ticket_no;

    return new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Kartu_Anggota_${memberNo}.pdf"`
      }
    });

  } catch (error: any) {
    console.error('[download-card] PDF Generation Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat membuat dokumen PDF' }, { status: 500 });
  }
}
