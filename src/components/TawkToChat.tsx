'use client';

import { useEffect } from 'react';
import { useClinic } from '@/components/ClinicProvider';

export default function TawkToChat() {
  const { settings } = useClinic();
  const propertyId = settings.tawk_to_property_id;

  useEffect(() => {
    if (!propertyId) return;

    // Prevent double injection
    if (document.getElementById('tawk-to-script')) return;

    const script = document.createElement('script');
    script.id = 'tawk-to-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/default`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('tawk-to-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [propertyId]);

  if (!propertyId) return null;

  return null;
}
