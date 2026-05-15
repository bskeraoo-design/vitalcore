import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TouchableOpacity, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RingChart } from '@/components/health/RingChart';
import { MetricCard } from '@/components/health/MetricCard';
import { StatusBadge } from '@/components/health/StatusBadge';
import { CoachingCard } from '@/components/health/CoachingCard';
import { WellnessGauge } from '@/components/health/WellnessGauge';
import { Colors, Spacing, Radius } from '@/constants/theme';
import {
  getStatusLevel, getStatusLabel, COACHING,
  calcWellnessScore, getWellnessLabel, getStressLabel, getVO2Category,
} from '@/lib/scoring';
import { useDemo } from '@/lib/DemoContext';

const MISSIONS = [
  { id: 'm1', text: '🌅 Morning Stretch (5 min)', xp: '+10 XP' },
  { id: 'm2', text: '💧 Drink 500ml Water',        xp: '+5 XP'  },
  { id: 'm3', text: '🚶 Walk 10 Minutes',           xp: '+15 XP' },
  { id: 'm4', text: '🧘 Meditation (5 min)',        xp: '+10 XP' },
  { id: 'm5', text: '📵 No Screen 1hr Before Bed', xp: '+20 XP' },
  { id: 'm6', text: '🌙 Sleep Before 23:00',        xp: '+25 XP' },
];

