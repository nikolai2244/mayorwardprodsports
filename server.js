app.get("/api/odds", async (req, res) => {
  try {
    const url =
      "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?" +
      new URLSearchParams({
        apiKey: ODDS_API_KEY,
        regions: "us",
        markets: "h2h,spreads,totals",
        oddsFormat: "american"
      }).toString();

    const apiRes = await fetch(url);
    const json = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({
        error: true,
        status: apiRes.status,
        message: json.message || "The Odds API request failed"
      });
    }

    return res.json({ error: false, games: json });
  } catch (err) {
    return res.status(500).json({
      error: true,
      status: 500,
      message: "Internal server error fetching odds"
    });
  }
});
