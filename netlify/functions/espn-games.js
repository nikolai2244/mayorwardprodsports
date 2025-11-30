const fetch = require("node-fetch");

exports.handler = async () => {
  try {
    const url =
      "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";

    const res = await fetch(url);
    const json = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        games: json.events || []
      })
    };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: true }) };
  }
};
