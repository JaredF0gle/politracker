module.exports = async function handler(req, res) {
  const key = process.env.CONGRESS_API_KEY;
  const { congress, session, rollNumber } = req.query;

  if (!key) {
    return res.status(500).json({ error: 'CONGRESS_API_KEY is not configured' });
  }

  try {
    const url = `https://api.congress.gov/v3/house-vote/${congress}/${session}/${rollNumber}/members?format=json&api_key=${key}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Congress API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch roll call members',
      details: error.message,
    });
  }
};
