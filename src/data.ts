import { Fixture, VipPackage, OddsPack, DesignIteration, ExternalLink } from './types';

export const designIterations: DesignIteration[] = [
  {
    id: 'cheerplex-velocity',
    name: 'Cheerplex Velocity (Signature Cobalt & Crisp Platinum)',
    version: 'Cheerplex Signature',
    description: 'A bespoke sports-intelligence interface featuring electric royal cobalt, energetic flame accents, and ultra-high-contrast styling with generous negative space.',
    notes: [
      'Bespoke Cheerplex electric cobalt primary accents for authoritative sports intel',
      'Ultra-crisp porcelain canvas with razor-sharp legible typography',
      'Energetic flame orange badges for LIVE fixtures and high-confidence jackpots',
      'Mathematical probability indexes built specifically for cheerplex.co.ke punters'
    ],
    themeClass: 'theme-cheerplex'
  },
  {
    id: 'cheerplex-stealth',
    name: 'Cheerplex Midnight Stealth (Dark Sports Mode)',
    version: 'Midnight Stealth',
    description: 'An intense, high-tech sports interface featuring deep obsidian black, neon electric blue, and fiery orange status indicators.',
    notes: [
      'Deep obsidian canvas engineered for low-light night-match tracking',
      'Neon electric blue primary indicators and sleek modern cards',
      'High-contrast odds values and live fan voting stats',
      'Athletic sports-journalism typography with instant visual hierarchy'
    ],
    themeClass: 'theme-midnight'
  }
];

export const vipPackages: VipPackage[] = [
  {
    id: 'vip-1day',
    slug: 'vip-1day',
    name: 'One Day VIP',
    price: 1,
    durationDays: 1,
    description: 'Access to high-analyzed VIP tips for 1 day including premium match slips.',
    features: [
      'Accurate daily single tips and secure double selection',
      'Detailed statistical statistical breakdown per fixture',
      'Instant SMS and premium WhatsApp support updates',
      'Priority mobile M-Pesa STK push fast checkout'
    ]
  },
  {
    id: 'vip-4day',
    slug: 'vip-4day',
    name: 'Four Days VIP',
    price: 450,
    durationDays: 4,
    description: 'Curated premium selections spanning 4 days of European action and Midweek Jackpots.',
    features: [
      'Access to daily premium sure-tips slips',
      'Detailed soccer jackpot analytics (Betika, SportPesa, Mozzart)',
      'Double-Chance protection selection (up to 2 games)',
      'High-confidence premium accumulators (3+ odds daily)',
      'Priority customer assistance line'
    ]
  },
  {
    id: 'vip-7day',
    slug: 'vip-7day',
    name: 'One Week VIP',
    price: 800,
    durationDays: 7,
    description: 'Complete weekly coverage of all football leagues, jackpots, and active VIP slips.',
    features: [
      'Full 7-day VIP picks and dynamic accumulator slips',
      'Coverage of all major weekend jackpots (SportPesa Mega, Mozzart Grand)',
      'Confidence indexes and deep-learning tactical insights',
      'Exclusive high-yield longshot premium tickets',
      'WhatsApp hotline priority membership and support'
    ],
    isFeatured: true
  },
  {
    id: 'vip-14day',
    slug: 'vip-14day',
    name: 'Two Weeks VIP',
    price: 1,
    durationDays: 14,
    description: 'Ultimate fortnightly investment tier for seasoned sports prediction players.',
    features: [
      'Fortnightly continuous access to all VIP tips and jackpots',
      'Full analysis of 13-game and 17-game national jackpots',
      'Personalized bankroll management and optimal betting splits',
      'Direct WhatsApp manager line with Joseph Chege',
      '92% verified historical bi-weekly performance metric'
    ]
  }
];

