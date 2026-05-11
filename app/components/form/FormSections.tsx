import React from 'react'
import { FormData } from '@/types'

interface FormSectionsProps {
  formData: FormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  errors: Record<string, string>
}

const inputClass = (error?: string) => 
  `w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-colors ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
  }`

const labelClass = "block text-sm font-semibold text-[#1e3a5f]"

export function PersonalDataSection({ formData, handleInputChange, errors }: FormSectionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-[#1e3a5f] border-b-2 border-[#c8a84b] pb-2 mb-6 inline-block">Data Pribadi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="fullname" className={labelClass}>Nama Lengkap <span className="text-red-500">*</span></label>
          <input type="text" id="fullname" value={formData.fullname} onChange={handleInputChange} className={inputClass(errors.fullname)} placeholder="Sesuai kartu identitas" />
          {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
        </div>

        <div>
          <label htmlFor="placeOfBirth" className={labelClass}>Tempat Lahir <span className="text-red-500">*</span></label>
          <input type="text" id="placeOfBirth" value={formData.placeOfBirth} onChange={handleInputChange} className={inputClass(errors.placeOfBirth)} />
          {errors.placeOfBirth && <p className="text-red-500 text-xs mt-1">{errors.placeOfBirth}</p>}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className={labelClass}>Tanggal Lahir <span className="text-red-500">*</span></label>
          <input type="date" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className={inputClass(errors.dateOfBirth)} />
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label htmlFor="sexId" className={labelClass}>Jenis Kelamin <span className="text-red-500">*</span></label>
          <select id="sexId" value={formData.sexId} onChange={handleInputChange} className={inputClass(errors.sexId)}>
            <option value="">-- Pilih Jenis Kelamin --</option>
            <option value="1">Laki-laki</option>
            <option value="2">Perempuan</option>
          </select>
          {errors.sexId && <p className="text-red-500 text-xs mt-1">{errors.sexId}</p>}
        </div>

        <div>
          <label htmlFor="agamaId" className={labelClass}>Agama <span className="text-red-500">*</span></label>
          <select id="agamaId" value={formData.agamaId} onChange={handleInputChange} className={inputClass(errors.agamaId)}>
            <option value="">-- Pilih Agama --</option>
            <option value="1">Islam</option>
            <option value="2">Kristen</option>
            <option value="3">Katolik</option>
            <option value="4">Hindu</option>
            <option value="5">Buddha</option>
            <option value="6">Konghucu</option>
          </select>
          {errors.agamaId && <p className="text-red-500 text-xs mt-1">{errors.agamaId}</p>}
        </div>

        <div>
          <label htmlFor="maritalStatusId" className={labelClass}>Status Perkawinan <span className="text-red-500">*</span></label>
          <select id="maritalStatusId" value={formData.maritalStatusId} onChange={handleInputChange} className={inputClass(errors.maritalStatusId)}>
            <option value="">-- Pilih Status --</option>
            <option value="Belum Menikah">Belum Menikah</option>
            <option value="Menikah">Menikah</option>
            <option value="Cerai">Cerai</option>
          </select>
          {errors.maritalStatusId && <p className="text-red-500 text-xs mt-1">{errors.maritalStatusId}</p>}
        </div>

        <div>
          <label htmlFor="motherMaidenName" className={labelClass}>Nama Ibu Kandung <span className="text-red-500">*</span></label>
          <input type="text" id="motherMaidenName" value={formData.motherMaidenName} onChange={handleInputChange} className={inputClass(errors.motherMaidenName)} />
          {errors.motherMaidenName && <p className="text-red-500 text-xs mt-1">{errors.motherMaidenName}</p>}
        </div>
      </div>
    </div>
  )
}

export function IdentitySection({ formData, handleInputChange, errors }: FormSectionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-[#1e3a5f] border-b-2 border-[#c8a84b] pb-2 mb-6 inline-block">Identitas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="identityTypeId" className={labelClass}>Jenis Identitas <span className="text-red-500">*</span></label>
          <select id="identityTypeId" value={formData.identityTypeId} onChange={handleInputChange} className={inputClass(errors.identityTypeId)}>
            <option value="">-- Pilih Identitas --</option>
            <option value="1">KTP</option>
            <option value="2">SIM</option>
            <option value="3">Kartu Pelajar</option>
          </select>
          {errors.identityTypeId && <p className="text-red-500 text-xs mt-1">{errors.identityTypeId}</p>}
        </div>

        <div>
          <label htmlFor="identityNo" className={labelClass}>Nomor Identitas <span className="text-red-500">*</span></label>
          <input type="text" id="identityNo" value={formData.identityNo} onChange={handleInputChange} className={inputClass(errors.identityNo)} placeholder={formData.identityTypeId === "1" ? "16 Digit NIK" : ""} />
          {errors.identityNo && <p className="text-red-500 text-xs mt-1">{errors.identityNo}</p>}
        </div>
      </div>
    </div>
  )
}

export function AddressSection({ formData, handleInputChange, errors }: FormSectionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-[#1e3a5f] border-b-2 border-[#c8a84b] pb-2 mb-6 inline-block">Alamat Sesuai Identitas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="address" className={labelClass}>Alamat Lengkap <span className="text-red-500">*</span></label>
          <textarea id="address" rows={3} value={formData.address} onChange={handleInputChange} className={inputClass(errors.address)} placeholder="Nama jalan, gedung, blok, dll" />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="province" className={labelClass}>Provinsi <span className="text-red-500">*</span></label>
          <input type="text" id="province" value={formData.province} onChange={handleInputChange} className={inputClass(errors.province)} />
          {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
        </div>

        <div>
          <label htmlFor="city" className={labelClass}>Kota/Kabupaten <span className="text-red-500">*</span></label>
          <input type="text" id="city" value={formData.city} onChange={handleInputChange} className={inputClass(errors.city)} />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="kecamatan" className={labelClass}>Kecamatan <span className="text-red-500">*</span></label>
          <input type="text" id="kecamatan" value={formData.kecamatan} onChange={handleInputChange} className={inputClass(errors.kecamatan)} />
          {errors.kecamatan && <p className="text-red-500 text-xs mt-1">{errors.kecamatan}</p>}
        </div>

        <div>
          <label htmlFor="kelurahan" className={labelClass}>Kelurahan/Desa <span className="text-red-500">*</span></label>
          <input type="text" id="kelurahan" value={formData.kelurahan} onChange={handleInputChange} className={inputClass(errors.kelurahan)} />
          {errors.kelurahan && <p className="text-red-500 text-xs mt-1">{errors.kelurahan}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="rt" className={labelClass}>RT <span className="text-red-500">*</span></label>
            <input type="text" id="rt" value={formData.rt} onChange={handleInputChange} className={inputClass(errors.rt)} placeholder="001" maxLength={3} />
            {errors.rt && <p className="text-red-500 text-xs mt-1">{errors.rt}</p>}
          </div>
          <div>
            <label htmlFor="rw" className={labelClass}>RW <span className="text-red-500">*</span></label>
            <input type="text" id="rw" value={formData.rw} onChange={handleInputChange} className={inputClass(errors.rw)} placeholder="001" maxLength={3} />
            {errors.rw && <p className="text-red-500 text-xs mt-1">{errors.rw}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContactSection({ formData, handleInputChange, errors }: FormSectionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-[#1e3a5f] border-b-2 border-[#c8a84b] pb-2 mb-6 inline-block">Informasi Kontak</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="noHp" className={labelClass}>No. HP / WhatsApp <span className="text-red-500">*</span></label>
          <input type="text" id="noHp" value={formData.noHp} onChange={handleInputChange} className={inputClass(errors.noHp)} placeholder="08xxxxxxxxxx" />
          {errors.noHp && <p className="text-red-500 text-xs mt-1">{errors.noHp}</p>}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>No. Telepon Rumah</label>
          <input type="text" id="phone" value={formData.phone} onChange={handleInputChange} className={inputClass(formData.phone)} placeholder="Opsional" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="email" className={labelClass}>Alamat Email <span className="text-red-500">*</span></label>
          <input type="email" id="email" value={formData.email} onChange={handleInputChange} className={inputClass(errors.email)} placeholder="nama@email.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
    </div>
  )
}

export function EducationJobSection({ formData, handleInputChange, errors }: FormSectionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-[#1e3a5f] border-b-2 border-[#c8a84b] pb-2 mb-6 inline-block">Pendidikan & Pekerjaan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="educationLevelId" className={labelClass}>Pendidikan Terakhir <span className="text-red-500">*</span></label>
          <select id="educationLevelId" value={formData.educationLevelId} onChange={handleInputChange} className={inputClass(errors.educationLevelId)}>
            <option value="">-- Pilih Pendidikan --</option>
            <option value="1">SD</option>
            <option value="2">SMP</option>
            <option value="3">SMA/SMK</option>
            <option value="4">D3</option>
            <option value="5">S1</option>
            <option value="6">S2</option>
            <option value="7">S3</option>
          </select>
          {errors.educationLevelId && <p className="text-red-500 text-xs mt-1">{errors.educationLevelId}</p>}
        </div>

        <div>
          <label htmlFor="jobId" className={labelClass}>Pekerjaan <span className="text-red-500">*</span></label>
          <select id="jobId" value={formData.jobId} onChange={handleInputChange} className={inputClass(errors.jobId)}>
            <option value="">-- Pilih Pekerjaan --</option>
            <option value="1">PNS</option>
            <option value="2">TNI/Polri</option>
            <option value="3">Swasta</option>
            <option value="4">Wirausaha</option>
            <option value="5">Pelajar</option>
            <option value="6">Mahasiswa</option>
            <option value="7">Ibu Rumah Tangga</option>
            <option value="8">Lainnya</option>
          </select>
          {errors.jobId && <p className="text-red-500 text-xs mt-1">{errors.jobId}</p>}
        </div>

        {(formData.jobId === "5" || formData.jobId === "6") && (
          <div className="md:col-span-2">
            <label htmlFor="institutionName" className={labelClass}>Nama Instansi/Sekolah <span className="text-red-500">*</span></label>
            <input type="text" id="institutionName" value={formData.institutionName} onChange={handleInputChange} className={inputClass(errors.institutionName)} placeholder="Nama sekolah / universitas" />
            {errors.institutionName && <p className="text-red-500 text-xs mt-1">{errors.institutionName}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export function EmergencyContactSection({ formData, handleInputChange, errors }: FormSectionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
      <h3 className="text-xl font-bold text-[#1e3a5f] border-b-2 border-[#c8a84b] pb-2 mb-6 inline-block">Kontak Darurat</h3>
      <p className="text-sm text-gray-500 mb-6">Orang yang dapat dihubungi dalam keadaan darurat.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="namaDarurat" className={labelClass}>Nama Lengkap <span className="text-red-500">*</span></label>
          <input type="text" id="namaDarurat" value={formData.namaDarurat} onChange={handleInputChange} className={inputClass(errors.namaDarurat)} />
          {errors.namaDarurat && <p className="text-red-500 text-xs mt-1">{errors.namaDarurat}</p>}
        </div>

        <div>
          <label htmlFor="telpDarurat" className={labelClass}>No. Telepon / HP <span className="text-red-500">*</span></label>
          <input type="text" id="telpDarurat" value={formData.telpDarurat} onChange={handleInputChange} className={inputClass(errors.telpDarurat)} />
          {errors.telpDarurat && <p className="text-red-500 text-xs mt-1">{errors.telpDarurat}</p>}
        </div>

        <div>
          <label htmlFor="statusHubunganDarurat" className={labelClass}>Hubungan <span className="text-red-500">*</span></label>
          <select id="statusHubunganDarurat" value={formData.statusHubunganDarurat} onChange={handleInputChange} className={inputClass(errors.statusHubunganDarurat)}>
            <option value="">-- Pilih Hubungan --</option>
            <option value="Orang Tua">Orang Tua</option>
            <option value="Suami-Istri">Suami-Istri</option>
            <option value="Saudara">Saudara</option>
            <option value="Teman">Teman</option>
          </select>
          {errors.statusHubunganDarurat && <p className="text-red-500 text-xs mt-1">{errors.statusHubunganDarurat}</p>}
        </div>
      </div>
    </div>
  )
}
