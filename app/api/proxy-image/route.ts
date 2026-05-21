import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Parameter URL diperlukan' }, { status: 400 });
    }

    console.log('[proxy-image] Proxying request untuk:', targetUrl);

    // Ambil data gambar dari Hostinger melalui server-to-server request
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      console.error(`[proxy-image] Gagal fetch gambar dari sumber asli. Status: ${response.status}`);
      return NextResponse.json({ error: 'Gagal mengambil gambar dari server Hostinger' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();

    // PERBAIKAN DI SINI: Bungkus arrayBuffer ke Buffer agar Next.js mengirimkan binary data yang solid
    const buffer = Buffer.from(arrayBuffer);

    // Kembalikan gambar asli langsung ke browser pendaftar
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
        'Access-Control-Allow-Origin': '*', // Izinkan browser membaca gambar ini secara lokal (Mengatasi CORS)
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });

  } catch (error: any) {
    console.error('[proxy-image] Error pada Proxy:', error?.message || error);
    return NextResponse.json({ error: 'Internal Server Error pada sistem Proxy' }, { status: 500 });
  }
}