export const oddsPacks: OddsPack[] = [
  {
    id: 1,
    slug: 'odds-3plus',
    name: '3+ Odds Pack',
    tag: 'Smart Bet',
    price: 150,
    durationDays: 1,
    picksPerDay: 3,
    oddsMinDecimal: '3.00',
    description: 'Highly secure balanced shortlist — 3+ combined odds.',
    color: '#10b981', // Emerald
    riskLevel: 'Conservative'
  },
  {
    id: 2,
    slug: 'odds-5plus',
    name: '5+ Odds Pack',
    tag: 'Best Value',
    price: 350,
    durationDays: 1,
    picksPerDay: 2,
    oddsMinDecimal: '5.00',
    description: 'High payout shortlist with carefully weighted 5+ odds.',
    color: '#f59e0b', // Amber
    riskLevel: 'Balanced'
  },
  {
    id: 3,
    slug: 'odds-7plus',
    name: '7+ Odds Pack',
    tag: 'Pro Selection',
    price: 500,
    durationDays: 1,
    picksPerDay: 1,
    oddsMinDecimal: '7.00',
    description: 'Aggressive single-ticket accumulator with 7+ odds.',
    color: '#ef4444', // Red
    riskLevel: 'Aggressive'
  },
  {
    id: 4,
    slug: 'odds-9plus',
    name: '9+ Mega Odds Pack',
    tag: 'Max Return',
    price: 650,
    durationDays: 1,
    picksPerDay: 1,
    oddsMinDecimal: '9.00',
    description: 'High multiplier accumulator ticket targeting 9+ sure multibet odds.',
    color: '#8b5cf6', // Violet
    riskLevel: 'High Yield'
  }
];

