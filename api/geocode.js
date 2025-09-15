// api/geocode.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { latitude, longitude } = req.body;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'No results found' });
    }

    let city = '';
    let country = '';

    const components = data.results[0].address_components;
    for (const comp of components) {
      if (comp.types.includes('locality')) {
        city = comp.long_name;
      }
      if (comp.types.includes('country')) {
        country = comp.long_name;
      }
    }

    res.status(200).json({ city, country });
  } catch (error) {
    console.error('Geocode error:', error.message);
    res.status(500).json({ error: 'Failed to get location' });
  }
}

