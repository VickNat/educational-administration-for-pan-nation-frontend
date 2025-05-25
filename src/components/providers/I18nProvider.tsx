'use client';

import { PropsWithChildren, useEffect } from 'react';
import i18n from '@/lib/i18n';

export default function I18nProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return <>{children}</>;
} 