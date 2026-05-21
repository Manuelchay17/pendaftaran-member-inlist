import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'pas_foto' | 'foto_ktp'
    const ticketNo = formData.get('ticket_no') as string

    if (!file || !type || !ticketNo) {
      return NextResponse.json({ error: 'file, type, dan ticket_no wajib diisi' }, { status: 400 })
    }

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file melebihi 2MB' }, { status: 400 })
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format file harus JPG atau PNG' }, { status: 400 })
    }

    // Buat nama file unik
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${type}_${ticketNo}_${Date.now()}.${ext}`
    const folder = type === 'pas_foto' ? 'pas_foto' : 'foto_ktp'

    // Path upload di Hostinger
    const uploadDir = process.env.UPLOAD_DIR || '/home/u158561617/public_html/uploads'
    const dirPath = path.join(uploadDir, folder)
    const filePath = path.join(dirPath, fileName)

    // Buat folder jika belum ada
    await mkdir(dirPath, { recursive: true })

    // Simpan file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // URL publik file
    const publicUrl = `/uploads/${folder}/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName
    })

  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
