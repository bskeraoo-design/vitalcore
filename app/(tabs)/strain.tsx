import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RingChart } from '@/components/health/RingChart';
import { Spacing, Radius } from '@/constants/theme';
import { useColors } from '@/hooks/use-app-colors';
import { getStrainTarget } from '@/lib/scoring';
import { useDemo } from '@/lib/DemoContext';

export default function StrainScreen() {
  const { data } = useDemo();
  const C        = useColors();
  const maxHR    = 220 - 28;
  const target   = getStrainTarget(data.recovery);
  const peakHR   = Math.round(data.hr * 2.8);

  const zones = [
    { name: 'Zone 1 — Warm-up',   range: `< ${Math.round(maxHR * 0.6)} bpm`,  time: '38m', pct: 55, color: C.blue   },
    { name: 'Zone 2 — Fat Burn',  range: `${Math.round(maxHR * 0.6)}–${Math.round(maxHR * 0.7)} bpm`, time: '52m', pct: 75, color: C.green  },
    { name: 'Zone 3 — Aerobic',   range: `${Math.round(maxHR * 0.7)}–${Math.round(maxHR * 0.8)} bpm`, time: '28m', pct: 40, color: C.amber  },
    { name: 'Zone 4 — Anaerobic', range: `${Math.round(maxHR * 0.8)}–${Math.round(maxHR * 0.9)} bpm`, time: '10m', pct: 15, color: C.red    },
    { name: 'Zone 5 — Max',       range: `> ${Math.round(maxHR * 0.9)} bpm`,  time: '6m',  pct:  8, color: C.red    },
  ];

  const sl = data.strain >= 80 ? { text: 'All Out',   color: C.red    }
           : data.strain >= 60 ? { text: 'Strenuous',  color: C.amber  }
           : data.strain >= 40 ? { text: 'Moderate',   color: C.green  }
           : data.strain >= 20 ? { text: 'Light',      color: C.blue   }
           :                     { text: 'Rest',       color: C.muted2 };

  const balanceColor = Math.abs(data.strain - data.recovery) < 20 ? C.green : C.amber;
  const balanceText  = Math.abs(data.strain - data.recovery) < 20 ? 'Balanced' : 'Adjust';

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={[s.title, { color: C.text }]}>Strain</Text>

        <View style={s.bigRingWrap}>
          <RingChart value={data.strain} label="Strain" color="amber" size={190} strokeWidth={16} />
        </View>

        <View style={[s.levelCard, { borderColor: `${sl.color}44`, backgroundColor: `${sl.color}12` }]}>
          <Text style={[s.levelText, { color: sl.color }]}>{sl.text}</Text>
          <Text style={[s.levelHint, { color: C.muted2 }]}>
            Target today: <Text style={{ color: C.amber, fontWeight: '700' }}>{target}</Text>
            {' '}based on {data.recovery}% recovery
          </Text>
        </View>

        <View style={s.pillRow}>
          {[
            { icon: '⏱️', val: '2h 14m',             key: 'Duration',   color: C.text  },
            { icon: '🔥', val: `${data.calories} kJ`, key: 'Energy',     color: C.amber },
            { icon: '💓', val: `${peakHR} bpm`,       key: 'Peak HR',    color: C.red   },
            { icon: '📍', val: '1',                    key: 'Activities', color: C.text  },
          ].map(p => (
            <View key={p.key} style={[s.pill, { backgroundColor: C.surface, borderColor: C.border }]}>
              <Text style={s.pillIcon}>{p.icon}</Text>
              <Text style={[s.pillVal, { color: p.color }]}>{p.val}</Text>
              <Text style={[s.pillKey, { color: C.muted }]}>{p.key}</Text>
            </View>
          ))}
        </View>

        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>AI Coaching</Text>
          <Text style={[s.coachTxt, { color: C.muted2 }]}>
            {data.recovery >= 67
              ? 'ร่างกายพร้อมเต็มที่! วันนี้เหมาะสำหรับ High Intensity Training แนะนำ Strain '
              : data.recovery >= 34
              ? 'ร่างกายพร้อมสำหรับการออกกำลังกายระดับปานกลาง แนะนำ Strain '
              : 'ร่างกายต้องการพักผ่อน — จำกัด Strain ไว้ที่ '}
            <Text style={{ color: C.amber, fontWeight: '700' }}>{target}</Text>
            {' '}เพื่อพัฒนาความฟิตอย่างยั่งยืน
          </Text>
        </View>

        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>Heart Rate Zones</Text>
          <View style={s.zoneList}>
            {zones.map(z => (
              <View key={z.name} style={s.zoneItem}>
                <View style={s.zoneInfo}>
                  <Text style={[s.zoneName, { color: C.text }]}>{z.name}</Text>
                  <Text style={[s.zoneRange, { color: C.muted }]}>{z.range}</Text>
                </View>
                <View style={[s.zoneBarTrack, { backgroundColor: C.border }]}>
                  <View style={[s.zoneBarFill, { width: `${z.pct}%`, backgroundColor: z.color }]} />
                </View>
                <Text style={[s.zoneTime, { color: z.color }]}>{z.time}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>Load Balance</Text>
          <View style={s.matrixRow}>
            <View style={s.matrixCell}>
              <Text style={s.matrixIcon}>⚡</Text>
              <Text style={[s.matrixVal, { color: C.amber }]}>{data.strain}%</Text>
              <Text style={[s.matrixLabel, { color: C.muted }]}>Today's Strain</Text>
            </View>
            <View style={[s.matrixDivider, { backgroundColor: C.border }]} />
            <View style={s.matrixCell}>
              <Text style={s.matrixIcon}>📈</Text>
              <Text style={[s.matrixVal, { color: C.green }]}>{data.recovery}%</Text>
              <Text style={[s.matrixLabel, { color: C.muted }]}>Recovery</Text>
            </View>
            <View style={[s.matrixDivider, { backgroundColor: C.border }]} />
            <View style={s.matrixCell}>
              <Text style={s.matrixIcon}>⚖️</Text>
              <Text style={[s.matrixVal, { color: balanceColor }]}>{balanceText}</Text>
              <Text style={[s.matrixLabel, { color: C.muted }]}>Balance</Text>
            </View>
          </View>
        </View>

        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>Weekly Strain Trend</Text>
          <View style={s.chartBars}>
            {[42, 68, 35, 78, 55, 22, data.strain].map((v, i) => {
              const isToday = i === 6;
              const h = (v / 100) * 80;
              return (
                <View key={i} style={s.barWrap}>
                  <View style={[s.bar, {
                    height: h,
                    backgroundColor: isToday ? C.amber : C.surface2,
                    borderWidth: isToday ? 0 : 1,
                    borderColor: C.border,
                  }]} />
                  <Text style={[s.barLabel, { color: isToday ? C.amber : C.muted }]}>
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
  safe:        { flex: 1 },
  scroll:      { padding: Spacing.lg, paddingBottom: 40, gap: 16 },
  title:       { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  bigRingWrap: { alignItems: 'center', paddingVertical: 8 },

  levelCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radius.md, padding: 16, borderWidth: 1, gap: 12 },
  levelText: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5, minWidth: 90 },
  levelHint: { flex: 1, fontSize: 13, lineHeight: 20 },

  pillRow:  { flexDirection: 'row', gap: 8 },
  pill:     { flex: 1, borderRadius: Radius.sm, padding: 12, alignItems: 'center', borderWidth: 1, gap: 4 },
  pillIcon: { fontSize: 16 },
  pillVal:  { fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
  pillKey:  { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center' },

  panel:      { borderRadius: Radius.md, padding: 20, borderWidth: 1, gap: 12 },
  panelTitle: { fontSize: 14, fontWeight: '700' },
  coachTxt:   { fontSize: 14, lineHeight: 22 },

  zoneList:     { gap: 10 },
  zoneItem:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  zoneInfo:     { width: 140 },
  zoneName:     { fontSize: 12, fontWeight: '600' },
  zoneRange:    { fontSize: 10, marginTop: 1 },
  zoneBarTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  zoneBarFill:  { height: '100%', borderRadius: 4 },
  zoneTime:     { fontSize: 12, fontWeight: '700', width: 32, textAlign: 'right' },

  matrixRow:     { flexDirection: 'row', alignItems: 'center' },
  matrixCell:    { flex: 1, alignItems: 'center', gap: 4 },
  matrixDivider: { width: 1, height: 50 },
  matrixIcon:    { fontSize: 20 },
  matrixVal:     { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  matrixLabel:   { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 },

  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 5 },
  barWrap:   { flex: 1, alignItems: 'center', gap: 4 },
  bar:       { width: '100%', borderRadius: 4 },
  barLabel:  { fontSize: 10 },
});
