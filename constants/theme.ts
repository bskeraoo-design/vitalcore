import { Platform } from 'react-native';

/* ══════════════════════════════════════
   VitalCore Design Tokens v2
   Deep purple-navy dark mode palette
   Inspired by premium health wearable UX
══════════════════════════════════════ */

/* ── Brand Colors ── */
export const DarkColors = {
  bg:       '#0C0A1A',
  surface:  '#141128',
  surface2: '#1C1838',
  border:   '#2C284A',
  green:    '#00CFA8',
  amber:    '#FF6B4A',
  red:      '#FF4D6A',
  blue:     '#7B6EF0',
  purple:   '#C084FC',
  text:     '#F0EEFF',
  muted:    '#484268',
  muted2:   '#8880A8',
  greenDim:  'rgba(0,207,168,0.12)',
  amberDim:  'rgba(255,107,74,0.12)',
  redDim:    'rgba(255,77,106,0.12)',
  blueDim:   'rgba(123,110,240,0.12)',
  purpleDim: 'rgba(192,132,252,0.12)',
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

export const LightColors = {
  bg:       '#F4F3FA',
  surface:  '#FFFFFF',
  surface2: '#ECEAF6',
  border:   '#DDD9F0',
  green:    '#00A88A',
  amber:    '#D85830',
  red:      '#D03060',
  blue:     '#5A50D0',
  purple:   '#8850C8',
  text:     '#0C0A1A',
  muted:    '#B8B5D0',
  muted2:   '#7A78A0',
  greenDim:  'rgba(0,168,138,0.12)',
  amberDim:  'rgba(216,88,48,0.12)',
  redDim:    'rgba(208,48,96,0.12)',
  blueDim:   'rgba(90,80,208,0.12)',
  purpleDim: 'rgba(136,80,200,0.12)',
  light: {
    text:           '#0C0A1A',
    background:     '#F4F3FA',
    tint:           '#00A88A',
    icon:           '#7A78A0',
    tabIconDefault: '#B8B5D0',
    tabIconSelected:'#00A88A',
  },
  dark: {
    text:           '#0C0A1A',
    background:     '#F4F3FA',
    tint:           '#00A88A',
    icon:           '#7A78A0',
    tabIconDefault: '#B8B5D0',
    tabIconSelected:'#00A88A',
  },
};

/* Default export stays dark for backward compatibility */
export const Colors = DarkColors;

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
