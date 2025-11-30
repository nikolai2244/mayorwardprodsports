const fetch = require("node-fetch");

exports.handler = async () => {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    const url =
      "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?" +
      new URLSearchParams({
        apiKey,
        regions: "us",
        markets: "h2h,spreads,totals",
        oddsFormat: "american"
      });

    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: true, message: json.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ error: false, games: json })
    };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: true, message: "Server error" }) };
  }
};
