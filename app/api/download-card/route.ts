import React from 'react';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderToStream } from '@react-pdf/renderer';
import { LibraryCardPDF } from '@/app/components/LibraryCardPDF';
import QRCode from 'qrcode';
import { STATUS_CONFIG } from '@/lib/constants';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tiket = searchParams.get('tiket');

    if (!tiket) {
      return NextResponse.json({ error: 'Parameter tiket diperlukan' }, { status: 400 });
    }

    // Cari data pendaftaran berdasarkan nomor tiket via Supabase
    const { data: registration, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('ticket_no', tiket)
      .single();

    if (error || !registration) {
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

    // 2. Format URL gambar profil (Supabase Storage)
    let pasFotoPublicUrl = '';
    if (registration.pas_foto_url && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const cleanPath = registration.pas_foto_url.trim();
      const finalPath = cleanPath.includes('/') ? cleanPath : `pas-foto/${cleanPath}`;
      pasFotoPublicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STATUS_CONFIG.STORAGE_BUCKET}/${finalPath}`;
    }

    // 3. Render PDF ke stream
    const pdfStream = await renderToStream(
      React.createElement(LibraryCardPDF, {
        registration: {
          fullname: registration.fullname,
          ticketNumber: registration.ticket_no
        },
        qrCodeUrl: qrCodeData,
        pasFotoPublicUrl: pasFotoPublicUrl
      }) as any
    );

    // 4. Return PDF stream dengan header attachment
    const memberNameClean = registration.fullname.toUpperCase().replace(/\s+/g, '_');
    const memberNo = registration.ticket_no;
    
    return new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Kartu_Anggota_${memberNo}.pdf"`
      }
    });

  } catch (error: any) {
    console.error('Download PDF Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat membuat dokumen PDF' }, { status: 500 });
  }
}
