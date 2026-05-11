import React from 'react'
import Link from 'next/link'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { LibraryCardPDF } from '@/app/components/LibraryCardPDF'
import { ProgressSteps } from '@/app/components/ui/ProgressSteps'
import { Registration } from '@/types'

interface StatusCardProps {
  result: Partial<Registration>
  qrCodeData: string
  getImageUrl: (path: string, folder: 'pas-foto' | 'foto-ktp') => string | null
  formatDate: (iso: string | null | undefined) => string
}

export function StatusCard({ result, qrCodeData, getImageUrl, formatDate }: StatusCardProps) {
  return (
    <>
      {/* MENUNGGU */}
      {result.status === 'Menunggu' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl overflow-hidden shadow-md">
          <div className="bg-yellow-400 px-6 py-4 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-900 bg-yellow-200 px-2 py-0.5 rounded-full">
              Menunggu Verifikasi
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-500">Nama Lengkap</span>
              <span className="font-semibold text-gray-900">{result.fullname}</span>
              <span className="text-gray-500">Nomor Tiket</span>
              <span className="font-mono font-bold" style={{ color: '#1e3a5f' }}>{result.ticketNumber}</span>
              <span className="text-gray-500">Tanggal Daftar</span>
              <span>{formatDate(result.createdAt)}</span>
            </div>
            <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              Pendaftaran Anda sedang dalam proses verifikasi oleh petugas. Estimasi{' '}
              <strong>1–3 hari kerja</strong>.
            </div>
            <ProgressSteps steps={[
              { label: 'Formulir Diterima', state: 'done' },
              { label: 'Sedang Diverifikasi', state: 'active' },
              { label: 'Selesai', state: 'pending' },
            ]} />
          </div>
        </div>
      )}

      {/* DISETUJUI */}
      {result.status === 'Disetujui' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl overflow-hidden shadow-md">
          <div className="bg-green-500 px-6 py-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span className="text-xs font-bold uppercase tracking-widest text-white bg-green-700 px-2 py-0.5 rounded-full">
              Pendaftaran Disetujui
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-500">Nama Lengkap</span>
              <span className="font-semibold text-gray-900">{result.fullname}</span>
              <span className="text-gray-500">Nomor Tiket</span>
              <span className="font-mono font-bold" style={{ color: '#1e3a5f' }}>{result.ticketNumber}</span>
              <span className="text-gray-500">Tanggal Daftar</span>
              <span>{formatDate(result.createdAt)}</span>
              <span className="text-gray-500">Tanggal Disetujui</span>
              <span className="text-green-700 font-medium">{formatDate(result.approvedAt)}</span>
            </div>
            <div className="bg-green-100 border border-green-200 rounded-xl p-4 text-sm text-green-800">
              🎉 <strong>Selamat!</strong> Pendaftaran Anda telah disetujui. Kartu anggota
              perpustakaan Anda sedang disiapkan.
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 flex gap-2">
              <span className="text-base">📬</span>
              <span>
                Kartu anggota akan dikirimkan ke email Anda atau dapat diambil langsung di{' '}
                <strong>Perpustakaan Daerah Kabupaten Batang</strong>.
              </span>
            </div>

            {/* DOWNLOAD BUTTON */}
            <div className="pt-2">
              {qrCodeData ? (
                <PDFDownloadLink
                  document={
                    <LibraryCardPDF 
                      registration={{
                        fullname: result.fullname || '',
                        ticketNumber: result.ticketNumber || ''
                      }}
                      qrCodeUrl={qrCodeData}
                      pasFotoPublicUrl={getImageUrl(result.pasFotoUrl || '', 'pas-foto') || ''}
                    />
                  }
                  fileName={`KARTU-PERPUS-${(result.fullname || 'UNKNOWN').toUpperCase().replace(/\s+/g, '-')}.pdf`}
                >
                  {({ loading }) => (
                    <button 
                      disabled={loading}
                      className="w-full py-4 bg-blue-900 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-lg active:scale-[0.98]"
                      style={{ backgroundColor: '#1e3a5f' }}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          MENYIAPKAN KARTU...
                        </>
                      ) : (
                        <>
                          <span className="text-xl">📥</span>
                          DOWNLOAD KARTU DIGITAL
                        </>
                      )}
                    </button>
                  )}
                </PDFDownloadLink>
              ) : (
                <div className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  MENYIAPKAN DATA...
                </div>
              )}
            </div>
            <ProgressSteps steps={[
              { label: 'Formulir Diterima', state: 'done' },
              { label: 'Terverifikasi', state: 'done' },
              { label: 'Selesai', state: 'done' },
            ]} />
          </div>
        </div>
      )}

      {/* DITOLAK */}
      {result.status === 'Ditolak' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden shadow-md">
          <div className="bg-red-500 px-6 py-4 flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <span className="text-xs font-bold uppercase tracking-widest text-white bg-red-700 px-2 py-0.5 rounded-full">
              Pendaftaran Ditolak
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-500">Nama Lengkap</span>
              <span className="font-semibold text-gray-900">{result.fullname}</span>
              <span className="text-gray-500">Nomor Tiket</span>
              <span className="font-mono font-bold" style={{ color: '#1e3a5f' }}>{result.ticketNumber}</span>
              <span className="text-gray-500">Tanggal Daftar</span>
              <span>{formatDate(result.createdAt)}</span>
            </div>
            {result.rejectReason && (
              <div className="bg-red-100 border border-red-200 rounded-xl p-4 text-sm text-red-800">
                <p className="font-bold mb-1">Alasan Penolakan:</p>
                <p className="italic">{result.rejectReason}</p>
              </div>
            )}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-700">
              ℹ️ Anda dapat mendaftar ulang dengan memperbaiki kekurangan di atas.
            </div>
            <ProgressSteps steps={[
              { label: 'Formulir Diterima', state: 'done' },
              { label: 'Ditolak', state: 'rejected' },
              { label: 'Selesai', state: 'pending' },
            ]} />
            <Link
              href="/"
              className="block w-full text-center py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90 mt-2"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              DAFTAR ULANG
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
