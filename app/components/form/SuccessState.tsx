import React from 'react'

interface SuccessStateProps {
  ticketNumber: string
  email: string
}

export function SuccessState({ ticketNumber, email }: SuccessStateProps) {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{color:'#1e3a5f'}}>Pendaftaran Berhasil!</h2>
        <p className="text-gray-500 text-sm mb-6">Formulir Anda telah diterima dan sedang diproses petugas.</p>

        <div className="rounded-xl p-5 mb-4" style={{backgroundColor:'#1e3a5f'}}>
          <p className="text-white/70 text-xs mb-1 uppercase tracking-wider">Nomor Tiket Anda</p>
          <p className="text-white text-2xl font-bold tracking-widest mb-3">{ticketNumber}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(ticketNumber)
              alert('Nomor tiket berhasil disalin!')
            }}
            className="text-xs px-4 py-1.5 rounded-lg font-semibold transition hover:opacity-80"
            style={{backgroundColor:'#c8a84b', color:'#1e3a5f'}}>
            📋 Salin Nomor
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-left">
          <p className="text-amber-800 font-bold text-sm mb-1">⚠️ Simpan Nomor Tiket Ini!</p>
          <ul className="text-amber-700 text-xs space-y-1">
            <li>• Untuk mengecek status pendaftaran Anda</li>
            <li>• Untuk komunikasi dengan petugas perpustakaan</li>
            <li>• Untuk mengambil kartu anggota</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
          <p className="text-blue-800 text-xs leading-relaxed">
            Konfirmasi dikirim ke <strong>{email}</strong>.
            Proses verifikasi <strong>1–3 hari kerja</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={`/cek-status?tiket=${ticketNumber}`}
            className="w-full py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition"
            style={{backgroundColor:'#1e3a5f'}}>
            🔍 CEK STATUS PENDAFTARAN
          </a>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl font-bold text-sm border-2 hover:bg-gray-50 transition"
            style={{borderColor:'#1e3a5f', color:'#1e3a5f'}}>
            📝 DAFTAR ANGGOTA BARU
          </button>
        </div>
      </div>
    </div>
  )
}