export default function TodayScreen() {
  const router   = useRouter();
  const { data } = useDemo();

  const level    = getStatusLevel(data.recovery);
  const coaching = COACHING[level];
  const wellness = calcWellnessScore(data);
  const wellnessLabel = getWellnessLabel(wellness);

  const [done, setDone]           = useState<Record<string, boolean>>({});
  const [postureShown, setPosture] = useState(true);
  const completedCount = Object.values(done).filter(Boolean).length;
  const toggle = (id: string) =>
    setDone(prev => ({ ...prev, [id]: !prev[id] }));

  const goRecovery = () => router.push('/(tabs)/recovery' as any);
  const goSleep    = () => router.push('/(tabs)/sleep' as any);
  const goStrain   = () => router.push('/(tabs)/strain' as any);

  const stressLabel = getStressLabel(data.stress);
  const vo2Cat      = getVO2Category(data.vo2max);
  const sleepPct    = Math.round((data.sleep / 8) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, Akmal 👋</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <StatusBadge level={level} label={getStatusLabel(level)} />
        </View>

        {/* ── Wellness Score Gauge ── */}
        <View style={styles.gaugeCard}>
          <WellnessGauge
            score={wellness}
            label={wellnessLabel}
            delta={wellness >= 70 ? 'You\'re doing great — keep it up!' : 'Focus on sleep & recovery'}
          />
          <Text style={styles.gaugeHint}>Overall health score across all vitals</Text>
        </View>

        {/* ── Triple Rings ── */}
        <View style={styles.ringRow}>
          <Pressable style={styles.ringCard} onPress={() => router.push('/(tabs)/recovery' as any)}>
            <RingChart value={data.recovery} label="Recovery" color="green" size={88} />
            <Text style={styles.ringMeta}>HRV {data.hrv}ms</Text>
          </Pressable>
          <Pressable style={styles.ringCard} onPress={() => router.push('/(tabs)/sleep' as any)}>
            <RingChart value={sleepPct} label="Sleep" color="blue" size={88} />
            <Text style={styles.ringMeta}>{data.sleep}h</Text>
          </Pressable>
          <Pressable style={styles.ringCard} onPress={() => router.push('/(tabs)/strain' as any)}>
            <RingChart value={data.strain} label="Strain" color="amber" size={88} />
            <Text style={styles.ringMeta}>Target: {data.strain < 50 ? '50–70%' : '70–85%'}</Text>
          </Pressable>
        </View>

        {/* ── AI Coaching ── */}
        <CoachingCard text={coaching.text} tags={coaching.tags} status="live" />

        {/* ── Health Monitor ── */}
        <Text style={styles.sectionLabel}>HEALTH MONITOR</Text>

        <View style={styles.metricsGrid}>
          <MetricCard
            icon="📊" value={`${data.hrv} ms`}
            label="HRV" color={Colors.green}
            trend={data.hrv >= 100 ? '↑ Above avg' : '↓ Below avg'}
            trendDir={data.hrv >= 100 ? 'up' : 'down'}
            onPress={goRecovery}
          />
          <MetricCard
            icon="❤️" value={`${data.hr} bpm`}
            label="Resting HR" color={Colors.red}
            trend={data.hr <= 60 ? '↓ Optimal' : '↑ Elevated'}
            trendDir={data.hr <= 60 ? 'up' : 'down'}
            onPress={goRecovery}
          />
          <MetricCard
            icon="🫁" value={`${data.spo2}%`}
            label="SpO₂" color={Colors.blue}
            trend={data.spo2 >= 97 ? '→ Normal' : '⚠ Low'}
            trendDir={data.spo2 >= 97 ? 'flat' : 'down'}
            onPress={goRecovery}
          />
          <MetricCard
            icon="🩺" value="118/76"
            label="Blood Pressure" color={Colors.purple}
            trend="Optimal" trendDir="up"
            onPress={goRecovery}
          />
          <MetricCard
            icon="👟" value={data.steps.toLocaleString()}
            label="Steps Today" color={Colors.amber}
            trend={data.steps >= 10000 ? '🎯 Goal hit!' : `${(10000 - data.steps).toLocaleString()} to go`}
            trendDir={data.steps >= 10000 ? 'up' : 'flat'}
            onPress={goStrain}
          />
          <MetricCard
            icon="🔥" value={`${data.calories} kcal`}
            label="Calories Burned" color={Colors.amber}
            trend="Active day" trendDir="up"
            onPress={goStrain}
          />
          <MetricCard
            icon="🫀" value={`${data.vo2max} ml/kg`}
            label="VO₂ Max" color={Colors.green}
            trend={vo2Cat} trendDir="up"
            onPress={goRecovery}
          />
          <MetricCard
            icon="🌬️" value={`${data.respRate} /min`}
            label="Resp Rate" color={Colors.muted2}
            trend={data.respRate <= 16 ? '→ Normal' : '↑ Elevated'}
            trendDir={data.respRate <= 16 ? 'flat' : 'down'}
            onPress={goRecovery}
          />
          <MetricCard
            icon="🧠" value={`${data.stress}%`}
            label="Stress Score" color={data.stress > 60 ? Colors.red : data.stress > 35 ? Colors.amber : Colors.green}
            trend={stressLabel}
            trendDir={data.stress > 50 ? 'down' : 'up'}
            onPress={goRecovery}
          />
          <MetricCard
            icon="🌡️" value={`${data.temp}°C`}
            label="Skin Temp" color={Colors.muted2}
            trend={data.temp >= 37.5 ? '↑ Elevated' : '→ Normal'}
            trendDir={data.temp >= 37.5 ? 'down' : 'flat'}
            onPress={goRecovery}
          />
        </View>

        {/* ── Body Battery ── */}
        <View style={styles.batteryCard}>
          <View style={styles.batteryRow}>
            <Text style={styles.batteryLabel}>⚡ Body Battery</Text>
            <Text style={[styles.batteryVal, { color: Colors.green }]}>{Math.round(data.recovery * 0.9)}%</Text>
          </View>
          <View style={styles.batteryTrack}>
            <View style={[styles.batteryFill, {
              width: `${data.recovery * 0.9}%` as any,
              backgroundColor: data.recovery > 60 ? Colors.green : data.recovery > 30 ? Colors.amber : Colors.red,
            }]} />
          </View>
          <Text style={styles.batteryHint}>
            {data.recovery > 60
              ? 'Charged and ready — great day for activity!'
              : data.recovery > 30
              ? 'Moderate energy — pace yourself today'
              : 'Low energy — prioritise rest and recovery'}
          </Text>
        </View>

        {/* ── Daily Mission ── */}
        <View style={styles.missionCard}>
          <View style={styles.missionHeader}>
            <Text style={styles.sectionLabel}>DAILY MISSION 🎯</Text>
            <Text style={styles.missionCount}>{completedCount}/{MISSIONS.length}</Text>
          </View>
          <View style={styles.missionBarTrack}>
            <View style={[styles.missionBarFill, { width: `${(completedCount / MISSIONS.length) * 100}%` as any }]} />
          </View>
          {MISSIONS.map(m => (
            <TouchableOpacity key={m.id} style={styles.missionItem} onPress={() => toggle(m.id)} activeOpacity={0.7}>
              <View style={[styles.missionCb, done[m.id] && styles.missionCbDone]}>
                {done[m.id] && <Text style={styles.missionTick}>✓</Text>}
              </View>
              <Text style={[styles.missionText, done[m.id] && styles.missionTextDone]}>{m.text}</Text>
              <Text style={styles.missionXp}>{m.xp}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Posture Alert ── */}
        {postureShown && (
          <View style={styles.ergoCard}>
            <Text style={styles.ergoTitle}>🪑 Posture Alert</Text>
            <Text style={styles.ergoSub}>นั่งต่อเนื่อง 2h 30m — เสี่ยงปวดหลัง</Text>
            <Pressable style={styles.ergoBtn} onPress={() => setPosture(false)}>
              <Text style={styles.ergoBtnText}>ลุกเดิน 5 นาที ✓</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingBottom: 40, gap: 16 },

  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting:  { fontSize: 26, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  date:      { fontSize: 13, color: Colors.muted2, marginTop: 3 },

  gaugeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  gaugeHint: { fontSize: 11, color: Colors.muted, textAlign: 'center' },

  ringRow:     { flexDirection: 'row', gap: 10 },
  ringCard:    {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  ringMeta:    { fontSize: 10, color: Colors.muted2, fontWeight: '600', textAlign: 'center' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel:  { fontSize: 11, fontWeight: '700', color: Colors.muted2, letterSpacing: 1, textTransform: 'uppercase' },
  liveChip:      { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,207,168,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,207,168,0.2)' },
  liveDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  liveText:      { fontSize: 11, fontWeight: '700', color: Colors.green },

  metricsGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  batteryCard:   { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 8 },
  batteryRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  batteryLabel:  { fontSize: 14, fontWeight: '700', color: Colors.text },
  batteryVal:    { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  batteryTrack:  { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  batteryFill:   { height: '100%', borderRadius: 4 },
  batteryHint:   { fontSize: 12, color: Colors.muted2, lineHeight: 18 },

  missionCard:    { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  missionHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionCount:   { fontSize: 12, fontWeight: '700', color: Colors.green },
  missionBarTrack:{ height: 5, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  missionBarFill: { height: '100%', backgroundColor: Colors.green, borderRadius: 3 },
  missionItem:    { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: Colors.surface2, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  missionCb:      { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  missionCbDone:  { backgroundColor: Colors.green, borderColor: Colors.green },
  missionTick:    { fontSize: 12, color: Colors.bg, fontWeight: '700' },
  missionText:    { flex: 1, fontSize: 13, fontWeight: '500', color: Colors.text },
  missionTextDone:{ textDecorationLine: 'line-through', color: Colors.muted },
  missionXp:      { fontSize: 11, fontWeight: '700', color: Colors.amber },

  ergoCard:   { backgroundColor: Colors.amberDim, borderRadius: Radius.md, padding: 16, borderWidth: 1, borderColor: 'rgba(255,107,74,0.3)', gap: 6 },
  ergoTitle:  { fontSize: 14, fontWeight: '700', color: Colors.amber },
  ergoSub:    { fontSize: 13, color: Colors.muted2 },
  ergoBtn:    { backgroundColor: Colors.amber, borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 4 },
  ergoBtnText:{ fontSize: 13, fontWeight: '700', color: '#0C0A1A' },
});
