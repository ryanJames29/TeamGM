export const TAB_COPY = {
  home: { title: 'Home' },
  scores: { title: 'Scores' },
  mygm: { title: 'myGM' },
  profile: { title: 'Profile' },
} as const;

export const HOME_COPY = {
  welcomeTitle: 'Welcome to TeamGM',
  getStarted: 'get started',
  tryEditingTitle: 'Try editing',
  tryEditingHint: 'src/screens/home-screen.tsx',
  devToolsTitle: 'Dev tools',
  freshStartTitle: 'Fresh start',
  freshStartHint: 'npm run reset-project',
  devMenuWeb: 'use browser devtools',
  devMenuDeviceShake: 'shake device or press',
  devMenuDeviceKey: 'm',
  devMenuDeviceSuffix: 'in terminal',
  devMenuSimulatorPrefix: 'press',
  devMenuAndroidShortcut: 'cmd+m (or ctrl+m)',
  devMenuIosShortcut: 'cmd+d',
} as const;

export const SCORES_COPY = {
  title: 'Scores',
  subtitle: 'Live scores and game results will appear here.',
} as const;

export const MYGM_COPY = {
  title: 'myGM',
  subtitle: 'Manage your roster and lineups here.',
} as const;

export const PROFILE_COPY = {
  title: 'Profile',
  subtitle: 'Your account and settings will live here.',
} as const;