export const fixturesData: Record<'yesterday' | 'today' | 'tomorrow' | 'jackpot', Fixture[]> = {
  yesterday: [
    {
      id: 101,
      homeTeam: 'Manchester United',
      awayTeam: 'Leeds United',
      prediction: 'Home Win (1)',
      result: 'won',
      status: 'FT',
      kickoffTime: '2026-07-14T15:00:00Z',
      leagueName: 'Premier League',
      leagueFlag: '🇬🇧',
      countryName: 'England',
      homeScore: 2,
      awayScore: 0,
      confidence: 85,
      aiAnalysis: 'Manchester United controlled the game with 62% possession and clinical midfield play as predicted.'
    },
    {
      id: 102,
      homeTeam: 'Norwich City',
      awayTeam: 'Leeds United',
      prediction: 'Over 2.5 Goals',
      result: 'won',
      status: 'FT',
      kickoffTime: '2026-07-14T16:30:00Z',
      leagueName: 'Championship',
      leagueFlag: '🇬🇧',
      countryName: 'England',
      homeScore: 2,
      awayScore: 1,
      confidence: 80,
      aiAnalysis: 'Dynamic offensive strategies from both teams created high goal-scoring chances in transition.'
    },
    {
      id: 103,
      homeTeam: 'Inter Milan',
      awayTeam: 'Juventus',
      prediction: 'Both Teams to Score (GG)',
      result: 'won',
      status: 'FT',
      kickoffTime: '2026-07-14T18:45:00Z',
      leagueName: 'Serie A',
      leagueFlag: '🇮🇹',
      countryName: 'Italy',
      homeScore: 1,
      awayScore: 1,
      confidence: 78,
      aiAnalysis: 'High-octane Italian derby resulting in goals from both wings. Tactical shapes opened up nicely.'
    }
  ],
  today: [
    {
      id: 1604219,
      fixtureRef: '1604219',
      homeTeam: 'Oberneuland',
      awayTeam: 'Hemelingen',
      homeTeamLogo: 'https://example.com/teams/oberneuland-4263.webp',
      awayTeamLogo: 'https://example.com/teams/hemelingen-12783.webp',
      prediction: '2',
      result: 'pending',
      status: 'NS',
      statusLong: 'Not Started',
      kickoffTime: '2026-09-23 17:30:00',
      date: '2026-09-23 17:30:00',
      leagueName: 'Oberliga - Bremen',
      leagueCountry: 'Germany',
      countryName: 'Germany',
      countryFlag: 'https://media.api-sports.io/flags/de.svg',
      leagueFlag: '🇩🇪',
      leagueLogo: 'https://media.api-sports.io/football/leagues/749.png',
      homeScore: '-',
      awayScore: '-',
      confidence: 96,
      aiAnalysis: 'AI mathematical prediction derived from team form & historical head-to-head metrics.',
      probabilities: {
        home: '9%',
        draw: '30%',
        away: '61%'
      }
    },
    {
      id: 1635582,
      fixtureRef: '1635582',
      homeTeam: 'Gamba Osaka',
      awayTeam: 'Tokushima Vortis',
      homeTeamLogo: 'https://example.com/teams/gamba-osaka-293.webp',
      awayTeamLogo: 'https://example.com/teams/tokushima-vortis-299.webp',
      prediction: '1',
      result: 'pending',
      status: 'NS',
      statusLong: 'Not Started',
      kickoffTime: '2026-09-23 08:00:00',
      date: '2026-09-23 08:00:00',
      leagueName: 'Emperor Cup',
      leagueCountry: 'Japan',
      countryName: 'Japan',
      countryFlag: 'https://media.api-sports.io/flags/jp.svg',
      leagueFlag: '🇯🇵',
      leagueLogo: 'https://media.api-sports.io/football/leagues/102.png',
      homeScore: '-',
      awayScore: '-',
      confidence: 80,
      aiAnalysis: 'AI mathematical prediction derived from team form & historical head-to-head metrics.',
      probabilities: {
        home: '40%',
        draw: '30%',
        away: '30%'
      }
    },
    {
      id: 1638271,
      fixtureRef: '1638271',
      homeTeam: 'Groesbeek',
      awayTeam: 'Kozakken Boys',
      homeTeamLogo: 'https://example.com/teams/groesbeek-28176.webp',
      awayTeamLogo: 'https://example.com/teams/kozakken-boys-1242.webp',
      prediction: 'OV 2.5',
      result: 'pending',
      status: 'NS',
      statusLong: 'Not Started',
      kickoffTime: '2026-09-23 18:00:00',
      date: '2026-09-23 18:00:00',
      leagueName: 'KNVB Beker',
      leagueCountry: 'Netherlands',
      countryName: 'Netherlands',
      countryFlag: 'https://media.api-sports.io/flags/nl.svg',
      leagueFlag: '🇳🇱',
      leagueLogo: 'https://media.api-sports.io/football/leagues/90.png',
      homeScore: '-',
      awayScore: '-',
      confidence: 72,
      aiAnalysis: 'AI mathematical prediction derived from team form & historical head-to-head metrics.',
      probabilities: {
        home: '0%',
        draw: '100%',
        away: '0%'
      }
    },
    {
      id: 1638280,
      fixtureRef: '1638280',
      homeTeam: 'Sparta Nijkerk',
      awayTeam: "UDI '19",
      homeTeamLogo: 'https://example.com/teams/sparta-nijkerk-1274.webp',
      awayTeamLogo: 'https://example.com/teams/udi-19-3938.webp',
      prediction: 'OV 2.5',
      result: 'pending',
      status: 'NS',
      statusLong: 'Not Started',
      kickoffTime: '2026-09-23 18:00:00',
      date: '2026-09-23 18:00:00',
      leagueName: 'KNVB Beker',
      leagueCountry: 'Netherlands',
      countryName: 'Netherlands',
      countryFlag: 'https://media.api-sports.io/flags/nl.svg',
      leagueFlag: '🇳🇱',
      leagueLogo: 'https://media.api-sports.io/football/leagues/90.png',
      homeScore: '-',
      awayScore: '-',
      confidence: 72,
      aiAnalysis: 'AI mathematical prediction derived from team form & historical head-to-head metrics.',
      probabilities: {
        home: '28%',
        draw: '30%',
        away: '42%'
      }
    },
    {
      id: 1593608,
      fixtureRef: '1593608',
      homeTeam: 'Hamilton Academical',
      awayTeam: 'Cowdenbeath',
      homeTeamLogo: 'https://example.com/teams/hamilton-academical-248.webp',
      awayTeamLogo: 'https://example.com/teams/cowdenbeath-4667.webp',
      prediction: 'OV 2.5',
      result: 'pending',
      status: 'NS',
      statusLong: 'Not Started',
      kickoffTime: '2026-09-23 18:45:00',
      date: '2026-09-23 18:45:00',
      leagueName: 'Challenge Cup',
      leagueCountry: 'Scotland',
      countryName: 'Scotland',
      countryFlag: 'https://media.api-sports.io/flags/gb-sct.svg',
      leagueFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      leagueLogo: 'https://media.api-sports.io/football/leagues/182.png',
      homeScore: '-',
      awayScore: '-',
      confidence: 72,
      aiAnalysis: 'AI mathematical prediction derived from team form & historical head-to-head metrics.',
      probabilities: {
        home: '38%',
        draw: '30%',
        away: '32%'
      }
    }
  ],
  tomorrow: [
    {
      id: 1629897,
      fixtureRef: '1629897',
      homeTeam: 'Elva',
      awayTeam: 'Tallinna Kalev',
      homeTeamLogo: 'https://example.com/teams/elva-3516.webp',
      awayTeamLogo: 'https://example.com/teams/tallinna-kalev-3529.webp',
      prediction: '2',
      result: 'pending',
      status: 'NS',
      statusLong: 'Not Started',
      kickoffTime: '2026-09-24 14:00:00',
      date: '2026-09-24 14:00:00',
      leagueName: 'Cup',
      leagueCountry: 'Estonia',
      countryName: 'Estonia',
      countryFlag: 'https://media.api-sports.io/flags/ee.svg',
      leagueFlag: '🇪🇪',
      leagueLogo: 'https://media.api-sports.io/football/leagues/657.png',
      homeScore: '-',
      awayScore: '-',
      confidence: 81,
      aiAnalysis: 'AI mathematical prediction derived from team form & historical head-to-head metrics.',
      probabilities: {
        home: '32%',
        draw: '30%',
        away: '38%'
      }
    },
    {
      id: 1528862,
      fixtureRef: '1528862',
      homeTeam: 'Netherlands',
      awayTeam: 'Germany',
      homeTeamLogo: 'https://example.com/teams/netherlands-1118.webp',
      awayTeamLogo: 'https://example.com/teams/germany-25.webp',
      prediction: '12',
      result: 'pending',
      status: 'NS',
      statusLong: 'Not Started',
      kickoffTime: '2026-09-24 18:45:00',
      date: '2026-09-24 18:45:00',
      leagueName: 'UEFA Nations League',
      leagueCountry: 'World',
      countryName: 'World',
      countryFlag: 'https://media.api-sports.io/flags/gb.svg',
      leagueFlag: '🌍',
      leagueLogo: 'https://media.api-sports.io/football/leagues/5.png',
      homeScore: '-',
      awayScore: '-',
      confidence: 76,
      aiAnalysis: 'AI mathematical prediction derived from team form & historical head-to-head metrics.',
      probabilities: {
        home: '31%',
        draw: '30%',
        away: '39%'
      }
    },
    {
      id: 1528878,
      fixtureRef: '1528878',
      homeTeam: 'Austria',
      awayTeam: 'Israel',
      homeTeamLogo: 'https://example.com/teams/austria-775.webp',
      awayTeamLogo: 'https://example.com/teams/israel-1116.webp',
      prediction: '12',
      result: 'pending',
      status: 'NS',
      statusLong: 'Not Started',
      kickoffTime: '2026-09-24 18:45:00',
      date: '2026-09-24 18:45:00',
      leagueName: 'UEFA Nations League',
      leagueCountry: 'World',
      countryName: 'World',
      countryFlag: 'https://media.api-sports.io/flags/gb.svg',
      leagueFlag: '🌍',
      leagueLogo: 'https://media.api-sports.io/football/leagues/5.png',
      homeScore: '-',
      awayScore: '-',
      confidence: 71,
      aiAnalysis: 'AI mathematical prediction derived from team form & historical head-to-head metrics.',
      probabilities: {
        home: '35%',
        draw: '30%',
        away: '35%'
      }
    }
  ],
  jackpot: []
};

