import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    width: 450,
    height: 305, 
    padding: 0,
    margin: 0,
  },
  cardContainer: {
    width: 450,
    height: 305,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 12,       
    paddingHorizontal: 20,
    paddingBottom: 22,    
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 450,
    height: 305,
    zIndex: -1,
  },
  topRightBadge: {
    position: 'absolute',
    top: 10,              
    right: 0, 
    alignItems: 'flex-end',
    width: 180,           
  },
  statusBadgeContainer: {
    backgroundColor: '#000000', 
    paddingVertical: 5,
    paddingHorizontal: 24,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,     
  },
  statusText: {
    fontSize: 16, 
    color: '#ffffff', 
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  // 🌟 UPDATE: Mengecilkan angka di bawah tulisan PELAJAR sesuai Gambar Ref 2
  topTicketNumber: {
    fontSize: 16, 
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    letterSpacing: 0.5,
    marginRight: 25, // Menyeimbangkan posisi ketengahan teks angka
  },
  mainBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 'auto', 
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    width: '63%', 
    paddingBottom: 2,
  },
  fullname: {
    fontSize: 19, 
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  barcodeWrapper: {
    backgroundColor: '#ffffff', 
    width: 255, 
    paddingTop: 6,
    paddingBottom: 5,
    paddingHorizontal: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeImageOnly: {
    width: '100%',
    height: 38, 
    objectFit: 'fill', 
  },
  barcodeValueText: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginTop: 4,
    letterSpacing: 2, 
    textAlign: 'center',
  },
  rightSide: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '33%',
  },
  expiryContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  expiryLabel: {
    fontSize: 13, 
    color: '#000000',
    fontFamily: 'Helvetica',
  },
  expiryValue: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginTop: 2,
  },
  // 🌟 UPDATE: Lebar foto dinaikkan sedikit dari 105 ke 112 agar proporsional
  photoContainer: {
    width: 112,  
    height: 140, 
    backgroundColor: '#cbd5e1',
    borderWidth: 3, 
    borderColor: '#ffffff', 
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noPhotoText: {
    fontSize: 9,
    color: '#475569',
    textAlign: 'center',
    marginTop: 60,
  }
})

export interface LibraryCardPDFProps {
  registration: {
    fullname: string
    ticketNumber: string 
    endDate: string 
  };
  pasFotoPublicUrl: string;
  backgroundBase64: string;
  barcodeBase64?: string
}

export function LibraryCardPDF({ registration, pasFotoPublicUrl, backgroundBase64 }: LibraryCardPDFProps) {
  const finalFotoUrl = pasFotoPublicUrl || null
  
  const liveBarcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(registration.ticketNumber || '')}&scale=4&height=12&includetext=false`;

  const hasValidBg = backgroundBase64 && (
    backgroundBase64.startsWith('data:image') ||
    backgroundBase64.startsWith('http://') ||
    backgroundBase64.startsWith('https://') ||
    backgroundBase64.startsWith('/')
  );

  const hasValidFoto = finalFotoUrl && (
    finalFotoUrl.startsWith('data:image') ||
    finalFotoUrl.startsWith('http://') ||
    finalFotoUrl.startsWith('https://')
  );

  return (
    <Document>
      <Page size={[450, 305]} style={styles.page}>
        <View style={styles.cardContainer}>
          
          {hasValidBg ? (
            <Image src={backgroundBase64} style={styles.backgroundImage} />
          ) : (
            <View style={[styles.backgroundImage, { backgroundColor: '#1e3a8a' }]} />
          )}

          <View style={styles.topRightBadge}>
            <View style={styles.statusBadgeContainer}>
              <Text style={styles.statusText}>Pelajar</Text>
            </View>
            <Text style={styles.topTicketNumber}>{registration.ticketNumber || '-'}</Text>
          </View>

          <View style={styles.mainBody}>
            
            <View style={styles.leftSide}>
              <Text style={styles.fullname}>
                {registration.fullname ? registration.fullname.toUpperCase() : 'NAMA ANGGOTA'}
              </Text>
              
              <View style={styles.barcodeWrapper}>
                <Image src={liveBarcodeUrl} style={styles.barcodeImageOnly} />
                <Text style={styles.barcodeValueText}>{registration.ticketNumber}</Text>
              </View>
            </View>

            <View style={styles.rightSide}>
              <View style={styles.expiryContainer}>
                <Text style={styles.expiryLabel}>Berlaku Hingga</Text>
                <Text style={styles.expiryValue}>{registration.endDate || 'Sementara'}</Text>
              </View>

              <View style={styles.photoContainer}>
                {hasValidFoto ? (
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