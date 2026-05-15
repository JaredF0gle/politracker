require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.static(__dirname));

app.get('/api/test', (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) return res.json({ status: 'error', message: 'No API key found' });
  res.json({ status: 'ok', message: 'Backend is working', keyLoaded: true });
});

app.get('/api/members', async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) return res.status(500).json({ error: 'No API key configured' });

  const url = `https://api.congress.gov/v3/member?api_key=${key}&format=json&limit=20&currentMember=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Congress API error: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members', details: err.message });
  }
});

app.get('/api/votes/:bioguideId', async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) return res.status(500).json({ vote: null });

  const { bioguideId } = req.params;
  const url = `https://api.congress.gov/v3/member/${bioguideId}/votes?api_key=${key}&format=json&limit=1`;
  try {
    const response = await fetch(url);
    if (!response.ok) return res.json({ vote: null });
    const data = await response.json();
    const first = data.votes?.[0] ?? null;
    res.json({ vote: first });
  } catch {
    res.json({ vote: null });
  }
});

app.get('/api/bill/:congress/:type/:number', async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) return res.status(500).json({ error: 'No API key configured' });

  const { congress, type, number } = req.params;
  const billType = type.toLowerCase();
  const url = `https://api.congress.gov/v3/bill/${congress}/${billType}/${number}?api_key=${key}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).json({ error: `Congress API error: ${response.statusText}` });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bill', details: err.message });
  }
});

app.get('/api/rollcalls', async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) return res.status(500).json({ error: 'No API key configured' });

  const url = `https://api.congress.gov/v3/house-vote/119/1?format=json&limit=20&api_key=${key}&sort=startDate+desc`;
  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).json({ error: `Congress API error: ${response.statusText}` });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roll calls', details: err.message });
  }
});

app.get('/api/rollcall/:congress/:session/:rollNumber/members', async (req, res) => {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) return res.status(500).json({ error: 'No API key configured' });

  const { congress, session, rollNumber } = req.params;
  const url = `https://api.congress.gov/v3/house-vote/${congress}/${session}/${rollNumber}/members?format=json&api_key=${key}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return res.status(response.status).json({ error: `Congress API error: ${response.statusText}` });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roll call members', details: err.message });
  }
});

app.listen(3000, () => {
  console.log('PoliTracker running on http://localhost:3000');
});
