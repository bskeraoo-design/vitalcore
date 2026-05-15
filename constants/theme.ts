import { Platform } from 'react-native';

/* ══════════════════════════════════════
   VitalCore Design Tokens v2
   Deep purple-navy dark mode palette
   Inspired by premium health wearable UX
══════════════════════════════════════ */

/* ── Brand Colors ── */
export const Colors = {
  /* App Background — deep purple-navy */
  bg:       '#0C0A1A',
  surface:  '#141128',
  surface2: '#1C1838',
  border:   '#2C284A',

  /* Semantic Health Colors */
  green:  '#00CFA8',   // Recovery / Good (teal)
  amber:  '#FF6B4A',   // Strain / Moderate (coral-orange)
  red:    '#FF4D6A',   // Alert / Rest (pink-red)
  blue:   '#7B6EF0',   // Sleep (indigo-violet)
  purple: '#C084FC',   // REM / Secondary (bright violet)

  /* Typography */
  text:   '#F0EEFF',
  muted:  '#484268',
  muted2: '#8880A8',

  /* Alpha variants */
  greenDim:  'rgba(0,207,168,0.12)',
  amberDim:  'rgba(255,107,74,0.12)',
  redDim:    'rgba(255,77,106,0.12)',
  blueDim:   'rgba(123,110,240,0.12)',
  purpleDim: 'rgba(192,132,252,0.12)',

  /* Legacy Expo theme compatibility */
  light: {
    text:           '#F0EEFF',
    background:     '#0C0A1A',
    tint:           '#00CFA8',
    icon:           '#8880A8',
    tabIconDefault: '#484268',
    tabIconSelected:'#00CFA8',
  },
  dark: {
    text:           '#F0EEFF',
    background:     '#0C0A1A',
    tint:           '#00CFA8',
    icon:           '#8880A8',
    tabIconDefault: '#484268',
    tabIconSelected:'#00CFA8',
  },
};

/* ── Spacing Scale ── */
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

/* ── Border Radius ── */
export const Radius = {
  sm:   10,
  md:   16,
  lg:   20,
  full: 999,
};

/* ── Typography ── */
export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

/* ── Shadow presets ── */
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 0,
  }),
};
