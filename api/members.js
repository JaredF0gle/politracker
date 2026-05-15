module.exports = async function handler(req, res) {
  const key = process.env.CONGRESS_API_KEY;

  if (!key) {
    return res.status(500).json({ error: 'CONGRESS_API_KEY is not configured' });
  }

  try {
    const url = `https://api.congress.gov/v3/member?api_key=${key}&format=json&limit=20&currentMember=true`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Congress API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch members',
      details: error.message,
    });
  }
};
