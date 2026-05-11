export const ADMIN_CONFIG = {
  USERNAME: 'admin.perpus',
  PASSWORD: 'Dispuspa@2026',
  DB_TABLE: 'registrations',
  STORAGE_BUCKET: 'dokumen-anggota',
  CITY_DEFAULT: 'Batang',
  PROVINCE_DEFAULT: 'Jawa Tengah'
};

export const FORM_CONFIG = {
  TICKET_PREFIX: 'REG-2026-',
  STORAGE_BUCKET: 'dokumen-anggota',
  CITY_DEFAULT: 'Batang',
  PROVINCE_DEFAULT: 'Jawa Tengah'
};

export const STATUS_CONFIG = {
  STORAGE_BUCKET: 'dokumen-anggota',
  SITE_URL_FALLBACK: 'https://pendaftaran-perpus-batang.vercel.app'
};

export const COMMON_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(08|\+628)\d+$/
};

export const STATUS_CATEGORIES = ['Menunggu', 'Disetujui', 'Ditolak'] as const;
