/* ── VitalCore Scoring Engine v2 ──
   Extended with more biometric vitals.
   All functions are pure and testable.
*/

export interface HealthSnapshot {
  hrv:      number;  // ms
  hr:       number;  // bpm
  spo2:     number;  // %
  sleep:    number;  // hours
  strain:   number;  // 0–100
  recovery: number;  // 0–100
  steps:    number;  // count per day
  calories: number;  // kcal burned
  vo2max:   number;  // mL/kg/min
  respRate: number;  // breaths/min
  stress:   number;  // 0–100 (higher = more stressed)
  temp:     number;  // °C skin temperature
}

export type StatusLevel = 'green' | 'amber' | 'red';

/* ── Recovery Score (0–100) ──
   Weighted: HRV 40%, RHR 25%, Sleep 25%, SpO2 10%
*/
export function calcRecovery(snap: HealthSnapshot, baselines: Partial<HealthSnapshot> = {}): number {
  const hrvBaseline  = baselines.hrv  ?? 100;
  const hrBaseline   = baselines.hr   ?? 60;
  const spo2Baseline = baselines.spo2 ?? 97;

  const hrvScore  = Math.min(100, (snap.hrv  / hrvBaseline)  * 100) * 0.40;
  const hrScore   = Math.min(100, (hrBaseline / snap.hr)     * 100) * 0.25;
  const sleepScore= Math.min(100, (snap.sleep / 8)           * 100) * 0.25;
  const spo2Score = Math.min(100, ((snap.spo2 - 85) / 15)   * 100) * 0.10;

  return Math.round(hrvScore + hrScore + sleepScore + spo2Score);
}

/* ── Sleep Score (0–100) ── */
export function calcSleepScore(hours: number): number {
  return Math.min(100, Math.round((hours / 8) * 100));
}

/* ── Strain Score — HR Zone model ──
   Returns 0–100 normalised from cardiovascular load
*/
export function calcStrain(
  zoneTimes: [number, number, number, number, number]
): number {
  const MULTIPLIERS = [0.5, 1.0, 2.0, 3.5, 5.0];
  const raw = zoneTimes.reduce((sum, t, i) => sum + t * MULTIPLIERS[i], 0);
  const maxRaw = 480 * 5;
  return Math.min(100, Math.round((raw / maxRaw) * 100 * 8));
}

/* ── Wellness Score (0–100) ──
   Holistic score combining all vitals.
   Recovery 35%, Sleep 25%, Stress 20%, Steps 10%, SpO2 10%
*/
export function calcWellnessScore(snap: HealthSnapshot): number {
  const recov  = snap.recovery * 0.35;
  const sleep  = Math.min(100, (snap.sleep / 8) * 100) * 0.25;
  const stress = (100 - snap.stress) * 0.20;
  const steps  = Math.min(100, (snap.steps / 10000) * 100) * 0.10;
  const spo2   = Math.min(100, ((snap.spo2 - 85) / 15) * 100) * 0.10;
  return Math.round(recov + sleep + stress + steps + spo2);
}

/* ── Wellness Label ── */
export function getWellnessLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Low';
  return 'Rest Now';
}

/* ── Status Level ── */
export function getStatusLevel(recovery: number): StatusLevel {
  if (recovery >= 67) return 'green';
  if (recovery >= 34) return 'amber';
  return 'red';
}

/* ── Status Label ── */
export function getStatusLabel(level: StatusLevel): string {
  return { green: 'READY TO PERFORM', amber: 'MODERATE DAY', red: 'REST REQUIRED' }[level];
}

/* ── Strain Target (based on recovery) ── */
export function getStrainTarget(recovery: number): string {
  if (recovery >= 67) return '70–85%';
  if (recovery >= 34) return '50–70%';
  return '< 30%';
}

/* ── Coaching Text ── */
export const COACHING: Record<StatusLevel, { text: string; tags: string[] }> = {
  green: {
    text: 'Recovery ดีเยี่ยม! HRV สูงกว่าเกณฑ์ ร่างกายพร้อมสำหรับการออกกำลังกายหนัก ฉวยโอกาสนี้ Push Strain ไปที่ 70–85%',
    tags: ['🏋️ Heavy Training', '⚡ Push Harder', '💪 PR Day'],
  },
  amber: {
    text: 'Recovery อยู่ในระดับดี ออกกำลังกายได้ระดับปานกลาง แนะนำ Strain 50–70% และนอนก่อน 23:00',
    tags: ['🏃 Moderate Training', '💤 Early Bedtime', '💧 Hydrate +500ml'],
  },
  red: {
    text: 'ร่างกายเหนื่อยล้าสูง Recovery ต่ำมาก วันนี้ควรพักผ่อนอย่างเต็มที่ Rest IS Training',
    tags: ['🛌 Full Rest Day', '🧘 Gentle Stretch Only', '😴 Sleep 8+ Hours'],
  },
};

/* ── HRV Trend data (mock 7D baseline) ── */
export const HRV_BASELINE_7D = [88, 92, 78, 105, 99, 112, 108];

/* ── Stress Level Label ── */
export function getStressLabel(stress: number): string {
  if (stress <= 25) return 'Calm';
  if (stress <= 50) return 'Low';
  if (stress <= 75) return 'Elevated';
  return 'High';
}

/* ── VO2 Max Category ── */
export function getVO2Category(vo2: number, age = 30): string {
  if (vo2 >= 55) return 'Superior';
  if (vo2 >= 47) return 'Excellent';
  if (vo2 >= 42) return 'Good';
  if (vo2 >= 36) return 'Fair';
  return 'Poor';
}
