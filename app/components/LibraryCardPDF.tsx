import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    width: 450,
    height: 305, 
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
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
    paddingTop: 92,       
    paddingHorizontal: 15,
    paddingBottom: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topRightBadge: {
    position: 'absolute',
    top: 6,               
    right: 15,
    alignItems: 'center',
    width: 140,           
  },
  statusText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Times-Bold',
    marginBottom: 12,     
  },
  topTicketNumber: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    letterSpacing: 0.5,
  },
  expiryContainer: {
    position: 'absolute',
    top: 72,              
    right: 35,
    alignItems: 'center',
  },
  expiryLabel: {
    fontSize: 11,
    color: '#000000',
    fontFamily: 'Helvetica',
  },
  expiryValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginTop: 2,
  },
  mainBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: 150,          
  },
  leftSide: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '63%',
    paddingBottom: 8,     
  },
  fullname: {
    fontSize: 15,
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  barcodeContainer: {
    backgroundColor: '#ffffff',
    padding: 4,
    width: 200,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  photoContainer: {
    width: 95,
    height: 125,
    backgroundColor: '#cbd5e1',
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
    marginBottom: 8,      
    marginRight: 5,
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
    marginTop: 55,
  }
})

interface LibraryCardPDFProps {
  registration: {
    fullname: string
    ticketNumber: string 
  }
  qrCodeUrl: string
  pasFotoPublicUrl: string
  backgroundBase64?: string // <--- Ditambahkan tanda tanya (?) agar menjadi opsional bagi ActionModals
}

export function LibraryCardPDF({ registration, qrCodeUrl, pasFotoPublicUrl, backgroundBase64 }: LibraryCardPDFProps) {
  const finalFotoUrl = pasFotoPublicUrl || null
  const finalQrUrl = qrCodeUrl || null
  
  // Jika backgroundBase64 tidak dikirim atau kosong "", gunakan URL langsung dari Hostinger sebagai cadangan (fallback)
  const finalBgUrl = backgroundBase64 && backgroundBase64.trim() !== "" 
    ? backgroundBase64 
    : "https://rosybrown-salmon-638703.hostingersite.com/images/BG-Kartu.jpeg";

  const isNomorAnggotaResmi = registration.ticketNumber && 
                              !String(registration.ticketNumber).toUpperCase().startsWith('REG-') &&
                              String(registration.ticketNumber).toLowerCase() !== 'null';

  const getMasaBerlaku = () => {
    if (!isNomorAnggotaResmi) return 'Sementara'
    const d = new Date()
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear() + 3}`
  }

  return (
    <Document>
      <Page size={[450, 305]} style={styles.page}>
        <View style={styles.cardContainer}>
          
          {/* Menampilkan gambar background baik berupa Base64 solid maupun URL Fallback */}
          {finalBgUrl && <Image src={finalBgUrl} style={styles.backgroundImage} />}

          <View style={styles.contentContainer}>
            
            <View style={styles.topRightBadge}>
              <Text style={styles.statusText}>Pelajar</Text>
              <Text style={styles.topTicketNumber}>{registration.ticketNumber || '-'}</Text>
            </View>

            <View style={styles.expiryContainer}>
              <Text style={styles.expiryLabel}>Berlaku Hingga</Text>
              <Text style={styles.expiryValue}>{getMasaBerlaku()}</Text>
            </View>

            <View style={styles.mainBody}>
              
              <View style={styles.leftSide}>
                <Text style={styles.fullname}>
                  {registration.fullname ? registration.fullname.toUpperCase() : 'NAMA ANGGOTA'}
                </Text>
                
                <View style={styles.barcodeContainer}>
                  {finalQrUrl ? (
                    <Image src={finalQrUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <Text style={{ fontSize: 7, color: '#000000', fontWeight: 'bold' }}>QR CODE MISSING</Text>
                  )}
                </View>
              </View>

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