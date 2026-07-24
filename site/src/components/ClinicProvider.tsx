'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ClinicSettings {
  clinic_name: string;
  clinic_phone: string;
  clinic_email: string;
  clinic_address: string;
  clinic_whatsapp: string;
  google_maps_embed_url: string;
  clinic_working_hours: string;
  clinic_social_facebook: string;
  clinic_social_instagram: string;
  clinic_social_twitter: string;
  clinic_social_linkedin: string;
  [key: string]: string;
}

interface ClinicContextType {
  settings: ClinicSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: ClinicSettings = {
  clinic_name: '',
  clinic_phone: '',
  clinic_email: '',
  clinic_address: '',
  clinic_whatsapp: '',
  google_maps_embed_url: '',
  clinic_working_hours: '',
  clinic_social_facebook: '',
  clinic_social_instagram: '',
  clinic_social_twitter: '',
  clinic_social_linkedin: '',
  tawk_to_property_id: '',
  reminder_enabled: 'false',
  reminder_sms_enabled: 'false',
  reminder_whatsapp_enabled: 'false',
  reminder_hours_before: '24',
  reminder_message: 'Reminder: You have an appointment scheduled with us. Please confirm your attendance.',
  afromessage_api_key: '',
  afromessage_sender_id: '',
  afromessage_base_url: 'https://api.afromessage.com',
};

const ClinicContext = createContext<ClinicContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ClinicSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (error) {
      console.error('Failed to fetch clinic settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    setLoading(true);
    await fetchSettings();
  };

  return (
    <ClinicContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  return useContext(ClinicContext);
}
