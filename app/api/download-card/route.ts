import React from 'react';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { renderToStream } from '@react-pdf/renderer';
import { LibraryCardPDF } from '@/app/components/LibraryCardPDF';
import QRCode from 'qrcode';
import { STATUS_CONFIG } from '@/lib/constants';

// URL Gambar latar belakang kartu di Hostinger Anda
const BG_CARD_URL = "https://rosybrown-salmon-638703.hostingersite.com/images/BG-Kartu.jpeg";

async function getBase64Image(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    return `data:${contentType};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paramInput = searchParams.get('member_no') || searchParams.get('tiket') || searchParams.get('ticket_no');

    console.log("==================== DEBUG START ====================");
    console.log("[DEBUG 1] Parameter diterima dari Frontend:", paramInput);
    console.log("[DEBUG 1] Eksekusi terjadi pada runtime:", new Date().toLocaleString());

    if (!paramInput) {
      console.log("[DEBUG ERROR] API dihentikan: Parameter kosong.");
      return NextResponse.json({ error: 'Parameter pencarian diperlukan' }, { status: 400 });
    }

    let registration = null;
    const cleanInput = paramInput.trim();

    if (cleanInput.toUpperCase().startsWith('REG-')) {
      console.log("[DEBUG 2] Mendeteksi format TIKET (REG-). Menjalankan query ke kolom ticket_no...");
      const [rows]: any = await pool.execute(
        'SELECT id, ticket_no, member_no, fullname, status, pas_foto_url FROM registrations WHERE ticket_no = ? LIMIT 1',
        [cleanInput.toUpperCase()]
      );
      registration = rows[0];
    } else {
      console.log("[DEBUG 2] Mendeteksi format ANGKA. Menjalankan query ke kolom member_no...");
      const [rows]: any = await pool.execute(
        'SELECT id, ticket_no, member_no, fullname, status, pas_foto_url FROM registrations WHERE member_no = ? LIMIT 1',
        [cleanInput]
      );
      registration = rows[0];
    }

    console.log("[DEBUG 3] Data mentah hasil kueri Database MySQL:");
    console.log(JSON.stringify(registration, null, 2));

    if (!registration) {
      console.log("[DEBUG ERROR] Object registration bernilai NULL / Tidak ditemukan!");
      return NextResponse.json({ error: 'Data pendaftaran tidak ditemukan' }, { status: 404 });
    }

    let nomorAnggotaResmi = '';
    if (
      registration.member_no !== null && 
      registration.member_no !== undefined && 
      String(registration.member_no).trim() !== '' && 
      String(registration.member_no).toLowerCase() !== 'null'
    ) {
      nomorAnggotaResmi = String(registration.member_no).trim();
      console.log("[DEBUG 4] Kondisi terpenuhi. Menggunakan member_no resmi:", nomorAnggotaResmi);
    } else {
      nomorAnggotaResmi = String(registration.ticket_no).trim();
      console.log("[DEBUG 4] member_no kosong/null di DB. Fallback ke ticket_no:", nomorAnggotaResmi);
    }

    console.log("[DEBUG 5] NILAI AKHIR yang dilempar ke komponen PDF:", nomorAnggotaResmi);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || STATUS_CONFIG.SITE_URL_FALLBACK;
    const urlVerifikasi = `${baseUrl}/cek-status?member_no=${nomorAnggotaResmi}`;
    const qrCodeData = await QRCode.toDataURL(urlVerifikasi, { margin: 1, width: 150 });

    // --- PROSES KEDUA GAMBAR UTAMA MENJADI BASE64 DI SISI SERVER (Paling Aman untuk react-pdf) ---
    console.log("[DEBUG 6] Mendownload background kartu & mengubah ke Base64...");
    const backgroundBase64 = await getBase64Image(BG_CARD_URL);
    if (!backgroundBase64) {
      console.log("[DEBUG WARNING] Gagal mengunduh gambar background dari Hostinger!");
    }

    let pasFotoPublicUrl = '';
    if (registration.pas_foto_url) {
      const cleanPath = registration.pas_foto_url.trim();
      pasFotoPublicUrl = cleanPath.startsWith('http') ? cleanPath : `${baseUrl}/uploads/${cleanPath.replace(/^\/?uploads\/?/, '')}`;
    }
    const pasFotoBase64 = pasFotoPublicUrl ? await getBase64Image(pasFotoPublicUrl) : null;
    
    console.log("===================== DEBUG END =====================");

    // Render komponen PDF menjadi stream dengan data base64 yang solid
    const pdfStream = await renderToStream(
      React.createElement(LibraryCardPDF, {
        registration: {
          fullname: registration.fullname,
          ticketNumber: String(nomorAnggotaResmi)
        },
        qrCodeUrl: qrCodeData,
        pasFotoPublicUrl: pasFotoBase64 || '',
        backgroundBase64: backgroundBase64 || '' // Mengirim data background base64
      }) as any
    );

    return new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Kartu_Anggota_${nomorAnggotaResmi}.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      },
    });

  } catch (error: any) {
    console.error('[DEBUG CRITICAL ERROR]:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal' }, { status: 500 });
  }
}