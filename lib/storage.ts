import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthSnapshot } from './scoring';

const KEYS = {
  user:         'vc_user',
  healthData:   'vc_health_data',
  mission:      'vc_mission',
  missionDate:  'vc_mission_date',
  baselines:    'vc_baselines',
} as const;

export interface UserProfile {
  name:   string;
  email:  string;
  avatar: string;
  method: 'google' | 'email';
}

/* ── User ── */
export async function saveUser(user: UserProfile) {
  await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
}
export async function loadUser(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.user);
  return raw ? JSON.parse(raw) : null;
}
export async function clearUser() {
  await AsyncStorage.removeItem(KEYS.user);
}

/* ── Health Snapshot ── */
export async function saveHealthData(snap: HealthSnapshot) {
  await AsyncStorage.setItem(KEYS.healthData, JSON.stringify({ ...snap, savedAt: Date.now() }));
}
export async function loadHealthData(): Promise<HealthSnapshot | null> {
  const raw = await AsyncStorage.getItem(KEYS.healthData);
  return raw ? JSON.parse(raw) : null;
}

/* ── Daily Mission ── */
export async function saveMission(completed: Record<string, boolean>) {
  const today = new Date().toDateString();
  await AsyncStorage.setItem(KEYS.missionDate, today);
  await AsyncStorage.setItem(KEYS.mission, JSON.stringify(completed));
}
export async function loadMission(): Promise<Record<string, boolean>> {
  const savedDate = await AsyncStorage.getItem(KEYS.missionDate);
  const today     = new Date().toDateString();
  if (savedDate !== today) {
    await AsyncStorage.setItem(KEYS.missionDate, today);
    await AsyncStorage.setItem(KEYS.mission, '{}');
    return {};
  }
  const raw = await AsyncStorage.getItem(KEYS.mission);
  return raw ? JSON.parse(raw) : {};
}

/* ── Baselines (30-day rolling averages) ── */
export async function saveBaselines(baselines: Partial<HealthSnapshot>) {
  await AsyncStorage.setItem(KEYS.baselines, JSON.stringify(baselines));
}
export async function loadBaselines(): Promise<Partial<HealthSnapshot>> {
  const raw = await AsyncStorage.getItem(KEYS.baselines);
  return raw ? JSON.parse(raw) : { hrv: 100, hr: 60, spo2: 97 };
}
