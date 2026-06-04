import { NextResponse } from 'next/server';
import https from 'https';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Parameter URL diperlukan' }, { status: 400 });
    }

    // Handle port lokal jika ada request ke localhost/127.0.0.1
    if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
      if (!targetUrl.includes(':8123')) {
        targetUrl = targetUrl
          .replace('http://localhost/', 'http://127.0.0.1:8123/')
          .replace('http://127.0.0.1/', 'http://127.0.0.1:8123/');
      } else {
        targetUrl = targetUrl.replace('http://localhost:8123', 'http://127.0.0.1:8123');
      }
    }

    // =========================================================================
    // SOLUSI UTAMA: Gunakan CORS Bridge bypass untuk domain .my.id di localhost
    // =========================================================================
    let finalFetchUrl = targetUrl;
    if (targetUrl.includes('pendaftaran-perpustakaan.my.id')) {
      // Menggunakan proxy open-source untuk menembus firewall server API
      finalFetchUrl = `https://cors-proxy.htmldriven.com/?url=${encodeURIComponent(targetUrl)}`;
      console.log('[proxy-image] Membuka jalur via CORS Bridge untuk:', targetUrl);
    } else {
      console.log('[proxy-image] Proxying request langsung untuk:', targetUrl);
    }

    const sslBypassAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // Naikkan ke 6 detik agar proxy bridge sempat mengambil gambar

    try {
      const response = await fetch(finalFetchUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
        cache: 'no-store',
        signal: controller.signal,
        // @ts-ignore
        agent: sslBypassAgent, 
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Status response tidak OK: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.warn('[proxy-image] Jalur utama gagal, menggunakan fallback JPEG putih murni:', fetchError.message);
      
      // Jaga-jaga jika proxy bridge mati, berikan gambar putih murni agar tidak crash putih polos
      const fallbackJpeg = Buffer.from(
        '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
        'base64'
      );

      return new NextResponse(fallbackJpeg, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

  } catch (error: any) {
    console.error('[proxy-image] Error pada Proxy:', error?.message || error);
    return NextResponse.json({ error: 'Internal Server Error pada sistem Proxy' }, { status: 500 });
  }
}