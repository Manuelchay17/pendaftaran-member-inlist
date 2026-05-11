import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Registration, RegistrationStatus } from '@/types'
import { ADMIN_CONFIG } from '@/lib/constants'

export function useRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const fetchRegistrations = useCallback(async () => {
    try {
      setIsLoadingData(true)
      const { data, error } = await supabase
        .from(ADMIN_CONFIG.DB_TABLE)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const mapped = (data || []).map((r: any) => ({
        id: r.id,
        ticketNumber: r.ticket_no,
        fullname: r.fullname,
        identityNo: r.identity_no || '-',
        noHp: r.no_hp || '-',
        email: r.email || '-',
        placeOfBirth: r.place_of_birth || '-',
        dateOfBirth: r.date_of_birth || '-',
        address: r.address || '-',
        kecamatan: r.kecamatan || '-',
        kelurahan: r.kelurahan || '-',
        rt: r.rt || '-',
        rw: r.rw || '-',
        city: r.city || ADMIN_CONFIG.CITY_DEFAULT,
        province: r.province || ADMIN_CONFIG.PROVINCE_DEFAULT,
        sexId: r.sex_id || 0,
        agamaId: r.agama_id || 0,
        maritalStatusId: r.marital_status_id || '-',
        motherMaidenName: r.mother_maiden_name || '-',
        identityTypeId: r.identity_type_id || 0,
        educationLevelId: r.education_level_id || 0,
        jobId: r.job_id || 0,
        institutionName: r.institution_name || '',
        namaDarurat: r.nama_darurat || '-',
        telpDarurat: r.telp_darurat || '-',
        statusHubunganDarurat: r.status_hubungan_darurat || '-',
        pasFotoUrl: r.pas_foto_url || '',
        fotoKtpUrl: r.foto_ktp_url || '',
        registerDate: r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-',
        createdAt: r.created_at || '',
        approvedAt: r.approved_at || null,
        status: (r.status as RegistrationStatus) || 'Menunggu',
        rejectReason: r.reject_reason || '',
      }))

      setRegistrations(mapped)
    } catch (err) {
      console.error('Fetch error:', err)
      setFetchError('Gagal memuat data. Silakan refresh halaman.')
    } finally {
      setIsLoadingData(false)
    }
  }, [])

  const sendNotification = async (payload: any) => {
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Notification failed')
      return await res.json()
    } catch (err) {
      console.error('Notification error:', err)
      throw err
    }
  }

  const handleApprove = async (reg: Registration) => {
    if (reg.email === '-' || !reg.email.includes('@')) {
      throw new Error('Email pendaftar tidak valid, tidak bisa mengirim notifikasi.')
    }

    const { error } = await supabase
      .from(ADMIN_CONFIG.DB_TABLE)
      .update({ 
        status: 'Disetujui',
        approved_at: new Date().toISOString()
      })
      .eq('id', reg.id)

    if (error) throw error

    // Sync local state
    setRegistrations(prev => prev.map(item => 
      item.id === reg.id ? { ...item, status: 'Disetujui', approvedAt: new Date().toISOString() } : item
    ))

    await sendNotification({
      type: 'STATUS_APPROVED',
      email: reg.email,
      fullname: reg.fullname,
      ticketNumber: reg.ticketNumber
    })
  }

  const handleReject = async (reg: Registration, reason: string) => {
    if (reg.email === '-' || !reg.email.includes('@')) {
      throw new Error('Email pendaftar tidak valid, tidak bisa mengirim notifikasi.')
    }

    const { error } = await supabase
      .from(ADMIN_CONFIG.DB_TABLE)
      .update({ 
        status: 'Ditolak',
        reject_reason: reason
      })
      .eq('id', reg.id)

    if (error) throw error

    // Sync local state
    setRegistrations(prev => prev.map(item => 
      item.id === reg.id ? { ...item, status: 'Ditolak', rejectReason: reason } : item
    ))

    await sendNotification({
      type: 'STATUS_REJECTED',
      email: reg.email,
      fullname: reg.fullname,
      ticketNumber: reg.ticketNumber,
      rejectReason: reason
    })
  }

  return {
    registrations,
    isLoadingData,
    fetchError,
    fetchRegistrations,
    handleApprove,
    handleReject,
    sendNotification
  }
}
