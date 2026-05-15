import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RingChart } from '@/components/health/RingChart';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { getStressLabel, getVO2Category } from '@/lib/scoring';
import { useDemo } from '@/lib/DemoContext';

const WEEK_DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Today'];

export default function RecoveryScreen() {
  const { data } = useDemo();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const hrvHistory = [88, 92, 78, 105, 99, 112, data.hrv];
  const stressLabel = getStressLabel(data.stress);
  const vo2Cat      = getVO2Category(data.vo2max);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={s.title}>Recovery</Text>

        {/* Big Ring */}
        <View style={s.bigRingWrap}>
          <RingChart value={data.recovery} label="Recovered" color="green" size={190} strokeWidth={16} />
        </View>

        {/* Top Row Pills */}
        <View style={s.pillRow}>
          {[
            { icon: '📊', val: `${data.hrv} ms`,  key: 'Resting HRV', color: Colors.green  },
            { icon: '❤️', val: `${data.hr} bpm`,  key: 'Resting HR',  color: Colors.red    },
            { icon: '🫁', val: `${data.spo2}%`,   key: 'SpO₂',        color: Colors.blue   },
            { icon: '🌡️', val: `${data.temp}°C`,  key: 'Skin Temp',   color: Colors.muted2 },
          ].map(p => (
            <View key={p.key} style={s.pill}>
              <Text style={s.pillIcon}>{p.icon}</Text>
              <Text style={[s.pillVal, { color: p.color }]}>{p.val}</Text>
              <Text style={s.pillKey}>{p.key}</Text>
            </View>
          ))}
        </View>

        {/* Second Row Pills */}
        <View style={s.pillRow}>
          {[
            { icon: '🫀', val: `${data.vo2max}`, key: 'VO₂ Max',     color: Colors.green  },
            { icon: '🌬️', val: `${data.respRate}/m`, key: 'Resp Rate', color: Colors.muted2 },
            { icon: '🧠', val: `${data.stress}%`, key: 'Stress',      color: data.stress > 60 ? Colors.red : data.stress > 35 ? Colors.amber : Colors.green },
            { icon: '🩸', val: '118/76',           key: 'Blood Pres.', color: Colors.purple },
          ].map(p => (
            <View key={p.key} style={s.pill}>
              <Text style={s.pillIcon}>{p.icon}</Text>
              <Text style={[s.pillVal, { color: p.color }]}>{p.val}</Text>
              <Text style={s.pillKey}>{p.key}</Text>
            </View>
          ))}
        </View>

        {/* Stress Panel */}
        <View style={s.panel}>
          <View style={s.panelHeaderRow}>
            <Text style={s.panelTitle}>🧠 Stress Level</Text>
            <View style={[s.stressBadge, {
              backgroundColor: data.stress > 60
                ? Colors.redDim : data.stress > 35 ? Colors.amberDim : Colors.greenDim,
            }]}>
              <Text style={[s.stressBadgeText, {
                color: data.stress > 60 ? Colors.red : data.stress > 35 ? Colors.amber : Colors.green,
              }]}>{stressLabel}</Text>
            </View>
          </View>
          <View style={s.stressBarTrack}>
            <View style={[s.stressBarFill, {
              width: `${data.stress}%` as any,
              backgroundColor: data.stress > 60 ? Colors.red : data.stress > 35 ? Colors.amber : Colors.green,
            }]} />
          </View>
          <Text style={s.coachTxt}>
            {data.stress <= 25
              ? 'Stress เบาบาง — ร่างกายและจิตใจอยู่ในสภาวะสมดุลดี'
              : data.stress <= 50
              ? 'Stress อยู่ในระดับต่ำ — แนะนำ breathing exercise ก่อนนอน'
              : 'Stress สูง — ลด caffeine, เพิ่มเวลา mindfulness 10 นาทีต่อวัน'}
          </Text>
        </View>

        {/* VO2 Max Panel */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>🫀 VO₂ Max — Cardio Fitness</Text>
          <View style={s.vo2Row}>
            <Text style={[s.vo2Score, { color: Colors.green }]}>{data.vo2max}</Text>
            <View>
              <Text style={s.vo2Unit}>mL/kg/min</Text>
              <View style={[s.vo2Badge, { backgroundColor: Colors.greenDim }]}>
                <Text style={[s.vo2BadgeText, { color: Colors.green }]}>{vo2Cat}</Text>
              </View>
            </View>
          </View>
          <View style={s.vo2Scale}>
            {[
              { label: 'Poor', min: 0,  max: 36, color: Colors.red    },
              { label: 'Fair', min: 36, max: 42, color: Colors.amber  },
              { label: 'Good', min: 42, max: 47, color: Colors.green  },
              { label: 'Exc.',  min: 47, max: 55, color: Colors.blue  },
              { label: 'Sup.', min: 55, max: 70, color: Colors.purple },
            ].map(seg => {
              const isActive = data.vo2max >= seg.min && data.vo2max < seg.max;
              return (
                <View key={seg.label} style={[s.vo2ScaleSeg, { backgroundColor: isActive ? seg.color : Colors.border }]}>
                  <Text style={[s.vo2ScaleLabel, { color: isActive ? seg.color : Colors.muted }]}>{seg.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Coaching Panel */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>AI Coaching</Text>
          <Text style={s.coachTxt}>
            Recovery {data.recovery}% — HRV {data.hrv}ms
            {data.hrv > 100 ? ' สูงกว่าค่าเฉลี่ย ' : ' ต่ำกว่าค่าเฉลี่ย '}
            30 วัน (100ms){'\n'}
            {data.recovery >= 67
              ? 'เหมาะสำหรับ High Intensity Training — Strain เป้าหมาย: '
              : data.recovery >= 34
              ? 'เหมาะสำหรับ Moderate Training — Strain เป้าหมาย: '
              : 'แนะนำพักผ่อน — Strain ไม่เกิน: '}
            <Text style={{ color: Colors.green, fontWeight: '700' }}>
              {data.recovery >= 67 ? '70–85%' : data.recovery >= 34 ? '50–70%' : '30%'}
            </Text>
          </Text>
        </View>

        {/* HRV Trend */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>HRV Trend — 7 Days</Text>
          <View style={s.chartBars}>
            {hrvHistory.map((v, i) => {
              const isToday    = i === 6;
              const isSelected = selectedDay === i;
              const maxHrv     = Math.max(...hrvHistory);
              const h = (v / maxHrv) * 80;
              return (
                <TouchableOpacity key={i} style={s.barWrap} onPress={() => setSelectedDay(isSelected ? null : i)} activeOpacity={0.7}>
                  <Text style={[s.barVal, { color: isSelected ? Colors.green : isToday ? Colors.green : Colors.muted }]}>
                    {(isToday || isSelected) ? v : ''}
                  </Text>
                  <View style={[s.bar, {
                    height: h,
                    backgroundColor: isSelected ? Colors.green : isToday ? Colors.green : Colors.surface2,
                    borderWidth: (isSelected || isToday) ? 0 : 1,
                    borderColor: Colors.border,
                  }]} />
                  <Text style={[s.barLabel, { color: isSelected ? Colors.green : isToday ? Colors.green : Colors.muted, fontSize: 8 }]}
                    numberOfLines={1} adjustsFontSizeToFit>
                    {isToday ? 'Today' : WEEK_DAYS_FULL[i].slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedDay !== null && (
            <View style={s.dayCard}>
              <Text style={s.dayCardTitle}>{WEEK_DAYS_FULL[selectedDay]}</Text>
              <View style={s.dayCardRow}>
                <View style={s.dayCardItem}>
                  <Text style={[s.dayCardVal, { color: Colors.green }]}>{hrvHistory[selectedDay]} ms</Text>
                  <Text style={s.dayCardKey}>HRV</Text>
                </View>
                <View style={s.dayCardItem}>
                  <Text style={[s.dayCardVal, { color: Colors.green }]}>
                    {Math.round(Math.min(100, (hrvHistory[selectedDay] / 100) * 100 * 0.85))}%
                  </Text>
                  <Text style={s.dayCardKey}>Recovery</Text>
                </View>
                <View style={s.dayCardItem}>
                  <Text style={[s.dayCardVal, { color: Colors.blue }]}>
                    {hrvHistory[selectedDay] >= 100 ? 'Good' : 'Fair'}
                  </Text>
                  <Text style={s.dayCardKey}>Status</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>Sleep Timeline</Text>
          <View style={s.tlItem}>
            <View style={[s.tlIcon, { backgroundColor: Colors.blueDim }]}>
              <Text style={s.tlEmoji}>😴</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.tlTitle}>Primary Sleep</Text>
              <Text style={s.tlSub}>
                5/15 · 1:08 AM – {Math.floor(1 + data.sleep)}:{Math.round((data.sleep % 1) * 60).toString().padStart(2, '0')} AM · {data.sleep}h
              </Text>
            </View>
            <View style={[s.tlScore, { backgroundColor: data.recovery >= 67 ? Colors.greenDim : Colors.amberDim }]}>
              <Text style={[s.tlScoreText, { color: data.recovery >= 67 ? Colors.green : Colors.amber }]}>
                {data.recovery}%
              </Text>
            </View>
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
  pillRow:     { flexDirection: 'row', gap: 10 },
  pill:        { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 4 },
  pillIcon:    { fontSize: 16 },
  pillVal:     { fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
  pillKey:     { fontSize: 9, color: Colors.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' },
  panel:       { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 20, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  panelTitle:  { fontSize: 14, fontWeight: '700', color: Colors.text },
  panelHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coachTxt:    { fontSize: 14, color: Colors.muted2, lineHeight: 22 },

  stressBadge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  stressBadgeText: { fontSize: 12, fontWeight: '700' },
  stressBarTrack:  { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  stressBarFill:   { height: '100%', borderRadius: 4 },

  vo2Row:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vo2Score:     { fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  vo2Unit:      { fontSize: 12, color: Colors.muted2 },
  vo2Badge:     { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  vo2BadgeText: { fontSize: 11, fontWeight: '700' },
  vo2Scale:     { flexDirection: 'row', gap: 4 },
  vo2ScaleSeg:  { flex: 1, height: 6, borderRadius: 3, alignItems: 'center', paddingTop: 10 },
  vo2ScaleLabel:{ fontSize: 9, fontWeight: '600' },

  chartBars:   { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 5 },
  barWrap:     { flex: 1, alignItems: 'center', gap: 3 },
  bar:         { width: '100%', borderRadius: 4 },
  barVal:      { fontSize: 9, fontWeight: '700', height: 14 },
  barLabel:    { fontSize: 10, color: Colors.muted },
  tlItem:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tlIcon:      { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tlEmoji:     { fontSize: 18 },
  tlTitle:     { fontSize: 14, fontWeight: '600', color: Colors.text },
  tlSub:       { fontSize: 12, color: Colors.muted2, marginTop: 2 },
  tlScore:     { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  tlScoreText: { fontSize: 13, fontWeight: '700' },

  dayCard:      { backgroundColor: Colors.surface2, borderRadius: Radius.sm, padding: 14, borderWidth: 1, borderColor: Colors.border },
  dayCardTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  dayCardRow:   { flexDirection: 'row' },
  dayCardItem:  { flex: 1, alignItems: 'center', gap: 3 },
  dayCardVal:   { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  dayCardKey:   { fontSize: 10, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
});