export interface ContactSocialConfig {
  id: string;
  channelName: string;
  contactValue: string;
  type: 'whatsapp' | 'email' | 'phone' | 'location' | 'social';
  actionUrl: string;
  description: string;
  status: 'Active' | '24/7 Dispatch';
}

export const contactSocialTable: ContactSocialConfig[] = [
  {
    id: 'cnt-wa-1',
    channelName: 'WhatsApp Official Hotline',
    contactValue: '+254 740 841 375',
    type: 'whatsapp',
    actionUrl: 'https://wa.me/254740841375?text=Hello%20Cheerplex%20Support%2C%20I%20need%20today%20tips',
    description: 'Instant customer support, M-Pesa STK push assistance, and daily VIP slip queries',
    status: '24/7 Dispatch'
  },
  {
    id: 'cnt-email-1',
    channelName: 'Customer Support Email',
    contactValue: 'support@cheerplex.co.ke',
    type: 'email',
    actionUrl: 'mailto:support@cheerplex.co.ke',
    description: 'Official billing, partnership, and subscription account inquiries',
    status: 'Active'
  },
  {
    id: 'cnt-phone-1',
    channelName: 'Direct Dispatch Line',
    contactValue: '+254 740 841 375',
    type: 'phone',
    actionUrl: 'tel:+254740841375',
    description: 'Safaricom M-Pesa verification and helpline support',
    status: '24/7 Dispatch'
  },
  {
    id: 'cnt-loc-1',
    channelName: 'Headquarters Office',
    contactValue: 'Galana Plaza, 4th Floor, Kilimani, Nairobi, Kenya',
    type: 'location',
    actionUrl: 'https://maps.google.com/?q=Galana+Plaza+Kilimani+Nairobi',
    description: 'Data analytics hub and operational headquarters',
    status: 'Active'
  }
];

