// Index endpoint voor api folder
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API folder detected!',
    endpoints: [
      '/api/hello',
      '/api/test',
      '/api/search-offers'
    ]
  });
}

