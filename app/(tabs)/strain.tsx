import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RingChart } from '@/components/health/RingChart';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { getStrainTarget } from '@/lib/scoring';
import { useDemo } from '@/lib/DemoContext';

const ZONES = (maxHR: number) => [
  { name: 'Zone 1 — Warm-up',   range: `< ${Math.round(maxHR * 0.6)} bpm`,  time: '38m', pct: 55, color: Colors.blue   },
  { name: 'Zone 2 — Fat Burn',  range: `${Math.round(maxHR * 0.6)}–${Math.round(maxHR * 0.7)} bpm`, time: '52m', pct: 75, color: Colors.green  },
  { name: 'Zone 3 — Aerobic',   range: `${Math.round(maxHR * 0.7)}–${Math.round(maxHR * 0.8)} bpm`, time: '28m', pct: 40, color: Colors.amber  },
  { name: 'Zone 4 — Anaerobic', range: `${Math.round(maxHR * 0.8)}–${Math.round(maxHR * 0.9)} bpm`, time: '10m', pct: 15, color: Colors.red    },
  { name: 'Zone 5 — Max',       range: `> ${Math.round(maxHR * 0.9)} bpm`,  time: '6m',  pct:  8, color: Colors.red    },
];

function strainLabel(strain: number) {
  if (strain >= 80) return { text: 'All Out',  color: Colors.red   };
  if (strain >= 60) return { text: 'Strenuous', color: Colors.amber };
  if (strain >= 40) return { text: 'Moderate',  color: Colors.green };
  if (strain >= 20) return { text: 'Light',      color: Colors.blue  };
  return               { text: 'Rest',       color: Colors.muted2 };
}

