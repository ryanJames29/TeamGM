// Palette: Molten Lava, Flag Red, Papaya Whip, Deep Space Blue, Steel Blue
const deepSpaceBlue = '#003049';
const steelBlue = '#669bbc';
const papayaWhip = '#fdf0d5';
const flagRed = '#c1121f';
const moltenLava = '#780000';

const teamgm = {
  app: '#001824',
  secondary: deepSpaceBlue,
  surface: '#0f2838',
  'surface-selected': flagRed,
  'text-primary': papayaWhip,
  'text-muted': '#a4c1d4',
  border: '#4a6d82',
  accent: flagRed,
  'accent-strong': moltenLava,
};

module.exports = {
  teamgm,
  appBackground: teamgm.app,
  secondary: teamgm.secondary,
  surface: teamgm.surface,
  surfaceSelected: teamgm['surface-selected'],
  textPrimary: teamgm['text-primary'],
  textMuted: teamgm['text-muted'],
  border: teamgm.border,
  accent: teamgm.accent,
  accentStrong: teamgm['accent-strong'],
  appBackgroundRgb: '0 24 36',
  secondaryRgb: '0 48 73',
  tabBarBackground: teamgm.secondary,
  tabBarBackgroundRgb: '0 48 73',
};
