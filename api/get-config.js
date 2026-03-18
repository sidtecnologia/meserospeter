export default (req, res) => {
  const SUPA_URL = process.env.SUPA_URL;
  const SUPA_ANON_KEY = process.env.SUPA_ANON_KEY;

  if (!SUPA_URL || !SUPA_ANON_KEY) {
    return res.status(500).json({ 
      error: 'Variables de entorno faltantes',
      url: null,
      anonKey: null
    });
  }

  res.status(200).json({
    url: SUPA_URL,
    anonKey: SUPA_ANON_KEY
  });
};