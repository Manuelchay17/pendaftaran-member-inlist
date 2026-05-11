import React from 'react'
import { Registration, RegistrationStatus } from '@/types'
import { StatusBadge } from '@/app/components/ui/StatusBadge'

interface RegistrationTableProps {
  registrations: Registration[]
  activeFilter: 'Semua' | RegistrationStatus
  setActiveFilter: (filter: 'Semua' | RegistrationStatus) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSelect: (reg: Registration) => void
}

export function RegistrationTable({
  registrations,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  onSelect
}: RegistrationTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          {['Semua', 'Menunggu', 'Disetujui', 'Ditolak'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as 'Semua' | RegistrationStatus)}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${activeFilter === f ? 'bg-white shadow-sm text-blue-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Cari nama atau nomor tiket..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 opacity-30">🔍</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Nomor Tiket</th>
              <th className="px-6 py-4">Nama Lengkap</th>
              <th className="px-6 py-4">NIK</th>
              <th className="px-6 py-4">Tanggal Daftar</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {registrations.length > 0 ? (
              registrations.map((reg, idx) => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-mono">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-blue-900">{reg.ticketNumber}</td>
                  <td className="px-6 py-4 font-medium">{reg.fullname}</td>
                  <td className="px-6 py-4 text-gray-500">{reg.identityNo}</td>
                  <td className="px-6 py-4 text-gray-500">{reg.registerDate}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={reg.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onSelect(reg)}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      LIHAT DETAIL
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-gray-400 italic">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
