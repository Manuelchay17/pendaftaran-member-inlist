import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// URL Gambar latar belakang dari Hostinger Anda sesuai lokasi di image_5c645c.png
const BG_CARD_URL = "https://rosybrown-salmon-638703.hostingersite.com/images/BG-Kartu.jpeg"

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 450,         // Menyesuaikan rasio landscape template kartu baru
    height: 285,        
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,    // Sedikit lengkungan di pojok kartu
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: 85,    // Memberi ruang agar tidak menabrak header dinas di background
    paddingHorizontal: 20,
  },
  // Box Kanan Atas untuk Status (Pelajar / Umum) & Nomor Anggota Atas
  topRightBadge: {
    position: 'absolute',
    top: 12,
    right: 15,
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Times-Bold', // Menggunakan font serif tegas mirip contoh
    marginBottom: 16,
  },
  topTicketNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.5,
  },
  // Berlaku Hingga di bawah Nomor Anggota Kanan
  expiryContainer: {
    position: 'absolute',
    top: 68,
    right: 25,
    alignItems: 'center',
  },
  expiryLabel: {
    fontSize: 11,
    color: '#000000',
    fontFamily: 'Times-Roman',
  },
  expiryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Times-Roman',
    marginTop: 2,
  },
  // Bagian Utama Tengah (Nama & Barcode/QR)
  mainBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  leftSide: {
    flexDirection: 'column',
    width: '65%',
    marginTop: 15,
  },
  fullname: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Times-Bold', // Font serif sesuai contoh FAKHRIE
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  // Container Barcode / QR Code Utama (Kiri Bawah)
  barcodeContainer: {
    backgroundColor: '#ffffff',
    padding: 6,
    width: 170,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  barcodePlaceholderText: {
    fontSize: 7,
    color: '#000000',
    marginTop: 2,
    fontWeight: 'bold',
  },
  // Pas Foto Kanan Bawah
  photoContainer: {
    width: 90,
    height: 120,
    backgroundColor: '#cbd5e1',
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
    marginRight: 5,
    marginTop: -5,
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noPhotoText: {
    fontSize: 8,
    color: '#475569',
    textAlign: 'center',
    marginTop: 50,
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

  // Deteksi nomor resmi atau tiket sementara
  const isNomorAnggotaResmi = registration.ticketNumber && 
                              !String(registration.ticketNumber).toUpperCase().startsWith('REG-') &&
                              String(registration.ticketNumber).toLowerCase() !== 'null';

  // Hitung masa berlaku (Contoh: 3 tahun dari sekarang jika sudah resmi)
  const getMasaBerlaku = () => {
    if (!isNomorAnggotaResmi) return 'Sementara'
    const date = new Array()
    const d = new Date()
    return `${d.getDate()}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear() + 3}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          
          {/* 1. LAYER BACKGROUND (Mengambil dari Hostinger) */}
          <Image src={BG_CARD_URL} style={styles.backgroundImage} />

          {/* 2. LAYER KONTEN DI ATAS BACKGROUND */}
          <View style={styles.contentContainer}>
            
            {/* Bagian Kanan Atas: Status & Nomor Anggota */}
            <View style={styles.topRightBadge}>
              <Text style={styles.statusText}>Pelajar</Text>
              <Text style={styles.topTicketNumber}>{registration.ticketNumber || '-'}</Text>
            </View>

            {/* Bagian Masa Berlaku Kartu */}
            <View style={styles.expiryContainer}>
              <Text style={styles.expiryLabel}>Berlaku Hingga</Text>
              <Text style={styles.expiryValue}>{getMasaBerlaku()}</Text>
            </View>

            {/* Bagian Tengah: Nama, Barcode/QR, dan Pas Foto */}
            <View style={styles.mainBody}>
              
              {/* Sisi Kiri (Nama Lengkap & Barcode/QR) */}
              <View style={styles.leftSide}>
                <Text style={styles.fullname}>
                  {registration.fullname ? registration.fullname.toUpperCase() : 'NAMA ANGGOTA'}
                </Text>
                
                {/* QR Code diposisikan di kotak putih barcode kiri bawah */}
                <View style={styles.barcodeContainer}>
                  {finalQrUrl ? (
                    <Image src={finalQrUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <Text style={styles.barcodePlaceholderText}>QR CODE / BARCODE</Text>
                  )}
                </View>
              </View>

              {/* Sisi Kanan (Pas Foto) */}
              <View style={styles.photoContainer}>
                {finalFotoUrl ? (
                  <Image src={finalFotoUrl} style={styles.photo} />
                ) : (
                  <Text style={styles.noPhotoText}>NO FOTO</Text>
                )}
              </View>

            </View>

          </View>
        </View>
      </Page>
    </Document>
  )
}