'use client'
import React from 'react'
import { useRegistrationForm } from '@/hooks/useRegistrationForm'
import { SuccessState } from './form/SuccessState'
import { FileUploadSection } from './form/FileUploadSection'
import {
  PersonalDataSection,
  IdentitySection,
  AddressSection,
  ContactSection,
  EducationJobSection,
  EmergencyContactSection
} from './form/FormSections'

export default function RegistrationForm() {
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    ticketNumber,
    pasFotoPreview,
    fotoKtpPreview,
    handleInputChange,
    handleFileChange,
    handleSubmit
  } = useRegistrationForm()

  if (isSuccess) {
    return <SuccessState ticketNumber={ticketNumber} email={formData.email} />
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12">
      <PersonalDataSection 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />
      
      <IdentitySection 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />

      <AddressSection 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />

      <ContactSection 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />

      <EducationJobSection 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />

      <FileUploadSection 
        handleFileChange={handleFileChange}
        pasFotoPreview={pasFotoPreview}
        fotoKtpPreview={fotoKtpPreview}
        errors={errors}
      />

      <EmergencyContactSection 
        formData={formData} 
        handleInputChange={handleInputChange} 
        errors={errors} 
      />

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center justify-center px-8 py-3 rounded-lg text-white font-bold text-lg w-full md:w-auto shadow-lg transition-all ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1e3a5f] hover:bg-blue-900 hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </>
          ) : (
            'KIRIM PENDAFTARAN'
          )}
        </button>
      </div>
    </form>
  )
}
