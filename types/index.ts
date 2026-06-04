export type RegistrationStatus = 'Menunggu' | 'Disetujui' | 'Ditolak';

export interface Registration {
  id: number;
  
  // 🌟 Dual Format untuk data-data krusial pendukung kartu & modal
  ticketNumber?: string;
  ticket_no?: string;
  
  memberNo?: string | null;     
  member_no?: string | null;    
  
  endDate?: string | null;
  end_date?: string | null;
  
  fullname: string;
  
  identityNo?: string;
  identity_no?: string;

  noHp?: string;
  no_hp?: string;

  email: string;

  placeOfBirth?: string;
  place_of_birth?: string;

  dateOfBirth?: string;
  date_of_birth?: string;

  address: string;
  kecamatan: string;
  kelurahan: string;
  rt: string;
  rw: string;
  city: string;
  province: string;

  sexId?: number;
  sex_id?: number;

  agamaId?: number;
  agama_id?: number;

  maritalStatusId?: string;
  marital_status_id?: string;

  pasFotoUrl?: string;
  pas_foto_url?: string;

  fotoKtpUrl?: string;
  foto_ktp_url?: string;

  motherMaidenName?: string;
  mother_maiden_name?: string;

  identityTypeId?: number;
  identity_type_id?: number;

  educationLevelId?: number;
  education_level_id?: number;

  jobId?: number;
  job_id?: number;

  institutionName?: string;
  institution_name?: string;

  namaDarurat?: string;
  nama_darurat?: string;

  telpDarurat?: string;
  telp_darurat?: string;

  statusHubunganDarurat?: string;
  status_hubungan_darurat?: string;

  registerDate?: string;
  created_at?: string;
  createdAt?: string;

  approvedAt?: string | null;
  approved_at?: string | null;
  
  status: RegistrationStatus;
  rejectReason?: string;
  reject_reason?: string;
}

export interface FormData {
  fullname: string;
  placeOfBirth: string;
  dateOfBirth: string;
  sexId: string;
  agamaId: string;
  maritalStatusId: string;
  motherMaidenName: string;
  identityTypeId: string;
  identityNo: string;
  address: string;
  kecamatan: string;
  kelurahan: string;
  rt: string;
  rw: string;
  city: string;
  province: string;
  noHp: string;
  phone: string;
  email: string;
  educationLevelId: string;
  jobId: string;
  institutionName: string;
  namaDarurat: string;
  telpDarurat: string;
  statusHubunganDarurat: string;
}

export interface FormErrors {
  [key: string]: string;
}