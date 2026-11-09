// Función del servidor (Vercel). La clave de la IA vive aquí, nunca en la página.
const LIMITE_DIARIO = 300;   // consultas por IP y por día (protección básica)
const MAX_CARACTERES = 24000; // tamaño máximo de lo que se envía a la IA

module.exports = async (req, res) => {
  if (req.method === 'GET')
    return res.status(200).json({
      funcionando: true,
      ACCESS_CODE_configurado: !!process.env.ACCESS_CODE,
      ANTHROPIC_API_KEY_configurada: !!process.env.ANTHROPIC_API_KEY,
      modelo: process.env.MODEL || 'claude-haiku-5-5'
    });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  if (!process.env.ACCESS_CODE || req.headers['x-access'] !== process.env.ACCESS_CODE)
    return res.status(401).json({ error: 'No autorizado' });

  const ip = (req.headers['x-forwarded-for'] || 'x').split(',')[0].trim();
  const dia = new Date().toISOString().slice(0, 10);
  const hits = (globalThis.__hits = globalThis.__hits || {});
  const k = ip + dia;
  hits[k] = (hits[k] || 0) + 1;
  if (hits[k] > LIMITE_DIARIO) return res.status(429).json({ error: 'Límite diario alcanzado.' });

  const messages = (req.body || {}).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12 ||
      JSON.stringify(messages).length > MAX_CARACTERES)
    return res.status(400).json({ error: 'Solicitud inválida' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.MODEL || 'claude-haiku-5-5',
        max_tokens: 4000,
        messages
      })
    });
    const j = await r.json();
    if (!r.ok) {
      console.error('Error IA', r.status, JSON.stringify(j).slice(0, 300));
      return res.status(502).json({ error: 'Error del servicio de IA' });
    }
    console.log('USO', JSON.stringify({ modelo: j.model, ...j.usage }));
    const text = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    return res.status(200).json({ text, usage: j.usage });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};
