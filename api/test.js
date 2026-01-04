/**
 * Test endpoint om te verifiëren dat Vercel routing werkt
 */
export default function handler(req, res) {
  res.json({ 
    message: 'API werkt!', 
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
    status: 'OK'
  });
}

