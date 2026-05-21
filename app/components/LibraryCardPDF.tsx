import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// Definisikan style dengan standar react-pdf
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 400,
    height: 250,
    backgroundColor: '#1e3a5f',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    color: '#ffffff',
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 8,
    color: '#cbd5e1',
    marginBottom: 15,
  },
  body: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'flex-start',
  },
  photoContainer: {
    width: 75,
    height: 100,
    backgroundColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #475569',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noPhotoText: {
    fontSize: 8,
    color: '#94a3b8',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  fieldGroup: {
    marginBottom: 6,
  },
  label: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  ticketValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  qrContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 65,
    height: 65,
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 8,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  }
})

interface LibraryCardPDFProps {
  registration: {
    fullname: string
    ticketNumber: string
  }
  qrCodeUrl: string
  pasFotoPublicUrl: string
}

export function LibraryCardPDF({ registration, qrCodeUrl, pasFotoPublicUrl }: LibraryCardPDFProps) {
  // Ambil URL saat runtime untuk memastikan host lokal terbaca dengan benar oleh react-pdf
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // Validasi URL Pas Foto: Jika menggunakan proxy relatif, tambahkan origin domainnya
  let finalFotoUrl = pasFotoPublicUrl
  if (finalFotoUrl && finalFotoUrl.startsWith('/')) {
    finalFotoUrl = `${baseUrl}${finalFotoUrl}`
  }

  // Validasi URL QR Code
  let finalQrUrl = qrCodeUrl
  if (finalQrUrl && finalQrUrl.startsWith('/')) {
    finalQrUrl = `${baseUrl}${finalQrUrl}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          {/* Header Kartu */}
          <Text style={styles.header}>KARTU ANGGOTA PERPUSTAKAAN</Text>
          <Text style={styles.subHeader}>Dinas Perpustakaan dan Kearsipan Kabupaten Batang</Text>

          {/* Konten Utama */}
          <View style={styles.body}>
            {/* Bagian Pas Foto */}
            <View style={styles.photoContainer}>
              {finalFotoUrl ? (
                <Image src={finalFotoUrl} style={styles.photo} />
              ) : (
                <Text style={styles.noPhotoText}>NO FOTO</Text>
              )}
            </View>

            {/* Bagian Data Teks */}
            <View style={styles.infoContainer}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <Text style={styles.value}>{registration.fullname.toUpperCase()}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nomor Tiket / Anggota</Text>
                <Text style={styles.ticketValue}>{registration.ticketNumber}</Text>
              </View>
            </View>
          </View>

          {/* Bagian QR Code di Pojok Kanan Bawah */}
          {finalQrUrl ? (
            <View style={styles.qrContainer}>
              <Image src={finalQrUrl} style={styles.qrImage} />
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}