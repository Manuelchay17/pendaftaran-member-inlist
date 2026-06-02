import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Parameter URL diperlukan' }, { status: 400 });
    }

    // =========================================================================
    // 1. PERBAIKAN LOKAL: Pastikan port 8123 tidak hilang & ubah ke IP 127.0.0.1
    // =========================================================================
    if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
      // Jika string URL asli tidak mengandung port :8123, kita sisipkan secara paksa
      if (!targetUrl.includes(':8123')) {
        targetUrl = targetUrl
          .replace('http://localhost/', 'http://127.0.0.1:8123/')
          .replace('http://127.0.0.1/', 'http://127.0.0.1:8123/');
      } else {
        // Jika sudah ada portnya, pastikan tetap pakai IP 127.0.0.1
        targetUrl = targetUrl.replace('http://localhost:8123', 'http://127.0.0.1:8123');
      }
    }

    console.log('[proxy-image] Proxying request untuk:', targetUrl);

    // =========================================================================
    // 2. DISKONEKSI RESTRIKSI NODE.JS UNTUK LOKAL (Mencegah Fetch Failed)
    // =========================================================================
    // Mengizinkan penembakan resource lokal tanpa hambatan SSL/Sertifikat internal Node
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      // Menghindari caching macet di level server-side fetch Next.js
      cache: 'no-store', 
    });

    if (!response.ok) {
      console.error(`[proxy-image] Gagal fetch gambar dari sumber asli. Status: ${response.status}`);
      return NextResponse.json({ error: 'Gagal mengambil gambar dari server sumber' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });

  } catch (error: any) {
    console.error('[proxy-image] Error pada Proxy:', error?.message || error);
    return NextResponse.json({ error: 'Internal Server Error pada sistem Proxy' }, { status: 500 });
  }
}