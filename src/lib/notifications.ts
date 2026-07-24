import { getSettings } from './repository';

export async function sendSMS(phone: string, message: string, settingsMap?: Record<string, string>): Promise<boolean> {
  try {
    if (!settingsMap) {
      const settings = await getSettings();
      settingsMap = {};
      settings.forEach((s: any) => {
        settingsMap![s.key] = s.value;
      });
    }

    const apiKey = settingsMap.afromessage_api_key;
    const senderId = settingsMap.afromessage_sender_id;
    const baseUrl = settingsMap.afromessage_base_url || 'https://api.afromessage.com/api';
    const identifierId = settingsMap.afromessage_identifier_id;

    if (!apiKey || !senderId) {
      console.log('[SMS] Skipped - AfroMessage not configured');
      return false;
    }

    // Clean phone number: remove +, convert Ethiopian 0 prefix to 251
    const cleanPhone = phone.replace(/\+/g, '').replace(/^0/, '251');

    const response = await fetch(`${baseUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: cleanPhone,
        message: message,
        senderId: senderId,
        ...(identifierId ? { identifierId } : {}),
      }),
    });

    const result = await response.json();

    if (result.acknowledge === 'success') {
      console.log(`[SMS] Sent to ${cleanPhone}:`, result.response?.message_id);
      return true;
    } else {
      console.error(`[SMS] Failed to send to ${cleanPhone}:`, result.response?.errors);
      return false;
    }
  } catch (error) {
    console.error(`[SMS] Error sending to ${phone}:`, error);
    return false;
  }
}
