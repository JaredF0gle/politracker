const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  const { congress, type, number } = req.query;
  const billType = String(type || '').toLowerCase();
  const url = `https://api.congress.gov/v3/bill/${congress}/${billType}/${number}?api_key=${key}&format=json`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
};
