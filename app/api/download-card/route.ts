import React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { renderToStream } from '@react-pdf/renderer';
import { LibraryCardPDF } from '@/app/components/LibraryCardPDF';
import { STATUS_CONFIG } from '@/lib/constants';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ============================================================
// HELPER 1: Membaca file lokal dari folder /public ke Base64
// ============================================================
function getLocalBase64Image(relativePath: string): string | null {
  try {
    const filePath = path.join(process.cwd(), 'public', relativePath);
    if (!fs.existsSync(filePath)) {
      console.error(`[ERROR FS] File template tidak ditemukan di: ${filePath}`);
      return null;
    }
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
    
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  } catch (error) {
    console.error(`[ERROR FS] Gagal membaca file lokal ${relativePath}:`, error);
    return null;
  }
}

// ============================================================
// HELPER 2: Mengunduh foto pendaftar menjadi Base64 string
// ============================================================
async function getBase64ImageFromUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await res.arrayBuffer();
    return `data:${contentType};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
  } catch {
    return null;
  }
}

// ============================================================
// HELPER 3: Mengubah format tanggal (YYYY-MM-DD) -> (DD-MM-YYYY)
// ============================================================
function formatDateIndonesia(dateInput: any): string {
  if (!dateInput || String(dateInput).toLowerCase() === 'null' || String(dateInput).trim() === '') {
    return 'Sementara';
  }

  try {
    let dateStr = '';

    if (dateInput instanceof Date) {
      const yyyy = dateInput.getFullYear();
      const mm = String(dateInput.getMonth() + 1).padStart(2, '0');
      const dd = String(dateInput.getDate()).padStart(2, '0');
      dateStr = `${yyyy}-${mm}-${dd}`;
    } else {
      dateStr = String(dateInput).split('T')[0].trim();
    }

    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [tahun, bulan, tanggal] = parts;
      if (tahun.length === 4) {
        return `${tanggal}-${bulan}-${tahun}`;
      }
    }

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }

    return 'Sementara';
  } catch (err) {
    return 'Sementara';
  }
}

// ============================================================
// MAIN ROUTE: GET — Proses Seleksi Data & Render PDF
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paramInput = searchParams.get('member_no') || searchParams.get('tiket') || searchParams.get('ticket_no');

    if (!paramInput) {
      return NextResponse.json({ error: 'Parameter pencarian diperlukan' }, { status: 400 });
    }

    let registration = null;
    const cleanInput = paramInput.trim();

    if (cleanInput.toUpperCase().startsWith('REG-')) {
      const [rows]: any = await pool.execute(
        `SELECT id, ticket_no, member_no, fullname, status, pas_foto_url, 
                DATE_FORMAT(end_date, '%Y-%m-%d') as end_date_raw 
         FROM registrations WHERE ticket_no = ? LIMIT 1`,
        [cleanInput.toUpperCase()]
      );
      registration = rows[0];
    } else {
      const [rows]: any = await pool.execute(
        `SELECT id, ticket_no, member_no, fullname, status, pas_foto_url, 
                DATE_FORMAT(end_date, '%Y-%m-%d') as end_date_raw 
         FROM registrations WHERE member_no = ? LIMIT 1`,
         [cleanInput]
      );
      registration = rows[0];
    }

    if (!registration) {
      return NextResponse.json({ error: 'Data pendaftaran tidak ditemukan' }, { status: 404 });
    }

    let nomorAnggotaResmi = '';
    if (registration.member_no && String(registration.member_no).toLowerCase() !== 'null') {
      nomorAnggotaResmi = String(registration.member_no).trim();
    } else {
      nomorAnggotaResmi = String(registration.ticket_no).trim();
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || STATUS_CONFIG.SITE_URL_FALLBACK;
    const backgroundBase64 = getLocalBase64Image('images/BG-Kartu.jpeg');

    let pasFotoPublicUrl = '';
    if (registration.pas_foto_url) {
      const cleanPath = registration.pas_foto_url.trim();
      pasFotoPublicUrl = cleanPath.startsWith('http') ? cleanPath : `${baseUrl}/uploads/${cleanPath.replace(/^\/?uploads\/?/, '')}`;
    }
    const pasFotoBase64 = pasFotoPublicUrl ? await getBase64ImageFromUrl(pasFotoPublicUrl) : null;
    const formattedEndDate = formatDateIndonesia(registration.end_date_raw);
    
    // Render PDF Stream langsung dengan melemparkan teks nomor anggota resmi
    const pdfStream = await renderToStream(
      React.createElement(LibraryCardPDF, {
        registration: {
          fullname: registration.fullname,
          ticketNumber: nomorAnggotaResmi,
          endDate: formattedEndDate 
        },
        pasFotoPublicUrl: pasFotoBase64 || '',
        backgroundBase64: backgroundBase64 || '' 
      }) as any
    );

    return new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Kartu_Anggota_${nomorAnggotaResmi}.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    });

  } catch (error: any) {
    console.error('[ERROR API CETAK KARTU]:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal' }, { status: 500 });
  }
}