export const defaultExternalLinks: ExternalLink[] = [
  {
    id: 1,
    anchorText: 'Sokapedia Football Predictions',
    url: 'https://sokapedia.com/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'Football Predictions',
    target: '_blank',
    description: 'Expert match previews, team form metrics, and daily football predictions.',
    orderIndex: 1,
    isActive: true
  },
  {
    id: 2,
    anchorText: 'Betwinner360 Predictions & Jackpot Tips',
    url: 'https://betwinner360.com/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'Jackpot Tips',
    target: '_blank',
    description: 'Accurate SportPesa, Betika Midweek and weekend mega jackpot selections.',
    orderIndex: 2,
    isActive: true
  },
  {
    id: 3,
    anchorText: 'Forebet Mathematical Football Predictions',
    url: 'https://www.forebet.com/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'AI Predictions',
    target: '_blank',
    description: 'Mathematical football predictions and statistical analysis algorithms.',
    orderIndex: 3,
    isActive: true
  },
  {
    id: 4,
    anchorText: 'Cheerplex Soccer Predictions Today',
    url: 'https://cheerplex.co.ke/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'Daily Tips',
    target: '_blank',
    description: 'East Africa premier soccer tips, 254 sure predictions, and 1X2 slips.',
    orderIndex: 4,
    isActive: true
  },
  {
    id: 5,
    anchorText: 'Sunpel Soccer Predictions & Tips',
    url: 'https://sunpel.com/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'Daily Tips',
    target: '_blank',
    description: 'Free daily betting tips, over/under goal guides, and European fixtures.',
    orderIndex: 5,
    isActive: true
  },
  {
    id: 6,
    anchorText: 'Victorspredict Football Betting Tips',
    url: 'https://victorspredict.com/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'Football Predictions',
    target: '_blank',
    description: 'Free banker bets, double chance, and accumulator combination tips.',
    orderIndex: 6,
    isActive: true
  },
  {
    id: 7,
    anchorText: 'Windrawwin Football Predictions & Stats',
    url: 'https://www.windrawwin.com/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'Stats & Analysis',
    target: '_blank',
    description: 'Free football predictions, betting statistics, football results and league tables.',
    orderIndex: 7,
    isActive: true
  },
  {
    id: 8,
    anchorText: 'Statarea Soccer Facts & Predictions',
    url: 'https://www.statarea.com/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'Stats & Analysis',
    target: '_blank',
    description: 'In-depth league trends, head-to-head records, and historical comparisons.',
    orderIndex: 8,
    isActive: true
  },
  {
    id: 9,
    anchorText: 'Vitibet Free Football Tips & Tables',
    url: 'https://www.vitibet.com/',
    rel: 'dofollow',
    isDofollow: true,
    tag: 'Football Predictions',
    target: '_blank',
    description: 'Daily football betting tips, index-based mathematical predictions and tables.',
    orderIndex: 9,
    isActive: true
  },
  {
    id: 10,
    anchorText: 'Flashscore Live Football Scores',
    url: 'https://www.flashscore.com/',
    rel: 'nofollow',
    isDofollow: false,
    tag: 'Live Scores',
    target: '_blank',
    description: 'Real-time live soccer scores, goal notifications, and match stats.',
    orderIndex: 10,
    isActive: true
  },
  {
    id: 11,
    anchorText: 'LiveScore Real-time Sports Results',
    url: 'https://www.livescore.com/',
    rel: 'nofollow',
    isDofollow: false,
    tag: 'Live Scores',
    target: '_blank',
    description: 'Instant scores and sports updates covering football competitions worldwide.',
    orderIndex: 11,
    isActive: true
  },
  {
    id: 12,
    anchorText: 'SportPesa Kenya Official Portal',
    url: 'https://www.sportpesa.co.ke/',
    rel: 'nofollow',
    isDofollow: false,
    tag: 'Bookmakers',
    target: '_blank',
    description: 'SportPesa Kenya licensed betting company and mega jackpot host.',
    orderIndex: 12,
    isActive: true
  },
  {
    id: 13,
    anchorText: 'Betika Kenya Sports Betting',
    url: 'https://www.betika.com/',
    rel: 'nofollow',
    isDofollow: false,
    tag: 'Bookmakers',
    target: '_blank',
    description: 'Betika Kenya licensed sports wagering and midweek jackpot provider.',
    orderIndex: 13,
    isActive: true
  },
  {
    id: 14,
    anchorText: 'MozzartBet Kenya Grand Jackpot',
    url: 'https://www.mozzartbet.co.ke/',
    rel: 'nofollow',
    isDofollow: false,
    tag: 'Bookmakers',
    target: '_blank',
    description: 'Mozzart Bet Kenya daily super jackpot and grand jackpot gaming platform.',
    orderIndex: 14,
    isActive: true
  }
];
