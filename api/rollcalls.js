const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  const url = `https://api.congress.gov/v3/house-vote/119/1?limit=20&sort=startDate%20desc&format=json&api_key=${key}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
};
