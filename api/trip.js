export default async function handler(req, res) {
  const id = (req.query.id || '').toString().trim();
  if (!/^[a-zA-Z0-9_-]{4,64}$/.test(id)) {
    res.status(400).json({ error: 'ID de viaje inválido' });
    return;
  }

  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!baseUrl || !token) {
    res.status(500).json({ error: 'Almacén no configurado en Vercel (falta conectar KV al proyecto)' });
    return;
  }

  const key = 'trip:' + id;

  if (req.method === 'GET') {
    const r = await fetch(baseUrl + '/get/' + encodeURIComponent(key), {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!r.ok) {
      res.status(502).json({ error: 'No se pudo leer el almacén' });
      return;
    }
    const data = await r.json();
    if (data.result == null) {
      res.status(404).json({ error: 'No encontrado' });
      return;
    }
    let parsed;
    try { parsed = JSON.parse(data.result); } catch (e) {
      res.status(500).json({ error: 'Datos guardados corruptos' });
      return;
    }
    res.status(200).json({ data: parsed });
    return;
  }

  if (req.method === 'POST') {
    const value = JSON.stringify(req.body);
    const r = await fetch(baseUrl + '/set/' + encodeURIComponent(key), {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'text/plain' },
      body: value
    });
    if (!r.ok) {
      res.status(502).json({ error: 'No se pudo guardar' });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Método no permitido' });
}
