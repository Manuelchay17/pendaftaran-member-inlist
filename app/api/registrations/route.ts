import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// ============================================================
// 1. GET — Ambil Semua Registrations (Untuk Dashboard Admin)
// ============================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const ticketNo = searchParams.get('ticket_no')

    if (ticketNo) {
      const [rows] = await pool.execute(
        `SELECT ticket_no, member_no, end_date, end_date AS endDate, job_id, pas_foto_url, fullname, status, created_at, approved_at, reject_reason 
         FROM registrations WHERE ticket_no = ? LIMIT 1`,
        [ticketNo]
      )
      const data = rows as any[]
      if (!data.length) {
        return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 })
      }
      return NextResponse.json({ data: data[0] })
    }

    // 🌟 FIXED: Mengembalikan kedua format `end_date` dan `end_date AS endDate` 
    // agar kompatibel dengan state modal maupun komponen table di frontend tanpa merusak interface
    const [rows] = await pool.execute(
      `SELECT id, ticket_no, member_no, 
              end_date, 
              end_date AS endDate, 
              fullname, place_of_birth, date_of_birth, address, kecamatan, kelurahan, 
              rt, rw, city, province, identity_type_id, identity_no, education_level_id, sex_id, 
              marital_status_id, job_id, institution_name, mother_maiden_name, email, no_hp, phone, 
              agama_id, nama_darurat, telp_darurat, status_hubungan_darurat, pas_foto_url, foto_ktp_url, 
              status, reject_reason, created_at, updated_at, approved_at, approved_by
       FROM registrations 
       ORDER BY created_at DESC`
    )
    return NextResponse.json({ data: rows })

  } catch (err: any) {
    console.error('GET registrations error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ============================================================
// 2. POST — Simpan Pendaftaran Anggota Baru Online
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      ticket_no, fullname, place_of_birth, date_of_birth,
      address, kecamatan, kelurahan, rt, rw, city, province,
      identity_type_id, identity_no, education_level_id,
      sex_id, marital_status_id, job_id, institution_name,
      mother_maiden_name, email, no_hp, phone, agama_id,
      nama_darurat, telp_darurat, status_hubungan_darurat,
      pas_foto_url, foto_ktp_url
    } = body

    await pool.execute(
      `INSERT INTO registrations (
        ticket_no, fullname, place_of_birth, date_of_birth,
        address, kecamatan, kelurahan, rt, rw, city, province,
        identity_type_id, identity_no, education_level_id,
        sex_id, marital_status_id, job_id, institution_name,
        mother_maiden_name, email, no_hp, phone, agama_id,
        nama_darurat, telp_darurat, status_hubungan_darurat,
        pas_foto_url, foto_ktp_url, status, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu', NOW(), NOW()
      )`,
      [
        ticket_no, fullname, place_of_birth, date_of_birth,
        address, kecamatan, kelurahan, rt, rw, city, province,
        identity_type_id, identity_no, education_level_id,
        sex_id, marital_status_id, job_id, institution_name,
        mother_maiden_name, email, no_hp, phone, agama_id,
        nama_darurat, telp_darurat, status_hubungan_darurat,
        pas_foto_url, foto_ktp_url
      ]
    )

    return NextResponse.json({ success: true, ticket_no })

  } catch (err: any) {
    console.error('POST registration error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ============================================================
// 3. PATCH — Update Status (Approve/Reject) + Radar Debug PHP Bridge
// ============================================================
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, reject_reason } = body

    // 1. Audit Trail: Ambil Identitas Admin dari Cookie JWT
    const token = req.cookies.get('admin_token')?.value;
    let adminIdentity = 'admin.perpus';

    if (token) {
      try {
        const { jwtVerify } = await import('jose');
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_jwt_key_dispuspa_batang_2026_xyz123');
        const { payload } = await jwtVerify(token, secret);
        adminIdentity = (payload.email as string) || (payload.username as string) || adminIdentity;
      } catch (e) {
        console.error('Invalid token for audit trail, using default.');
      }
    }

    let memberNo = null;
    let endDate = null;

    // KONDISI A: JIKA STATUS DISETUJUI
    if (status === 'Disetujui') {
      const [rows]: any = await pool.execute(
        `SELECT * FROM registrations WHERE id = ? LIMIT 1`,
        [id]
      );
      const reg = rows[0];
      if (!reg) {
        return NextResponse.json({ error: 'Data pendaftaran tidak ditemukan' }, { status: 404 });
      }

      // MEMBACA URL BRIDGE DINAMIS DARI .ENV
      let baseUrl = process.env.BRIDGE_URL || 'http://bridge.pendaftaran-perpus-batang.my.id/perpus-bridge.php';
      const BRIDGE_URL = baseUrl.includes('?') ? `${baseUrl}&action=insert-member` : `${baseUrl}?action=insert-member`;

      let tanggalLahirBersih = reg.date_of_birth;
      if (reg.date_of_birth) {
        const d = new Date(reg.date_of_birth);
        if (!isNaN(d.getTime())) {
          tanggalLahirBersih = d.toISOString().split('T')[0];
        }
      }

      const bridgePayload = {
        fullname: reg.fullname,
        identity_no: reg.identity_no,
        place_of_birth: reg.place_of_birth,
        date_of_birth: tanggalLahirBersih,
        address: reg.address,
        kecamatan: reg.kecamatan,
        kelurahan: reg.kelurahan,
        rt: reg.rt,
        rw: reg.rw,
        no_hp: reg.no_hp,
        email: reg.email,
        mother_maiden_name: reg.mother_maiden_name,
        nama_darurat: reg.nama_darurat,
        telp_darurat: reg.telp_darurat,
        status_hubungan_darurat: reg.status_hubungan_darurat,
        institution_name: reg.institution_name,
        photo_url: reg.pas_foto_url,
        jenis_anggota_id: Number(reg.job_id) === 1 ? 1 : 13,
        identity_type_id: reg.identity_type_id || 1,
        education_level_id: reg.education_level_id || 1,
        sex_id: reg.sex_id || 1,
        agama_id: reg.agama_id || 1,
        marital_status_id: reg.marital_status_id,

        Fullname: reg.fullname,
        IdentityNo: reg.identity_no,
        PlaceOfBirth: reg.place_of_birth,
        DateOfBirth: tanggalLahirBersih,
        Address: reg.address,
        PhotoUrl: reg.pas_foto_url,
        Kecamatan: reg.kecamatan,
        Kelurahan: reg.kelurahan,
        RT: reg.rt,
        RW: reg.rw,
        NoHp: reg.no_hp,
        Email: reg.email,
        IdentityType_id: reg.identity_type_id || 1,
        EducationLevel_id: reg.education_level_id || 1,
        Sex_id: reg.sex_id || 1,
        Agama_id: reg.agama_id || 1,
        JenisAnggota_id: Number(reg.job_id) === 1 ? 1 : 13
      };

      console.log("==================================================");
      console.log("DEBUG: TARGET URL BRIDGE:", BRIDGE_URL);
      console.log("==================================================");

      let textData = "";
      let fetchSuccess = false;

      // Percobaan 1: Undici Dispatcher
      try {
        const { Agent } = await import('undici');
        const envAgent = new Agent({ connect: { rejectUnauthorized: false } });

        const bridgeResponse = await fetch(BRIDGE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.BRIDGE_API_KEY || 'dispuspa-batang-secret-2026',
            'bypass-tunnel-reminder': 'true',
            'User-Agent': 'NextJS-PerpusBatang/1.0'
          },
          body: JSON.stringify(bridgePayload),
          // @ts-ignore
          dispatcher: envAgent
        });

        textData = await bridgeResponse.text();
        fetchSuccess = true;
      } catch (err1: any) {
        // Percobaan 2: Vanilla Fetch + Env Flag
        try {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
          const bridgeResponse2 = await fetch(BRIDGE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': process.env.BRIDGE_API_KEY || 'dispuspa-batang-secret-2026',
              'bypass-tunnel-reminder': 'true',
              'User-Agent': 'NextJS-PerpusBatang/1.0'
            },
            body: JSON.stringify(bridgePayload)
          });
          textData = await bridgeResponse2.text();
          fetchSuccess = true;
        } catch (err2: any) {
          console.error("\n🟥🟥🟥🟥🟥 CRITICAL RADAR ERROR PHP BRIDGE 🟥🟥🟥🟥🟥");
          console.error("Pesan Error Singkat:", err2.message);
          console.dir(err2, { depth: null });
          if (err2.cause) {
            console.error("--- PENYEBAB UTAMA (cause) ---");
            console.dir(err2.cause, { depth: null });
          }
          console.error("🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥\n");

          return NextResponse.json({ 
            error: `PHP Bridge Error (Fetch Failed). Diagnosa: ${err2.message}`,
            detail_cause: err2.cause ? err2.cause.message || JSON.stringify(err2.cause) : 'Lihat VS Code.'
          }, { status: 502 });
        }
      }

      if (fetchSuccess) {
        let bridgeData: any;
        try {
          bridgeData = JSON.parse(textData);
        } catch (jsonErr) {
          return NextResponse.json({ error: `Response PHP Bridge bukan JSON valid. Output: ${textData.substring(0, 200)}` }, { status: 502 });
        }

        if (!bridgeData.success) {
          return NextResponse.json({ error: `Bridge error: ${bridgeData.error || 'Unknown error'}` }, { status: 502 });
        }

        memberNo = bridgeData.member_no;
        const rawEndDate = bridgeData.end_date;

        // 🌟 FIXED LOGIC PARSING TANGGAL PHP BRIDGE:
        // Konversi string mentah dari PHP Bridge agar sesuai dengan format DATE/DATETIME MySQL (YYYY-MM-DD)
        let mysqlFormattedDate = null;
        if (rawEndDate) {
          const stringDate = String(rawEndDate).trim();
          
          // Deteksi jika formatnya DD-MM-YYYY (Contoh: 04-06-2027)
          if (stringDate.includes('-') && stringDate.split('-')[0].length === 2) {
            const [dd, mm, yyyy] = stringDate.split('-');
            mysqlFormattedDate = `${yyyy}-${mm}-${dd}`;
          } else {
            // Fallback default JavaScript Date Object Parser
            const d = new Date(stringDate);
            if (!isNaN(d.getTime())) {
              mysqlFormattedDate = d.toISOString().split('T')[0];
            } else {
              mysqlFormattedDate = stringDate; // Skenario terakhir jika format sudah YYYY-MM-DD murni
            }
          }
        }

        const safeMemberNo = String(memberNo).trim();
        const safeEndDate = mysqlFormattedDate; 
        const safeAdmin = String(adminIdentity).trim();
        const safeId = Number(id);

        // 🌟 FIXED: Mengamankan query prepared statement
        const updateSuccessSql = `UPDATE registrations 
                                  SET member_no = ?, 
                                      end_date = ?, 
                                      status = 'Disetujui', 
                                      approved_at = NOW(), 
                                      approved_by = ?, 
                                      updated_at = NOW() 
                                  WHERE id = ?`;

        await pool.execute(updateSuccessSql, [safeMemberNo, safeEndDate, safeAdmin, safeId]);
        
        // Perbarui variable lokal untuk dilempar ke response return JSON
        endDate = safeEndDate;
      }

    } else if (status === 'Ditolak') {
      const updateRejectSql = "UPDATE registrations SET status = 'Ditolak', reject_reason = ?, approved_by = ?, updated_at = NOW() WHERE id = ?";
      await pool.execute(updateRejectSql, [
        reject_reason || 'Persyaratan tidak sesuai',
        String(adminIdentity),
        Number(id)
      ]);
    }

    return NextResponse.json({
      success: true,
      member_no: memberNo,
      end_date: endDate, // Nilai sudah berformat YYYY-MM-DD bersih
      message: 'Proses pembaruan status registrasi berhasil disinkronisasi',
    });

  } catch (err: any) {
    console.error('PATCH registration error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}