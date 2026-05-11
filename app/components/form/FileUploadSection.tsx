import React from 'react'

interface FileUploadSectionProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'pasFoto' | 'fotoKtp') => void
  pasFotoPreview: string | null
  fotoKtpPreview: string | null
  errors: Record<string, string>
}

const labelClass = "block text-sm font-semibold text-[#1e3a5f]"

export function FileUploadSection({
  handleFileChange,
  pasFotoPreview,
  fotoKtpPreview,
  errors
}: FileUploadSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-[#1e3a5f] border-b-2 border-[#c8a84b] pb-2 mb-6 inline-block">Upload Dokumen</h3>
      <p className="text-sm text-gray-500 mb-6">Format JPG/PNG, ukuran maksimal 2MB per file.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className={labelClass}>Pas Foto (Formal) <span className="text-red-500">*</span></label>
          <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl ${errors.pasFoto ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#1e3a5f] transition-colors bg-gray-50'}`}>
            <div className="space-y-1 text-center">
              {pasFotoPreview ? (
                <div className="mx-auto w-32 h-40 relative mb-4 shadow-sm border border-gray-200 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pasFotoPreview} alt="Preview Pas Foto" className="object-cover w-full h-full" />
                </div>
              ) : (
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="pasFoto" className="relative cursor-pointer bg-white rounded-md font-medium text-[#1e3a5f] hover:text-blue-800 focus-within:outline-none px-2 py-1">
                  <span>Upload file</span>
                  <input id="pasFoto" name="pasFoto" type="file" accept=".jpg,.jpeg,.png" className="sr-only" onChange={(e) => handleFileChange(e, "pasFoto")} />
                </label>
              </div>
            </div>
          </div>
          {errors.pasFoto && <p className="text-red-500 text-xs mt-2 text-center">{errors.pasFoto}</p>}
        </div>

        <div>
          <label className={labelClass}>Foto Identitas (KTP/KIA/Pelajar) <span className="text-red-500">*</span></label>
          <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl ${errors.fotoKtp ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#1e3a5f] transition-colors bg-gray-50'}`}>
            <div className="space-y-1 text-center w-full">
              {fotoKtpPreview ? (
                <div className="mx-auto w-full max-w-[200px] h-32 relative mb-4 shadow-sm border border-gray-200 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fotoKtpPreview} alt="Preview KTP" className="object-cover w-full h-full" />
                </div>
              ) : (
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="fotoKtp" className="relative cursor-pointer bg-white rounded-md font-medium text-[#1e3a5f] hover:text-blue-800 focus-within:outline-none px-2 py-1">
                  <span>Upload file</span>
                  <input id="fotoKtp" name="fotoKtp" type="file" accept=".jpg,.jpeg,.png" className="sr-only" onChange={(e) => handleFileChange(e, "fotoKtp")} />
                </label>
              </div>
            </div>
          </div>
          {errors.fotoKtp && <p className="text-red-500 text-xs mt-2 text-center">{errors.fotoKtp}</p>}
        </div>
      </div>
    </div>
  )
}
