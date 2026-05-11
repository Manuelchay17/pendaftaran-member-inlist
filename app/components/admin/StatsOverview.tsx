import React from 'react'

interface StatsOverviewProps {
  counts: {
    total: number
    menunggu: number
    disetujui: number
    ditolak: number
  }
}

export function StatsOverview({ counts }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-900">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Pendaftar</p>
            <h3 className="text-3xl font-bold">{counts.total}</h3>
          </div>
          <span className="text-3xl">👥</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">Menunggu</p>
            <h3 className="text-3xl font-bold">{counts.menunggu}</h3>
          </div>
          <span className="text-3xl">🕒</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-600">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">Disetujui</p>
            <h3 className="text-3xl font-bold">{counts.disetujui}</h3>
          </div>
          <span className="text-3xl">✅</span>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-600">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Ditolak</p>
            <h3 className="text-3xl font-bold">{counts.ditolak}</h3>
          </div>
          <span className="text-3xl">❌</span>
        </div>
      </div>
    </div>
  )
}
