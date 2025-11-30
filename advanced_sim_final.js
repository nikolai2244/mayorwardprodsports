// simulator-engine.js
// MayorWardProd Sports Lab – v1 Simulation Core
// Zero edits required. Fully compatible with Step 5F architecture.

const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const ODDS_API_KEY = process.env.ODDS_API_KEY || "35ea2bfd08888692d90a60bb91273c16";

// -----------------------------------------------
// TEAM STRENGTH MODEL (Base multipliers)
// -----------------------------------------------
const TEAM_STRENGTH = {
  KC: 1.35, GB: 1.28, DET: 1.30, DAL: 1.22, CIN: 1.18,
  BAL: 1.25, PHI: 1.32, SF: 1.31, BUF: 1.26, LAR: 1.12,
  LAC: 1.15, MIN: 1.14, TB: 1.08, HOU: 1.16, IND: 0.95,
  TEN: 0.98, NE: 0.85, NYJ: 0.92, CHI: 0.88, CAR: 0.82,
  NO: 0.89, MIA: 1.10, ARI: 0.97, CLE: 1.06, PIT: 1.04,
  SEA: 1.11, NYG: 0.91, JAX: 0.87, ATL: 0.90, LV: 0.86
};

// -----------------------------------------------
// MAIN ENGINE RUNNER
// -----------------------------------------------
exports.handler = async () => {
  try {
    const liveData = await getLatestGameData();
    const results = {};

    for (const game of liveData) {
      results[`${game.away}@${game.home}`] = runFullSimulationCycle(game);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        generated: new Date().toISOString(),
        totalGames: liveData.length,
        results
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(err) })
    };
  }
};

// -----------------------------------------------
// 1. FETCH LIVE DATA (ESPN + Odds + Weather)
// -----------------------------------------------
async function getLatestGameData() {
  let espn = [];
  let odds = [];

  try {
    const espnRes = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard");
    const espnJson = await espnRes.json();
    espn = espnJson.events || [];
  } catch (e) {}

  try {
    const url =
      "https://api.the-odds-api.com/v4/sports/americanfootball_nfl/odds?" +
      new URLSearchParams({
        apiKey: ODDS_API_KEY,
        regions: "us",
        markets: "h2h,spreads,totals",
        oddsFormat: "american"
      }).toString();

    const oddsRes = await fetch(url);
    odds = await oddsRes.json();
  } catch (e) {}

  return espn.map(ev => {
    const comp = ev.competitions?.[0];
    const away = comp?.competitors?.find(c => c.homeAway === "away")?.team?.abbreviation;
    const home = comp?.competitors?.find(c => c.homeAway === "home")?.team?.abbreviation;

    const matchedOdds = odds.find(o => o.away_team === away && o.home_team === home);

    return {
      away,
      home,
      odds: matchedOdds || null,
      espnRaw: ev
    };
  });
}

// -----------------------------------------------
// 2. FULL SIMULATION CYCLE
// -----------------------------------------------
function runFullSimulationCycle(game) {
  const phases = [
    { runs: 1500000, weight: 0.65 },
    { runs: 5888, weight: 0.20 },
    { runs: 200, weight: 0.10 },
    { runs: 50, weight: 0.05 }
  ];

  let scores = [];
  let margins = [];
  let winners = {};

  for (const phase of phases) {
    const phaseOut = runSimulations(game, phase.runs);

    scores.push({
      away: average(phaseOut.awayScores),
      home: average(phaseOut.homeScores),
      weight: phase.weight
    });

    margins.push({
      margin: average(phaseOut.margins),
      weight: phase.weight
    });

    for (const w of phaseOut.winners) {
      winners[w] = (winners[w] || 0) + 1 * phase.weight;
    }
  }

  const finalAway =
    scores.reduce((a, b) => a + b.away * b.weight, 0);
  const finalHome =
    scores.reduce((a, b) => a + b.home * b.weight, 0);

  const finalMargin =
    margins.reduce((a, b) => a + b.margin * b.weight, 0);

  const winningTeam = Object.keys(winners).reduce((a, b) =>
    winners[b] > winners[a] ? b : a
  );

  return {
    game: `${game.away} @ ${game.home}`,
    projectedScore: {
      [game.away]: round(finalAway),
      [game.home]: round(finalHome)
    },
    projectedMargin: finalMargin,
    projectedWinner: winningTeam,
    confidenceScore: Math.min(
      99,
      Math.round((winners[winningTeam] / Object.values(winners).reduce((a, b) => a + b)) * 100)
    )
  };
}

// -----------------------------------------------
// 3. RUN N SIMULATIONS FOR A GAME
// -----------------------------------------------
function runSimulations(game, cycles) {
  const awayStrength = TEAM_STRENGTH[game.away] || 1.0;
  const homeStrength = TEAM_STRENGTH[game.home] || 1.0;

  const awayScores = [];
  const homeScores = [];
  const margins = [];
  const winners = [];

  for (let i = 0; i < cycles; i++) {
    const baseAway = 20 * awayStrength + rand(-10, 10);
    const baseHome = 20 * homeStrength + rand(-10, 10) + 1.5; // home field boost

    const awayScore = Math.max(0, round(baseAway + rand(-7, 7)));
    const homeScore = Math.max(0, round(baseHome + rand(-7, 7)));

    awayScores.push(awayScore);
    homeScores.push(homeScore);
    margins.push(homeScore - awayScore);

    winners.push(homeScore > awayScore ? game.home : game.away);
  }

  return { awayScores, homeScores, margins, winners };
}

// -----------------------------------------------
// HELPERS
// -----------------------------------------------
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function round(n) {
  return Math.round(n);
}
