import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

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
  const finalFotoUrl = pasFotoPublicUrl || null
  const finalQrUrl = qrCodeUrl || null

  // Deteksi: jika berawalan string "REG-", maka ini masih tiket sementara. Jika tidak, ini nomor resmi INLIS.
  const isNomorAnggotaResmi = registration.ticketNumber && 
                              !String(registration.ticketNumber).toUpperCase().startsWith('REG-') &&
                              String(registration.ticketNumber).toLowerCase() !== 'null';

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
                <View><Text style={styles.noPhotoText}>NO FOTO</Text></View>
              )}
            </View>

            {/* Bagian Data Teks */}
            <View style={styles.infoContainer}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <Text style={styles.value}>
                  {registration.fullname ? registration.fullname.toUpperCase() : ''}
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  {isNomorAnggotaResmi ? 'Nomor Anggota' : 'Nomor Tiket Pendaftaran'}
                </Text>
                <Text style={styles.ticketValue}>{registration.ticketNumber}</Text>
              </View>
            </View>
          </View>

          {/* Bagian QR Code */}
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