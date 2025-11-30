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

    // Fetch ESPN NFL scoreboard data
    const espnResponse = await axios.get(
      'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(espnResponse.data)
    };
  } catch (error) {
    console.error('Error fetching ESPN data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Failed to fetch ESPN data' })
    };
  }
};
