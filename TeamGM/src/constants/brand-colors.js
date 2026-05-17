function darkenHex(hex, amount) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) =>
    Math.max(0, parseInt(value.slice(i, i + 2), 16) - amount),
  );
  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

const appBackground = '#171A21';

const teamgm = {
  app: appBackground,
  'tab-bar': darkenHex(appBackground, 6),
  surface: '#21262E',
  'surface-selected': '#2C333F',
  'text-primary': '#FFFFFF',
  'text-muted': '#9CA3AF',
};

module.exports = {
  teamgm,
  appBackground,
  tabBarBackground: teamgm['tab-bar'],
  surface: teamgm.surface,
  surfaceSelected: teamgm['surface-selected'],
  textPrimary: teamgm['text-primary'],
  textMuted: teamgm['text-muted'],
  appBackgroundRgb: '23 26 33',
  tabBarBackgroundRgb: '17 20 27',
};