export default function StrainScreen() {
  const { data } = useDemo();
  const maxHR    = 220 - 28; // assume age 28
  const zones    = ZONES(maxHR);
  const target   = getStrainTarget(data.recovery);
  const sl       = strainLabel(data.strain);
  const peakHR   = Math.round(data.hr * 2.8); // approximate peak from resting

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={s.title}>Strain</Text>

        {/* Big Ring */}
        <View style={s.bigRingWrap}>
          <RingChart value={data.strain} label="Strain" color="amber" size={190} strokeWidth={16} />
        </View>

        {/* Strain Level Badge */}
        <View style={[s.levelCard, { borderColor: sl.color + '44', backgroundColor: sl.color + '12' }]}>
          <Text style={[s.levelText, { color: sl.color }]}>{sl.text}</Text>
          <Text style={s.levelHint}>
            Target today: <Text style={{ color: Colors.amber, fontWeight: '700' }}>{target}</Text>
            {' '}based on {data.recovery}% recovery
          </Text>
        </View>

        {/* Pills */}
        <View style={s.pillRow}>
          {[
            { icon: '⏱️', val: '2h 14m',           key: 'Duration',   color: Colors.text  },
            { icon: '🔥', val: `${data.calories} kJ`, key: 'Energy',   color: Colors.amber },
            { icon: '💓', val: `${peakHR} bpm`,     key: 'Peak HR',    color: Colors.red   },
            { icon: '📍', val: '1',                  key: 'Activities', color: Colors.text  },
          ].map(p => (
            <View key={p.key} style={s.pill}>
              <Text style={s.pillIcon}>{p.icon}</Text>
              <Text style={[s.pillVal, { color: p.color }]}>{p.val}</Text>
              <Text style={s.pillKey}>{p.key}</Text>
            </View>
          ))}
        </View>

        {/* Coaching */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>AI Coaching</Text>
          <Text style={s.coachTxt}>
            {data.recovery >= 67
              ? 'ร่างกายพร้อมเต็มที่! วันนี้เหมาะสำหรับ High Intensity Training แนะนำ Strain '
              : data.recovery >= 34
              ? 'ร่างกายพร้อมสำหรับการออกกำลังกายระดับปานกลาง แนะนำ Strain '
              : 'ร่างกายต้องการพักผ่อน — จำกัด Strain ไว้ที่ '}
            <Text style={{ color: Colors.amber, fontWeight: '700' }}>{target}</Text>
            {' '}เพื่อพัฒนาความฟิตอย่างยั่งยืน
          </Text>
        </View>

        {/* HR Zones */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>Heart Rate Zones</Text>
          <View style={s.zoneList}>
            {zones.map(z => (
              <View key={z.name} style={s.zoneItem}>
                <View style={s.zoneInfo}>
                  <Text style={s.zoneName}>{z.name}</Text>
                  <Text style={s.zoneRange}>{z.range}</Text>
                </View>
                <View style={s.zoneBarTrack}>
                  <View style={[s.zoneBarFill, { width: `${z.pct}%`, backgroundColor: z.color }]} />
                </View>
                <Text style={[s.zoneTime, { color: z.color }]}>{z.time}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Strain vs Recovery Matrix */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>Load Balance</Text>
          <View style={s.matrixRow}>
            <View style={s.matrixCell}>
              <Text style={s.matrixIcon}>⚡</Text>
              <Text style={[s.matrixVal, { color: Colors.amber }]}>{data.strain}%</Text>
              <Text style={s.matrixLabel}>Today's Strain</Text>
            </View>
            <View style={[s.matrixDivider]} />
            <View style={s.matrixCell}>
              <Text style={s.matrixIcon}>📈</Text>
              <Text style={[s.matrixVal, { color: Colors.green }]}>{data.recovery}%</Text>
              <Text style={s.matrixLabel}>Recovery</Text>
            </View>
            <View style={[s.matrixDivider]} />
            <View style={s.matrixCell}>
              <Text style={s.matrixIcon}>⚖️</Text>
              <Text style={[s.matrixVal, {
                color: Math.abs(data.strain - data.recovery) < 20 ? Colors.green : Colors.amber,
              }]}>
                {Math.abs(data.strain - data.recovery) < 20 ? 'Balanced' : 'Adjust'}
              </Text>
              <Text style={s.matrixLabel}>Balance</Text>
            </View>
          </View>
        </View>

        {/* Weekly Strain Trend */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>Weekly Strain Trend</Text>
          <View style={s.chartBars}>
            {[42, 68, 35, 78, 55, 22, data.strain].map((v, i) => {
              const isToday = i === 6;
              const h = (v / 100) * 80;
              return (
                <View key={i} style={s.barWrap}>
                  <View style={[s.bar, {
                    height: h,
                    backgroundColor: isToday ? Colors.amber : Colors.surface2,
                    borderWidth: isToday ? 0 : 1,
                    borderColor: Colors.border,
                  }]} />
                  <Text style={[s.barLabel, { color: isToday ? Colors.amber : Colors.muted }]}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'T'][i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  scroll:      { padding: Spacing.lg, paddingBottom: 40, gap: 16 },
  title:       { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  bigRingWrap: { alignItems: 'center', paddingVertical: 8 },

  levelCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.md, padding: 16, borderWidth: 1, gap: 12 },
  levelText: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5, minWidth: 90 },
  levelHint: { flex: 1, fontSize: 13, color: Colors.muted2, lineHeight: 20 },

  pillRow:     { flexDirection: 'row', gap: 8 },
  pill:        { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 4 },
  pillIcon:    { fontSize: 16 },
  pillVal:     { fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
  pillKey:     { fontSize: 9, color: Colors.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center' },

  panel:       { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 20, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  panelTitle:  { fontSize: 14, fontWeight: '700', color: Colors.text },
  coachTxt:    { fontSize: 14, color: Colors.muted2, lineHeight: 22 },

  zoneList:    { gap: 10 },
  zoneItem:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  zoneInfo:    { width: 140 },
  zoneName:    { fontSize: 12, color: Colors.text, fontWeight: '600' },
  zoneRange:   { fontSize: 10, color: Colors.muted, marginTop: 1 },
  zoneBarTrack:{ flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  zoneBarFill: { height: '100%', borderRadius: 4 },
  zoneTime:    { fontSize: 12, fontWeight: '700', width: 32, textAlign: 'right' },

  matrixRow:    { flexDirection: 'row', alignItems: 'center' },
  matrixCell:   { flex: 1, alignItems: 'center', gap: 4 },
  matrixDivider:{ width: 1, height: 50, backgroundColor: Colors.border },
  matrixIcon:   { fontSize: 20 },
  matrixVal:    { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  matrixLabel:  { fontSize: 10, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.4 },

  chartBars:   { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 5 },
  barWrap:     { flex: 1, alignItems: 'center', gap: 4 },
  bar:         { width: '100%', borderRadius: 4 },
  barLabel:    { fontSize: 10 },
});
