import React from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { LibraryCardPDF } from '@/app/components/LibraryCardPDF'
import { Registration } from '@/types'

interface ActionModalsProps {
  selectedReg: Registration | null
  onClose: () => void
  onApprove: (reg: Registration) => void
  onReject: () => void
  qrCodeData: string
  getImageUrl: (path: string, folder: 'pas-foto' | 'foto-ktp') => string | null
  showRejectForm: boolean
  setShowRejectForm: (show: boolean) => void
  rejectReason: string
  setRejectReason: (reason: string) => void
}

export function ActionModals({
  selectedReg,
  onClose,
  onApprove,
  onReject,
  qrCodeData,
  getImageUrl,
  showRejectForm,
  setShowRejectForm,
  rejectReason,
  setRejectReason
}: ActionModalsProps) {
  if (!selectedReg) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-blue-900">Detail Pendaftaran Anggota</h2>
            <p className="text-sm font-mono text-gray-500">{selectedReg.ticketNumber}</p>
          </div>
          <button onClick={onClose} className="text-2xl hover:rotate-90 transition-transform">✕</button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-3 border-b pb-1">Data Pribadi</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500">Nama Lengkap</span> <span className="font-medium">{selectedReg.fullname}</span>
                <span className="text-gray-500">NIK</span> <span className="font-mono">{selectedReg.identityNo}</span>
                <span className="text-gray-500">Tempat, Tgl Lahir</span> <span>{selectedReg.placeOfBirth}, {selectedReg.dateOfBirth}</span>
                <span className="text-gray-500">Jenis Kelamin</span> <span>{selectedReg.sexId === 1 ? 'Laki-laki' : 'Perempuan'}</span>
                <span className="text-gray-500">Alamat</span> <span className="leading-tight">{selectedReg.address}, RT{selectedReg.rt}/RW{selectedReg.rw}, {selectedReg.kelurahan}, {selectedReg.kecamatan}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-3 border-b pb-1">Kontak & Pendidikan</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500">No. HP</span> <span className="font-medium text-green-700">{selectedReg.noHp}</span>
                <span className="text-gray-500">Email</span> <span>{selectedReg.email}</span>
                <span className="text-gray-500">Instansi</span> <span>{selectedReg.institutionName || '-'}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-3 border-b pb-1">Kontak Darurat</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-gray-500">Nama</span> <span>{selectedReg.namaDarurat}</span>
                <span className="text-gray-500">No. Telp</span> <span>{selectedReg.telpDarurat}</span>
                <span className="text-gray-500">Hubungan</span> <span>{selectedReg.statusHubunganDarurat}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-3 border-b pb-1">Berkas Lampiran</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Pas Foto</p>
                  {selectedReg.pasFotoUrl ? (
                    <img
                      src={getImageUrl(selectedReg.pasFotoUrl || '', 'pas-foto') || ''}
                      alt="Pas Foto Anggota"
                      className="w-full rounded-lg border border-gray-200 object-cover aspect-[3/4]"
                    />
                  ) : (
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-4">
                      Foto tidak tersedia
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Foto KTP</p>
                  {selectedReg.fotoKtpUrl ? (
                    <img
                      src={getImageUrl(selectedReg.fotoKtpUrl || '', 'foto-ktp') || ''}
                      alt="Foto KTP Anggota"
                      className="w-full rounded-lg border border-gray-200 object-cover aspect-[3/4]"
                    />
                  ) : (
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-4">
                      Foto tidak tersedia
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedReg.status === 'Ditolak' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-bold text-red-700 uppercase mb-1">Alasan Penolakan:</p>
                <p className="text-sm italic">{selectedReg.rejectReason}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          {selectedReg.status === 'Menunggu' && !showRejectForm && (
            <div className="flex gap-4">
              <button 
                onClick={() => setShowRejectForm(true)}
                className="flex-1 py-3 bg-white border border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
              >
                ✗ TOLAK PENDAFTARAN
              </button>
              <button 
                onClick={() => onApprove(selectedReg)}
                className="flex-2 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 shadow-lg shadow-green-200 transition-colors flex-[2]"
              >
                ✓ SETUJUI & KIRIM KE INLISLITE
              </button>
            </div>
          )}

          {showRejectForm && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <label htmlFor="reject-textarea" className="block text-sm font-bold mb-2">Alasan Penolakan (Wajib diisi):</label>
              <textarea 
                id="reject-textarea"
                className="w-full border-2 border-red-100 rounded-xl p-4 text-sm focus:border-red-400 outline-none mb-4"
                rows={3}
                placeholder="Contoh: Foto KTP tidak terbaca jelas atau data tidak sesuai dokumen..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-3">
                <button onClick={() => setShowRejectForm(false)} className="px-6 py-2 text-sm font-bold text-gray-500">Batal</button>
                <button 
                  onClick={onReject}
                  disabled={!rejectReason.trim()}
                  className={`px-8 py-2 text-sm font-bold text-white rounded-lg transition-all ${!rejectReason.trim() ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  KONFIRMASI TOLAK
                </button>
              </div>
            </div>
          )}

          {selectedReg.status === 'Disetujui' && (
            <div className="mb-4">
              {qrCodeData ? (
                <PDFDownloadLink
                  document={
                    <LibraryCardPDF 
                      registration={{
                        fullname: selectedReg.fullname,
                        ticketNumber: selectedReg.ticketNumber
                      }}
                      qrCodeUrl={qrCodeData}
                      pasFotoPublicUrl={getImageUrl(selectedReg.pasFotoUrl || '', 'pas-foto') || ''}
                    />
                  }
                  fileName={`KARTU-PERPUS-${selectedReg.fullname.toUpperCase().replace(/\s+/g, '-')}.pdf`}
                >
                  {({ loading }) => (
                    <button 
                      disabled={loading}
                      className="w-full py-3 bg-[#1e3a5f] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-lg"
                    >
                      {loading ? 'MENYIAPKAN DOKUMEN...' : '📥 DOWNLOAD KARTU DIGITAL'}
                    </button>
                  )}
                </PDFDownloadLink>
              ) : (
                <div className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  GENERATING QR CODE...
                </div>
              )}
            </div>
          )}

          {selectedReg.status !== 'Menunggu' && (
            <button 
              onClick={onClose}
              className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-xl"
            >
              TUTUP DETAIL
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
