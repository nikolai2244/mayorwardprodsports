const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    // The Odds API configuration
    const API_KEY = process.env.ODDS_API_KEY || 'demo';
    const oddsApiUrl = `https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds/?apiKey=${API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;

    // Fetch live odds data
    const oddsResponse = await axios.get(oddsApiUrl);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(oddsResponse.data)
    };
  } catch (error) {
    console.error('Error fetching odds data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to fetch odds data' })
    };
  }
};
