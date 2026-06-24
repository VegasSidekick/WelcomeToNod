export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return json({ error: 'Invalid email' }, 400);
    }

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY
      },
      body: JSON.stringify({ email, listIds: [4], updateEnabled: true })
    });

    return res.ok || res.status === 204
      ? json({ success: true }, 200)
      : json({ error: 'Brevo error' }, 502);

  } catch {
    return json({ error: 'Server error' }, 500);
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
