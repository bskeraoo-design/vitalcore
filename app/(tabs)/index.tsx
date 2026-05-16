import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RingChart } from '@/components/health/RingChart';
import { MetricCard } from '@/components/health/MetricCard';
import { StatusBadge } from '@/components/health/StatusBadge';
import { CoachingCard } from '@/components/health/CoachingCard';
import { WellnessGauge } from '@/components/health/WellnessGauge';
import { Spacing, Radius } from '@/constants/theme';
import { useColors } from '@/hooks/use-app-colors';
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

function EnergyBar({ pct, color }: { pct: number; color: string }) {
  const C = useColors();
  const total = 20;
  const filled = Math.round((pct / 100) * total);
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 14,
            borderRadius: 2,
            backgroundColor: i < filled ? color : C.border,
            opacity: i < filled ? 1 : 0.45,
          }}
        />
      ))}
    </View>
  );
}

export default function TodayScreen() {
  const router   = useRouter();
  const { data } = useDemo();
  const C        = useColors();

  const level         = getStatusLevel(data.recovery);
  const coaching      = COACHING[level];
  const wellness      = calcWellnessScore(data);
  const wellnessLabel = getWellnessLabel(wellness);
  const stressLabel   = getStressLabel(data.stress);
  const vo2Cat        = getVO2Category(data.vo2max);
  const sleepPct      = Math.round((data.sleep / 8) * 100);
  const stressColor   = data.stress > 60 ? C.red : data.stress > 35 ? C.amber : C.green;
  const energyPct     = Math.round(data.recovery * 0.9);
  const batteryColor  = data.recovery > 60 ? C.green : data.recovery > 30 ? C.amber : C.red;

  const stressHigh = Math.min(100, Math.round(data.stress * 1.4));
  const stressLow  = Math.max(0,   Math.round(data.stress * 0.25));

  const [done, setDone]            = useState<Record<string, boolean>>({});
  const [postureShown, setPosture] = useState(true);
  const completedCount = Object.values(done).filter(Boolean).length;
  const toggle = (id: string) => setDone(prev => ({ ...prev, [id]: !prev[id] }));

  const goRecovery = () => router.push('/(tabs)/recovery' as any);
  const goSleep    = () => router.push('/(tabs)/sleep' as any);
  const goStrain   = () => router.push('/(tabs)/strain' as any);

  /* sparkline data (7-day, last = today) */
  const hrv7  = [88, 92, 78, 105, 99, 112, data.hrv];
  const hr7   = [62, 65, 68, 64,  61, 63,  data.hr];
  const spo7  = [98, 97, 98, 96,  97, 98,  data.spo2];
  const resp7 = [16, 17, 18, 16,  17, 16,  data.respRate];
  const vo7   = [44, 45, 44, 46,  45, 47,  data.vo2max];
  const str7  = [40, 65, 35, 72,  52, 22,  data.strain];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={[s.greeting, { color: C.text }]}>Hi, Akmal 👋</Text>
            <Text style={[s.date, { color: C.muted2 }]}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <StatusBadge level={level} label={getStatusLabel(level)} />
        </View>

        {/* Wellness Gauge */}
        <View style={[s.gaugeCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <WellnessGauge
            score={wellness}
            label={wellnessLabel}
            delta={wellness >= 70 ? 'You\'re doing great — keep it up!' : 'Focus on sleep & recovery'}
          />
          <Text style={[s.gaugeHint, { color: C.muted }]}>Overall health score across all vitals</Text>
        </View>

        {/* Triple Rings */}
        <View style={s.ringRow}>
          <Pressable style={[s.ringCard, { backgroundColor: C.surface, borderColor: C.border }]} onPress={goRecovery}>
            <RingChart value={data.recovery} label="Recovery" color="green" size={88} />
            <Text style={[s.ringMeta, { color: C.muted2 }]}>HRV {data.hrv}ms</Text>
          </Pressable>
          <Pressable style={[s.ringCard, { backgroundColor: C.surface, borderColor: C.border }]} onPress={goSleep}>
            <RingChart value={sleepPct} label="Sleep" color="blue" size={88} />
            <Text style={[s.ringMeta, { color: C.muted2 }]}>{data.sleep}h</Text>
          </Pressable>
          <Pressable style={[s.ringCard, { backgroundColor: C.surface, borderColor: C.border }]} onPress={goStrain}>
            <RingChart value={data.strain} label="Strain" color="amber" size={88} />
            <Text style={[s.ringMeta, { color: C.muted2 }]}>Target: {data.strain < 50 ? '50–70%' : '70–85%'}</Text>
          </Pressable>
        </View>

        {/* Stress & Energy — Garmin-style */}
        <View style={[s.seCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.seTopRow}>
            <View style={s.seLeft}>
              <View style={s.seLiveRow}>
                <View style={[s.seLiveDot, { backgroundColor: C.green }]} />
                <Text style={[s.seLiveLabel, { color: C.text }]}>Today's stress</Text>
              </View>
              <Text style={[s.seUpdated, { color: C.muted2 }]}>Last updated at 16:12</Text>
              <View style={s.seNumbers}>
                <View>
                  <Text style={[s.seNumVal, { color: C.red }]}>{stressHigh}</Text>
                  <Text style={[s.seNumKey, { color: C.muted }]}>Highest</Text>
                </View>
                <View>
                  <Text style={[s.seNumVal, { color: C.green }]}>{stressLow}</Text>
                  <Text style={[s.seNumKey, { color: C.muted }]}>Lowest</Text>
                </View>
                <View>
                  <Text style={[s.seNumVal, { color: C.amber }]}>{data.stress}</Text>
                  <Text style={[s.seNumKey, { color: C.muted }]}>Average</Text>
                </View>
              </View>
            </View>
            <View style={[s.seGaugeWrap, { borderColor: `${stressColor}60`, backgroundColor: `${stressColor}10` }]}>
              <Text style={[s.seGaugeVal, { color: stressColor }]}>{data.stress}</Text>
              <Text style={[s.seGaugeLabel, { color: C.muted2 }]}>
                {data.stress <= 25 ? 'Low' : data.stress <= 50 ? 'Moderate' : 'High'}
              </Text>
            </View>
          </View>
          <View style={[s.seDivider, { backgroundColor: C.border }]} />
          <View style={s.seEnergyRow}>
            <Text style={s.seEnergyIcon}>⚡</Text>
            <View style={{ flex: 1 }}>
              <EnergyBar pct={energyPct} color={batteryColor} />
            </View>
            <Text style={[s.seEnergyPct, { color: C.text }]}>{energyPct}%</Text>
          </View>
        </View>

        {/* AI Coaching */}
        <CoachingCard text={coaching.text} tags={coaching.tags} status="live" />

        {/* Health Monitor */}
        <Text style={[s.sectionLabel, { color: C.muted2 }]}>HEALTH MONITOR</Text>

        <View style={s.metricsGrid}>
          <MetricCard icon="📊" value={`${data.hrv} ms`}           label="HRV"            color={C.green}
            trend={data.hrv >= 100 ? '↑ Above avg' : '↓ Below avg'} trendDir={data.hrv >= 100 ? 'up' : 'down'}
            sparkData={hrv7} onPress={goRecovery} />
          <MetricCard icon="❤️" value={`${data.hr} bpm`}           label="Resting HR"     color={C.red}
            trend={data.hr <= 60 ? '↓ Optimal' : '↑ Elevated'} trendDir={data.hr <= 60 ? 'up' : 'down'}
            sparkData={hr7} onPress={goRecovery} />
          <MetricCard icon="🫁" value={`${data.spo2}%`}            label="SpO₂"           color={C.blue}
            trend={data.spo2 >= 97 ? '→ Normal' : '⚠ Low'} trendDir={data.spo2 >= 97 ? 'flat' : 'down'}
            sparkData={spo7} onPress={goRecovery} />
          <MetricCard icon="🩺" value="118/76"                     label="Blood Pressure"  color={C.purple}
            trend="Optimal" trendDir="up" onPress={goRecovery} />
          <MetricCard icon="👟" value={data.steps.toLocaleString()} label="Steps Today"    color={C.amber}
            trend={data.steps >= 10000 ? '🎯 Goal hit!' : `${(10000 - data.steps).toLocaleString()} to go`}
            trendDir={data.steps >= 10000 ? 'up' : 'flat'} onPress={goStrain} />
          <MetricCard icon="🔥" value={`${data.calories} kcal`}   label="Calories"        color={C.amber}
            trend="Active day" trendDir="up" onPress={goStrain} />
          <MetricCard icon="🫀" value={`${data.vo2max} ml/kg`}    label="VO₂ Max"         color={C.green}
            trend={vo2Cat} trendDir="up" sparkData={vo7} onPress={goRecovery} />
          <MetricCard icon="🌬️" value={`${data.respRate} /min`}   label="Resp Rate"       color={C.muted2}
            trend={data.respRate <= 16 ? '→ Normal' : '↑ Elevated'} trendDir={data.respRate <= 16 ? 'flat' : 'down'}
            sparkData={resp7} onPress={goRecovery} />
          <MetricCard icon="🧠" value={`${data.stress}%`}         label="Stress Score"    color={stressColor}
            trend={stressLabel} trendDir={data.stress > 50 ? 'down' : 'up'} onPress={goRecovery} />
          <MetricCard icon="🌡️" value={`${data.temp}°C`}          label="Skin Temp"       color={C.muted2}
            trend={data.temp >= 37.5 ? '↑ Elevated' : '→ Normal'} trendDir={data.temp >= 37.5 ? 'down' : 'flat'}
            onPress={goRecovery} />
        </View>

        {/* Daily Mission */}
        <View style={[s.missionCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.missionHeader}>
            <Text style={[s.sectionLabel, { color: C.muted2 }]}>DAILY MISSION 🎯</Text>
            <Text style={[s.missionCount, { color: C.green }]}>{completedCount}/{MISSIONS.length}</Text>
          </View>
          <View style={[s.missionBarTrack, { backgroundColor: C.border }]}>
            <View style={[s.missionBarFill, { width: `${(completedCount / MISSIONS.length) * 100}%` as any, backgroundColor: C.green }]} />
          </View>
          {MISSIONS.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[s.missionItem, { backgroundColor: C.surface2, borderColor: C.border }]}
              onPress={() => toggle(m.id)}
              activeOpacity={0.7}
            >
              <View style={[s.missionCb, { borderColor: C.border }, done[m.id] && { backgroundColor: C.green, borderColor: C.green }]}>
                {done[m.id] && <Text style={[s.missionTick, { color: C.bg }]}>✓</Text>}
              </View>
              <Text style={[s.missionText, { color: C.text }, done[m.id] && { textDecorationLine: 'line-through', color: C.muted }]}>
                {m.text}
              </Text>
              <Text style={[s.missionXp, { color: C.amber }]}>{m.xp}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Posture Alert */}
        {postureShown && (
          <View style={[s.ergoCard, { backgroundColor: C.amberDim, borderColor: `${C.amber}50` }]}>
            <Text style={[s.ergoTitle, { color: C.amber }]}>🪑 Posture Alert</Text>
            <Text style={[s.ergoSub, { color: C.muted2 }]}>นั่งต่อเนื่อง 2h 30m — เสี่ยงปวดหลัง</Text>
            <Pressable style={[s.ergoBtn, { backgroundColor: C.amber }]} onPress={() => setPosture(false)}>
              <Text style={[s.ergoBtnText, { color: C.bg }]}>ลุกเดิน 5 นาที ✓</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1 },
  scroll:  { padding: Spacing.lg, paddingBottom: 40, gap: 16 },

  header:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  date:     { fontSize: 13, marginTop: 3 },

  gaugeCard: { borderRadius: Radius.lg, padding: 20, alignItems: 'center', borderWidth: 1, gap: 4 },
  gaugeHint: { fontSize: 11, textAlign: 'center' },

  ringRow:  { flexDirection: 'row', gap: 10 },
  ringCard: { flex: 1, borderRadius: Radius.md, padding: 14, alignItems: 'center', borderWidth: 1, gap: 8 },
  ringMeta: { fontSize: 10, fontWeight: '600', textAlign: 'center' },

  seCard:      { borderRadius: Radius.md, padding: 16, borderWidth: 1, gap: 10 },
  seTopRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  seLeft:      { flex: 1, gap: 6 },
  seLiveRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  seLiveDot:   { width: 8, height: 8, borderRadius: 4 },
  seLiveLabel: { fontSize: 14, fontWeight: '700' },
  seUpdated:   { fontSize: 11 },
  seNumbers:   { flexDirection: 'row', gap: 20, marginTop: 2 },
  seNumVal:    { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  seNumKey:    { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  seGaugeWrap: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  seGaugeVal:  { fontSize: 22, fontWeight: '900', letterSpacing: -1 },
  seGaugeLabel:{ fontSize: 10, fontWeight: '600' },
  seDivider:   { height: 1 },
  seEnergyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  seEnergyIcon:{ fontSize: 18 },
  seEnergyPct: { fontSize: 14, fontWeight: '800', minWidth: 36, textAlign: 'right' },

  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  missionCard:     { borderRadius: Radius.md, padding: 16, borderWidth: 1, gap: 10 },
  missionHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionCount:    { fontSize: 12, fontWeight: '700' },
  missionBarTrack: { height: 5, borderRadius: 3, overflow: 'hidden' },
  missionBarFill:  { height: '100%', borderRadius: 3 },
  missionItem:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, borderWidth: 1 },
  missionCb:       { width: 22, height: 22, borderRadius: 7, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  missionTick:     { fontSize: 12, fontWeight: '700' },
  missionText:     { flex: 1, fontSize: 13, fontWeight: '500' },
  missionXp:       { fontSize: 11, fontWeight: '700' },

  ergoCard:    { borderRadius: Radius.md, padding: 16, borderWidth: 1, gap: 6 },
  ergoTitle:   { fontSize: 14, fontWeight: '700' },
  ergoSub:     { fontSize: 13 },
  ergoBtn:     { borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 4 },
  ergoBtnText: { fontSize: 13, fontWeight: '700' },
});
