import { HealthSnapshot } from './scoring';

/* ── VitalCore Data Simulator v2 ──
   Generates realistic biometric data for UI/demo testing.
   Includes 3 scenario presets and live-tick noise.
*/

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min;

/* One-shot sync: produces a clean snapshot from slider values */
export function buildSnapshot(sliders: HealthSnapshot): HealthSnapshot {
  return {
    hrv:      Math.round(sliders.hrv),
    hr:       Math.round(sliders.hr),
    spo2:     Math.round(sliders.spo2),
    sleep:    Math.round(sliders.sleep * 10) / 10,
    strain:   Math.round(sliders.strain),
    recovery: Math.round(sliders.recovery),
    steps:    Math.round(sliders.steps),
    calories: Math.round(sliders.calories),
    vo2max:   Math.round(sliders.vo2max * 10) / 10,
    respRate: Math.round(sliders.respRate),
    stress:   Math.round(sliders.stress),
    temp:     Math.round(sliders.temp * 10) / 10,
  };
}

/* Live mode tick: adds small noise to simulate real-time wearable data */
export function liveTick(base: HealthSnapshot): HealthSnapshot {
  return {
    hrv:      clamp(base.hrv      + rand(-5, 5),   20, 160),
    hr:       clamp(base.hr       + rand(-3, 3),   40, 200),
    spo2:     clamp(base.spo2     + rand(-0.5, 0.5), 85, 100),
    sleep:    base.sleep,
    strain:   clamp(base.strain   + rand(-1, 1),    0, 100),
    recovery: clamp(base.recovery + rand(-2, 2),    0, 100),
    steps:    clamp(base.steps    + rand(-50, 200), 0, 40000),
    calories: base.calories,
    vo2max:   base.vo2max,
    respRate: clamp(base.respRate + rand(-1, 1),   10, 30),
    stress:   clamp(base.stress   + rand(-3, 3),    0, 100),
    temp:     clamp(base.temp     + rand(-0.1, 0.1), 35, 38.5),
  };
}

/* Default (Normal Day) snapshot */
export const DEFAULT_SNAPSHOT: HealthSnapshot = {
  hrv:      107,
  hr:       56,
  spo2:     98,
  sleep:    6.2,
  strain:   45,
  recovery: 64,
  steps:    8432,
  calories: 1840,
  vo2max:   42,
  respRate: 16,
  stress:   35,
  temp:     36.4,
};

/* Scenario presets for demo */
export const PRESETS = {
  peak: {
    hrv: 132, hr: 44, spo2: 99, sleep: 7.8,
    strain: 72, recovery: 88,
    steps: 12500, calories: 2350, vo2max: 48,
    respRate: 14, stress: 15, temp: 36.1,
  } as HealthSnapshot,

  normal: DEFAULT_SNAPSHOT,

  rest: {
    hrv: 62, hr: 82, spo2: 96, sleep: 4.5,
    strain: 12, recovery: 28,
    steps: 2100, calories: 1180, vo2max: 38,
    respRate: 20, stress: 72, temp: 36.9,
  } as HealthSnapshot,
};

/* Generates synthetic 7-day HRV history ending with current value */
export function generateHRVHistory(currentHRV: number): number[] {
  const history: number[] = [];
  let v = currentHRV * 0.85;
  for (let i = 0; i < 6; i++) {
    v = clamp(v + rand(-10, 15), 60, 160);
    history.push(Math.round(v));
  }
  history.push(Math.round(currentHRV));
  return history;
}

/* Generates synthetic 7-day steps history */
export function generateStepsHistory(currentSteps: number): number[] {
  const history: number[] = [];
  for (let i = 0; i < 6; i++) {
    history.push(Math.round(clamp(currentSteps * 0.8 + rand(-2000, 3000), 500, 20000)));
  }
  history.push(currentSteps);
  return history;
}
