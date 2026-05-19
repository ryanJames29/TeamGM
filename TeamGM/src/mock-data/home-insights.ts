export const FAVORITE_TEAMS = [
  { name: 'Lakers', league: 'NBA', record: '42-18', standing: '2nd in West' },
  { name: 'Chiefs', league: 'NFL', record: '12-5', standing: '1st in AFC West' },
  { name: 'Yankees', league: 'MLB', record: '65-45', standing: '1st in AL East' },
  { name: 'Avalanche', league: 'NHL', record: '38-22-5', standing: '3rd in Central' },
] as const;

export const UPCOMING_GAME = {
  team: 'Avalanche',
  opponent: 'Wild',
  time: 'Tonight at 7:00 PM',
  location: '@',
} as const;

export const AI_INSIGHTS = {
  whyItMatters: [
    'Division matchup',
    '4-point standings swing',
    'Opponent has won 6 straight',
    "Your team's goalie has struggled against this team",
    'A win moves them into 2nd in the division',
  ],
  briefing: {
    team: 'Avalanche',
    summary:
      "Colorado has won 4 of their last 5, but the bigger story is their power play. They're converting at 31% over the last two weeks compared to 23% on the season.",
    context:
      "Tonight's matchup against Dallas matters because Dallas suppresses shots well at 5v5, so Colorado may need special teams to swing the game.",
  },
  concernLevel: {
    level: 6,
    description:
      'Losing two straight is not panic-worthy, but the penalty kill has allowed 5 goals in the last 3 games. If that continues into next week, it becomes a real issue.',
  },
  playerTrends: {
    stockUp: [
      { name: 'Cale Makar', stat: '8 points in last 5 games' },
      { name: "Logan O'Connor", stat: 'Generating more shots than usual' },
    ],
    stockDown: [
      { name: 'Second pairing defense', stat: 'Negative goal differential over last 4 games' },
    ],
  },
  recentPerformance: {
    headline: 'Avalanche lost 4-2',
    summary:
      'The score is a little misleading. They outshot Dallas 36-24 and controlled most of the second period. The turning point was Dallas scoring twice in 2:14 after Colorado failed to clear the puck.',
    wentRight: 'Shot volume, 2nd period control',
    wentWrong: 'Puck clearing, 3rd period',
  },
} as const;
