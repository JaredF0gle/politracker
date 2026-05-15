module.exports = async function handler(req, res) {
  const key = process.env.CONGRESS_API_KEY;
  const { congress, type, number } = req.query;
  const billType = String(type || '').toLowerCase();

  if (!key) {
    return res.status(500).json({ error: 'CONGRESS_API_KEY is not configured' });
  }

  try {
    const url = `https://api.congress.gov/v3/bill/${congress}/${billType}/${number}?api_key=${key}&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Congress API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch bill',
      details: error.message,
    });
  }
};
