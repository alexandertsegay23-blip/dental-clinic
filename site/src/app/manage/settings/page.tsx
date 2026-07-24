'use client';

import { useEffect, useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

interface Settings {
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
  site_description: string;
  site_keywords: string;
  tawk_to_property_id: string;
  reminder_enabled: string;
  reminder_sms_enabled: string;
  reminder_whatsapp_enabled: string;
  reminder_hours_before: string;
  reminder_message: string;
  afromessage_api_key: string;
  afromessage_sender_id: string;
  afromessage_identifier_id: string;
  afromessage_base_url: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
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
    site_description: '',
    site_keywords: '',
    tawk_to_property_id: '',
    reminder_enabled: 'false',
    reminder_sms_enabled: 'false',
    reminder_whatsapp_enabled: 'false',
    reminder_hours_before: '24',
    reminder_message: 'Reminder: You have an appointment scheduled with us. Please confirm your attendance.',
    afromessage_api_key: '',
    afromessage_sender_id: '',
    afromessage_identifier_id: '',
    afromessage_base_url: 'https://api.afromessage.com/api',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        // Normalize settings to ensure all fields are strings (not undefined)
        const normalized: Settings = {
          clinic_name: data.settings.clinic_name || '',
          clinic_phone: data.settings.clinic_phone || '',
          clinic_email: data.settings.clinic_email || '',
          clinic_address: data.settings.clinic_address || '',
          clinic_whatsapp: data.settings.clinic_whatsapp || '',
          google_maps_embed_url: data.settings.google_maps_embed_url || '',
          clinic_working_hours: data.settings.clinic_working_hours || '',
          clinic_social_facebook: data.settings.clinic_social_facebook || '',
          clinic_social_instagram: data.settings.clinic_social_instagram || '',
          clinic_social_twitter: data.settings.clinic_social_twitter || '',
          clinic_social_linkedin: data.settings.clinic_social_linkedin || '',
          site_description: data.settings.site_description || '',
          site_keywords: data.settings.site_keywords || '',
          tawk_to_property_id: data.settings.tawk_to_property_id || '',
          reminder_enabled: data.settings.reminder_enabled || 'false',
          reminder_sms_enabled: data.settings.reminder_sms_enabled || 'false',
          reminder_whatsapp_enabled: data.settings.reminder_whatsapp_enabled || 'false',
          reminder_hours_before: data.settings.reminder_hours_before || '24',
          reminder_message: data.settings.reminder_message || 'Reminder: You have an appointment scheduled with us. Please confirm your attendance.',
          afromessage_api_key: data.settings.afromessage_api_key || '',
          afromessage_sender_id: data.settings.afromessage_sender_id || '',
          afromessage_identifier_id: data.settings.afromessage_identifier_id || '',
          afromessage_base_url: data.settings.afromessage_base_url || 'https://api.afromessage.com/api',
        };
        setSettings(normalized);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('Settings saved successfully! Changes will appear on the website after refreshing.');
        // Refresh the page to show updated values
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-text/60">Manage clinic information and site settings</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card-bg rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Clinic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Clinic Name</label>
              <input
                type="text"
                name="clinic_name"
                value={settings.clinic_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Phone</label>
              <input
                type="text"
                name="clinic_phone"
                value={settings.clinic_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                name="clinic_email"
                value={settings.clinic_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">WhatsApp</label>
              <input
                type="text"
                name="clinic_whatsapp"
                value={settings.clinic_whatsapp}
                onChange={handleChange}
                placeholder="+251911234567"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">Address</label>
              <textarea
                name="clinic_address"
                value={settings.clinic_address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">Working Hours (comma-separated)</label>
              <input
                type="text"
                name="clinic_working_hours"
                value={settings.clinic_working_hours}
                onChange={handleChange}
                placeholder="Mon – Fri: 08:00 – 18:00, Sat: 09:00 – 14:00, Sun: Closed"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">Google Maps Embed URL or iframe code</label>
              <textarea
                name="google_maps_embed_url"
                value={settings.google_maps_embed_url}
                onChange={handleChange}
                rows={4}
                placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" loading="lazy"></iframe>'
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-text-muted mt-1">You can paste either the raw Google Maps embed URL or the full iframe embed code from Google Maps.</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-1">Tawk.to Property ID</label>
              <input
                type="text"
                name="tawk_to_property_id"
                value={settings.tawk_to_property_id}
                onChange={handleChange}
                placeholder="e.g. 1234567890abcdef"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-text-muted mt-1">Get your Property ID from your Tawk.to dashboard. Leave empty to disable the chat widget.</p>
            </div>
            <div className="md:col-span-2 border-t border-border pt-4 mt-2">
              <h4 className="text-sm font-semibold text-text mb-3">Appointment Reminders</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reminder_enabled"
                    name="reminder_enabled"
                    checked={settings.reminder_enabled === 'true'}
                    onChange={(e) => setSettings({ ...settings, reminder_enabled: e.target.checked ? 'true' : 'false' })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="reminder_enabled" className="text-sm text-text">Enable Reminders</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reminder_sms_enabled"
                    name="reminder_sms_enabled"
                    checked={settings.reminder_sms_enabled === 'true'}
                    onChange={(e) => setSettings({ ...settings, reminder_sms_enabled: e.target.checked ? 'true' : 'false' })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="reminder_sms_enabled" className="text-sm text-text">Send SMS Reminders</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="reminder_whatsapp_enabled"
                    name="reminder_whatsapp_enabled"
                    checked={settings.reminder_whatsapp_enabled === 'true'}
                    onChange={(e) => setSettings({ ...settings, reminder_whatsapp_enabled: e.target.checked ? 'true' : 'false' })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="reminder_whatsapp_enabled" className="text-sm text-text">Send WhatsApp Reminders</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Hours Before Appointment</label>
                  <input
                    type="number"
                    name="reminder_hours_before"
                    value={settings.reminder_hours_before}
                    onChange={handleChange}
                    min="1"
                    max="168"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text mb-1">Reminder Message</label>
                  <textarea
                    name="reminder_message"
                    value={settings.reminder_message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2 border-t border-border pt-4 mt-2">
                  <h4 className="text-sm font-semibold text-text mb-3">AfroMessage SMS Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text mb-1">AfroMessage API Key</label>
                      <input
                        type="text"
                        name="afromessage_api_key"
                        value={settings.afromessage_api_key}
                        onChange={handleChange}
                        placeholder="Enter your AfroMessage API key"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text mb-1">Sender ID</label>
                      <input
                        type="text"
                        name="afromessage_sender_id"
                        value={settings.afromessage_sender_id}
                        onChange={handleChange}
                        placeholder="e.g. Smile Dental Clinic"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text mb-1">Identifier ID (from AfroMessage)</label>
                      <input
                        type="text"
                        name="afromessage_identifier_id"
                        value={settings.afromessage_identifier_id || ''}
                        onChange={handleChange}
                        placeholder="e.g. e80ad9d8-adf3-463f-80f4-7c4b39f7f164"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text mb-1">API Base URL</label>
                      <input
                        type="text"
                        name="afromessage_base_url"
                        value={settings.afromessage_base_url}
                        onChange={handleChange}
                        placeholder="https://api.afromessage.com"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card-bg rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Site Description</label>
              <textarea
                name="site_description"
                value={settings.site_description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of your clinic for search engines"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Site Keywords</label>
              <input
                type="text"
                name="site_keywords"
                value={settings.site_keywords}
                onChange={handleChange}
                placeholder="dentist, dental clinic, teeth whitening, dental implants"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-card-bg rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Facebook URL</label>
              <input
                type="text"
                name="clinic_social_facebook"
                value={settings.clinic_social_facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Instagram URL</label>
              <input
                type="text"
                name="clinic_social_instagram"
                value={settings.clinic_social_instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Twitter URL</label>
              <input
                type="text"
                name="clinic_social_twitter"
                value={settings.clinic_social_twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">LinkedIn URL</label>
              <input
                type="text"
                name="clinic_social_linkedin"
                value={settings.clinic_social_linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="button"
            onClick={fetchSettings}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-background transition-colors"
          >
            <RefreshCw size={18} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
