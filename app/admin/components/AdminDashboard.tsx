'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import QRCode from 'qrcode'

import { Registration, RegistrationStatus } from '@/types'
import { ADMIN_CONFIG } from '@/lib/constants'
import { Toast } from '@/app/components/ui/Toast'
import { useRegistrations } from '@/hooks/useRegistrations'
import { StatsOverview } from '@/app/components/admin/StatsOverview'
import { RegistrationTable } from '@/app/components/admin/RegistrationTable'
import { ActionModals } from '@/app/components/admin/ActionModals'

export default function AdminDashboard() {
  const { 
    registrations, 
    isLoadingData, 
    fetchError, 
    fetchRegistrations, 
    handleApprove, 
    handleReject 
  } = useRegistrations()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState('')
  
  const [activeFilter, setActiveFilter] = useState<'Semua'|RegistrationStatus>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReg, setSelectedReg] = useState<Registration|null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [toast, setToast] = useState('')
  const [qrCodeData, setQrCodeData] = useState<string>('')

  useEffect(() => {
    if (isLoggedIn) {
      fetchRegistrations()
    }
  }, [isLoggedIn, fetchRegistrations])

  useEffect(() => {
    if (selectedReg && selectedReg.status === 'Disetujui') {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const verifyUrl = `${baseUrl}/cek-status?tiket=${selectedReg.ticketNumber}`;
      
      QRCode.toDataURL(verifyUrl, { width: 300, margin: 2 })
        .then(url => setQrCodeData(url))
        .catch(err => console.error("QR Error:", err));
    }
  }, [selectedReg]);

  const handleLogin = () => {
    if (loginUser === ADMIN_CONFIG.USERNAME && loginPass === ADMIN_CONFIG.PASSWORD) {
      setIsLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Username atau password salah!')
    }
  }

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    const timer = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(timer)
  }, [])

  const onApprove = async (reg: Registration) => {
    try {
      await handleApprove(reg)
      showToast('✅ Pendaftaran berhasil disetujui!')
      setShowModal(false)
    } catch (err: any) {
      showToast('❌ ' + err.message)
    }
  }

  const onReject = async () => {
    if (!selectedReg || !rejectReason.trim()) return
    try {
      await handleReject(selectedReg, rejectReason)
      showToast('✅ Pendaftaran telah ditolak.')
      setShowRejectForm(false)
      setShowModal(false)
      setRejectReason('')
    } catch (err: any) {
      showToast('❌ ' + err.message)
    }
  }

  const filtered = useMemo(() => registrations.filter(r => {
    const query = searchQuery.toLowerCase()
    const matchFilter = activeFilter === 'Semua' || r.status === activeFilter
    const matchSearch = r.fullname.toLowerCase().includes(query) || r.ticketNumber.toLowerCase().includes(query)
    return matchFilter && matchSearch
  }), [registrations, activeFilter, searchQuery])

  const counts = useMemo(() => ({ 
    total: registrations.length, 
    menunggu: registrations.filter(r=>r.status==='Menunggu').length, 
    disetujui: registrations.filter(r=>r.status==='Disetujui').length, 
    ditolak: registrations.filter(r=>r.status==='Ditolak').length 
  }), [registrations])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const getImageUrl = (path: string, folder: 'pas-foto' | 'foto-ktp') => {
    if (!path) return null;
    const cleanPath = path.trim();
    const finalPath = cleanPath.includes('/') ? cleanPath : `${folder}/${cleanPath}`;
    return `${supabaseUrl}/storage/v1/object/public/${ADMIN_CONFIG.STORAGE_BUCKET}/${finalPath}`;
  };

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm border-t-4" style={{borderColor: '#1e3a5f'}}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{backgroundColor:'#1e3a5f'}}>
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="font-bold text-xl uppercase tracking-tight" style={{color:'#1e3a5f'}}>Login Admin</h1>
          <p className="text-gray-500 text-xs">Dinas Perpustakaan dan Kearsipan Batang</p>
        </div>
        {loginError && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4 border border-red-100">{loginError}</div>}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase mb-1" style={{color:'#1e3a5f'}}>Username</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-900 outline-none" value={loginUser} onChange={e=>setLoginUser(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} placeholder="admin.perpus"/>
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase mb-1" style={{color:'#1e3a5f'}}>Password</label>
          <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-900 outline-none" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} placeholder="••••••••"/>
        </div>
        <button onClick={handleLogin} className="w-full py-2.5 rounded-lg text-white font-bold text-sm transition-opacity hover:opacity-90" style={{backgroundColor:'#1e3a5f'}}>MASUK SISTEM</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <header className="text-white py-6 px-6 shadow-md" style={{backgroundColor:'#1e3a5f'}}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-widest">DASHBOARD ADMIN — PENDAFTARAN ANGGOTA</h1>
              <button onClick={fetchRegistrations} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition ml-2">
                🔄 Refresh
              </button>
            </div>
            <p className="text-sm opacity-80" style={{color:'#c8a84b'}}>Dinas Perpustakaan dan Kearsipan Kabupaten Batang</p>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-xs bg-red-700 hover:bg-red-800 px-4 py-2 rounded font-bold transition-colors">LOGOUT</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {isLoadingData && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Memuat data pendaftaran...</p>
            </div>
          </div>
        )}
        
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-600 text-sm flex items-center gap-2">
            ⚠️ {fetchError}
            <button onClick={fetchRegistrations} className="ml-auto text-xs underline">Coba lagi</button>
          </div>
        )}

        <StatsOverview counts={counts} />

        <RegistrationTable 
          registrations={filtered}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelect={(reg) => {
            setSelectedReg(reg)
            setShowModal(true)
            setShowRejectForm(false)
          }}
        />

        <ActionModals 
          selectedReg={selectedReg}
          onClose={() => {
            setShowModal(false)
            setShowRejectForm(false)
          }}
          onApprove={onApprove}
          onReject={onReject}
          qrCodeData={qrCodeData}
          getImageUrl={getImageUrl}
          showRejectForm={showRejectForm}
          setShowRejectForm={setShowRejectForm}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
        />
      </main>

      {toast && (
        <Toast message={toast} />
      )}
    </div>
  )
}