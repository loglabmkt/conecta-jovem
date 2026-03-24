import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import { createHash } from 'node:crypto';

const PIXEL_ID = '1193535366190752';
const API_VERSION = 'v19.0';

function sha256(value) {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { event_name, email, phone, event_id, source_url } = await req.json();

  const accessToken = Deno.env.get('META_ACCESS_TOKEN');

  const userData = {};
  if (email) userData.em = [sha256(email)];
  if (phone) {
    // Remove tudo exceto dígitos, adiciona código do país Brasil
    const digits = phone.replace(/\D/g, '');
    const withCountry = digits.startsWith('55') ? digits : '55' + digits;
    userData.ph = [sha256(withCountry)];
  }

  const payload = {
    data: [
      {
        event_name: event_name || 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id || crypto.randomUUID(),
        event_source_url: source_url || 'https://conectajovem.base44.app',
        action_source: 'website',
        user_data: userData,
      },
    ],
    test_event_code: undefined, // remover em produção
  };

  // Remove test_event_code se undefined
  delete payload.test_event_code;

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  return Response.json({ ok: res.ok, result });
});