'use client'

import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useStatusSearch } from '@/hooks/useStatusSearch'
import { STATUS_CONFIG } from '@/lib/constants'
import { StatusCard } from '@/app/components/status/StatusCard'

function CekStatusInner() {
  const searchParams = useSearchParams()
  const {
    ticketInput,
    setTicketInput,
    searchState,
    result,
    qrCodeData,
    handleSearch,
    generateQRCode
  } = useStatusSearch(searchParams.get('tiket')?.toUpperCase() || '')

  // Auto-search jika ada ?tiket= di URL
  useEffect(() => {
    const tiketFromUrl = searchParams.get('tiket')
    if (tiketFromUrl) {
      handleSearch(tiketFromUrl)
    }
  }, [searchParams, handleSearch])

  useEffect(() => {
    if (result && result.status === 'Disetujui' && result.ticketNumber) {
      generateQRCode(result.ticketNumber)
    }
  }, [result, generateQRCode])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const getImageUrl = (path: string, folder: 'pas-foto' | 'foto-ktp') => {
    if (!path) return null;
    const cleanPath = path.trim();
    const finalPath = cleanPath.includes('/') ? cleanPath : `${folder}/${cleanPath}`;
    return `${supabaseUrl}/storage/v1/object/public/${STATUS_CONFIG.STORAGE_BUCKET}/${finalPath}`;
  };

  const formatDate = (iso: string | null | undefined) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <header style={{ backgroundColor: '#1e3a5f' }} className="py-6 md:py-10 px-4 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mb-3">
            <span className="text-3xl md:text-4xl">🔍</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.15em] md:tracking-[0.25em] text-white uppercase leading-tight">
              Cek Status Pendaftaran
            </h1>
          </div>
          <p className="text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wider opacity-90 px-2" style={{ color: '#c8a84b' }}>
            Dinas Perpustakaan dan Kearsipan Kabupaten Batang
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* SEARCH CARD */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <h2 className="text-lg font-bold mb-1" style={{ color: '#1e3a5f' }}>
            Masukkan Nomor Tiket Anda
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            Nomor tiket tercantum di halaman konfirmasi saat mendaftar dan dikirim ke email Anda
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Contoh: REG-2026-12345"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent uppercase tracking-widest"
              style={{ '--tw-ring-color': '#1e3a5f' } as React.CSSProperties}
            />
            <button
              onClick={() => handleSearch()}
              disabled={searchState === 'loading' || !ticketInput.trim()}
              className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 shadow-md"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              CEK STATUS
            </button>
          </div>
        </div>

        {/* Loading */}
        {searchState === 'loading' && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#1e3a5f', borderTopColor: 'transparent' }}
            />
            <p className="text-gray-500 text-sm font-medium">Mencari data...</p>
          </div>
        )}

        {/* Not Found */}
        {searchState === 'not_found' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h3 className="font-bold text-red-700 text-lg mb-2">Nomor Tiket Tidak Ditemukan</h3>
            <p className="text-red-600 text-sm">
              Pastikan nomor tiket yang Anda masukkan sudah benar. Nomor tiket tercantum
              di halaman konfirmasi saat mendaftar.
            </p>
          </div>
        )}

        {/* Found */}
        {searchState === 'found' && result && (
          <StatusCard 
            result={result} 
            qrCodeData={qrCodeData} 
            getImageUrl={getImageUrl} 
            formatDate={formatDate} 
          />
        )}

        {/* BACK LINK */}
        <div className="text-center pt-2 pb-8">
          <Link
            href="/"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: '#1e3a5f' }}
          >
            ← Kembali ke Halaman Pendaftaran
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function CekStatus() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1e3a5f', borderTopColor: 'transparent' }} />
      </div>
    }>
      <CekStatusInner />
    </Suspense>
  )
}
