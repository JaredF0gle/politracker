const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  const { congress, session, rollNumber } = req.query;
  const url = `https://api.congress.gov/v3/house-vote/${congress}/${session}/${rollNumber}/members?format=json&api_key=${key}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
};
