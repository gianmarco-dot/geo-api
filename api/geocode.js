const axios = require('axios');

export default async function handler(req, res) {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Missing coordinates' });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
    const geo = await axios.get(url);
    const components = geo.data.results[0]?.address_components || [];

    let city = '', country = '';

    for (const comp of components) {
      if (comp.types.includes('locality')) city = comp.long_name;
      if (comp.types.includes('country')) country = comp.long_name;
    }

    res.status(200).json({ city, country });

  } catch (error) {
    console.error('Geocode error:', error.message);
    res.status(500).json({ error: 'Failed to get location' });
  }
}
