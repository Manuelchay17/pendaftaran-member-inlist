import React from 'react';
import { RegistrationStatus } from '@/types';

interface StatusBadgeProps {
  status: RegistrationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStyles = (s: RegistrationStatus) => {
    switch (s) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700';
      case 'Disetujui':
        return 'bg-green-100 text-green-700';
      case 'Ditolak':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStyles(status)}`}>
      {status}
    </span>
  );
}
