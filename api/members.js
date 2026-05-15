const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  const url = `https://api.congress.gov/v3/member?api_key=${key}&format=json&limit=20&currentMember=true`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
};
