import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import QRCode from 'qrcode'
import { Registration, RegistrationStatus } from '@/types'
import { STATUS_CONFIG } from '@/lib/constants'

export type SearchState = 'idle' | 'loading' | 'not_found' | 'found'

export function useStatusSearch(initialTicket: string = '') {
  const [ticketInput, setTicketInput] = useState(initialTicket)
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const [result, setResult] = useState<Partial<Registration> | null>(null)
  const [qrCodeData, setQrCodeData] = useState('')

  const generateQRCode = useCallback(async (ticketNumber: string) => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || STATUS_CONFIG.SITE_URL_FALLBACK)
      const url = `${baseUrl}/cek-status?tiket=${ticketNumber}`
      const qrData = await QRCode.toDataURL(url, {
        margin: 1,
        width: 150,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#1e3a5f',
          light: '#ffffff',
        }
      })
      setQrCodeData(qrData)
    } catch (err) {
      console.error('QR Error:', err)
    }
  }, [])

  const handleSearch = useCallback(async (tiket?: string) => {
    const ticket = tiket || ticketInput
    if (!ticket) return

    setSearchState('loading')
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('ticket_no', ticket)
      .single()

    if (error || !data) {
      setSearchState('not_found')
      setResult(null)
    } else {
      const r = data as any
      setResult({
        ticketNumber: r.ticket_no,
        fullname: r.fullname,
        status: r.status as RegistrationStatus,
        createdAt: r.created_at,
        approvedAt: r.approved_at,
        rejectReason: r.reject_reason,
        pasFotoUrl: r.pas_foto_url
      })
      setSearchState('found')
    }
  }, [ticketInput])

  return {
    ticketInput,
    setTicketInput,
    searchState,
    result,
    qrCodeData,
    handleSearch,
    generateQRCode
  }
}
