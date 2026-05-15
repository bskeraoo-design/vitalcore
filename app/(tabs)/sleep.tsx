import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RingChart } from '@/components/health/RingChart';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { calcSleepScore } from '@/lib/scoring';
import { useDemo } from '@/lib/DemoContext';

const STAGE_SEGMENTS = [
  { w: 6,  color: '#3A3065' },
  { w: 18, color: Colors.purple },
  { w: 14, color: '#1A2880' },
  { w: 12, color: Colors.blue },
  { w: 16, color: Colors.purple },
  { w: 10, color: '#1A2880' },
  { w: 14, color: Colors.blue },
  { w: 10, color: '#3A3065' },
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Today'];
const WEEK_SLEEP = [5.2, 6.8, 5.5, 7.2, 4.8, 6.5];

function WeekSleepChart({ currentSleep }: { currentSleep: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const allSleep = [...WEEK_SLEEP, currentSleep];
  const avg = allSleep.reduce((a, b) => a + b, 0) / 7;

  const selectedHours = selected !== null ? allSleep[selected] : null;
  const selectedDay   = selected !== null ? WEEK_DAYS[selected] : null;

  return (
    <View style={s.panel}>
      <Text style={s.panelTitle}>This Week</Text>
      <View style={s.weekBars}>
        {allSleep.map((h, i) => {
          const isToday    = i === 6;
          const isSelected = selected === i;
          const pct = (h / 9) * 100;
          return (
            <TouchableOpacity key={i} style={s.weekBarWrap} onPress={() => setSelected(isSelected ? null : i)} activeOpacity={0.7}>
              <Text style={[s.weekBarHours, { color: isSelected ? Colors.blue : 'transparent' }]}>{h}h</Text>
              <View style={s.weekBarTrack}>
                <View style={[s.weekBarFill, {
                  height: `${pct}%` as any,
                  backgroundColor: isSelected ? Colors.green : isToday ? Colors.blue : Colors.surface2,
                  borderWidth: (isSelected || isToday) ? 0 : 1,
                  borderColor: Colors.border,
                }]} />
              </View>
              <Text style={[s.weekBarLabel, {
                color: isSelected ? Colors.green : isToday ? Colors.blue : Colors.muted,
                fontSize: isSelected ? 8 : 9,
              }]} numberOfLines={1} adjustsFontSizeToFit>
                {isToday ? 'Today' : WEEK_DAYS[i].slice(0, 3)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedHours !== null && (
        <View style={s.dayDetail}>
          <Text style={s.dayDetailTitle}>{selectedDay}</Text>
          <View style={s.dayDetailRow}>
            <View style={s.dayDetailItem}>
              <Text style={[s.dayDetailVal, { color: Colors.blue }]}>{selectedHours}h</Text>
              <Text style={s.dayDetailKey}>Sleep</Text>
            </View>
            <View style={s.dayDetailItem}>
              <Text style={[s.dayDetailVal, { color: Colors.purple }]}>{Math.round(selectedHours * 0.22 * 10) / 10}h</Text>
              <Text style={s.dayDetailKey}>REM</Text>
            </View>
            <View style={s.dayDetailItem}>
              <Text style={[s.dayDetailVal, { color: Colors.green }]}>{Math.min(100, Math.round((selectedHours / 8) * 100))}%</Text>
              <Text style={s.dayDetailKey}>Score</Text>
            </View>
          </View>
        </View>
      )}
      <Text style={s.weekAvg}>Weekly avg: {avg.toFixed(1)}h</Text>
    </View>
  );
}

function qualityLabel(score: number) {
  if (score >= 85) return { label: 'Excellent', color: Colors.green };
  if (score >= 65) return { label: 'Good',      color: Colors.blue  };
  if (score >= 45) return { label: 'Fair',       color: Colors.amber };
  return               { label: 'Poor',      color: Colors.red   };
}

export default function SleepScreen() {
  const { data }  = useDemo();
  const score     = calcSleepScore(data.sleep);
  const quality   = qualityLabel(score);
  const deepPct   = Math.round(Math.min(22, Math.max(8, data.sleep * 2.2)));
  const remPct    = Math.round(Math.min(25, Math.max(12, data.sleep * 2.8)));
  const lightPct  = 100 - deepPct - remPct - 8;
  const cycles    = Math.round(data.sleep / 1.5);

  const bedHr     = 1;
  const bedMin    = 8;
  const wakeHr    = Math.floor(bedHr + data.sleep);
  const wakeDec   = data.sleep % 1;
  const wakeMin   = Math.round(bedMin + wakeDec * 60) % 60;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={s.title}>Sleep</Text>

        {/* Big Ring */}
        <View style={s.bigRingWrap}>
          <RingChart value={score} label="Sleep Score" color="blue" size={190} strokeWidth={16} />
        </View>

        {/* Pills Row 1 */}
        <View style={s.pillRow}>
          {[
            { icon: '🌙', val: `${data.sleep}h`, key: 'Total Sleep', color: Colors.blue   },
            { icon: '🔁', val: `${cycles}`,       key: 'Cycles',     color: Colors.text   },
            { icon: '⬇️', val: `${deepPct}%`,     key: 'Deep Sleep', color: Colors.muted2 },
            { icon: '🧠', val: `${remPct}%`,      key: 'REM',        color: Colors.purple },
          ].map(p => (
            <View key={p.key} style={s.pill}>
              <Text style={s.pillIcon}>{p.icon}</Text>
              <Text style={[s.pillVal, { color: p.color }]}>{p.val}</Text>
              <Text style={s.pillKey}>{p.key}</Text>
            </View>
          ))}
        </View>

        {/* Quality Badge */}
        <View style={[s.qualityCard, { borderColor: quality.color + '44', backgroundColor: quality.color + '12' }]}>
          <Text style={[s.qualityScore, { color: quality.color }]}>{score}</Text>
          <View>
            <Text style={[s.qualityLabel, { color: quality.color }]}>{quality.label}</Text>
            <Text style={s.qualityHint}>
              {score >= 65
                ? 'นอนหลับได้ดี — ร่างกายซ่อมแซมได้เต็มที่'
                : 'นอนหลับไม่เพียงพอ — แนะนำนอนก่อน 23:00'}
            </Text>
          </View>
        </View>

        {/* Stage Bar */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>Sleep Stages</Text>
          <View style={s.timeRow}>
            <Text style={s.timeLabel}>1:08 AM</Text>
            <Text style={s.timeLabel}>{wakeHr}:{wakeMin.toString().padStart(2, '0')} AM</Text>
          </View>
          <View style={s.stageBar}>
            {STAGE_SEGMENTS.map((seg, i) => (
              <View key={i} style={[s.stageSeg, { flex: seg.w, backgroundColor: seg.color }]} />
            ))}
          </View>
          <View style={s.legend}>
            {[
              { label: 'Awake', color: '#3A3065' },
              { label: 'Light', color: Colors.blue   },
              { label: 'Deep',  color: '#1A2880'     },
              { label: 'REM',   color: Colors.purple },
            ].map(l => (
              <View key={l.label} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: l.color }]} />
                <Text style={s.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stage Distribution */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>Stage Distribution</Text>
          {[
            { label: 'Light Sleep', pct: lightPct, color: Colors.blue,   icon: '💤' },
            { label: 'Deep Sleep',  pct: deepPct,  color: '#4A6CF7',      icon: '⬇️' },
            { label: 'REM Sleep',   pct: remPct,   color: Colors.purple,  icon: '🧠' },
            { label: 'Awake',       pct: 8,        color: Colors.muted,   icon: '😶' },
          ].map(st => (
            <View key={st.label} style={s.stageRow}>
              <Text style={s.stageEmoji}>{st.icon}</Text>
              <Text style={s.stageName}>{st.label}</Text>
              <View style={s.stageBarTrack}>
                <View style={[s.stageBarFill, { width: `${st.pct}%` as any, backgroundColor: st.color }]} />
              </View>
              <Text style={[s.stagePct, { color: st.color }]}>{st.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Sleep Coach */}
        <View style={s.panel}>
          <Text style={s.panelTitle}>Sleep Coach</Text>
          <Text style={s.coachTxt}>
            {deepPct < 15
              ? `Deep Sleep ต่ำกว่าเป้า (${deepPct}% vs เป้า 15%) แนะนำ`
              : `Deep Sleep ดี (${deepPct}%) — ร่างกายซ่อมแซมได้เต็มที่ คงไว้โดย`}
            {'\n'}• นอนก่อน 23:00 น.{'\n'}
            • ลด screen time 90 นาทีก่อนนอน{'\n'}
            • ทำ 4-7-8 breathing ก่อนนอน{'\n'}
            • อุณหภูมิห้อง 18–20°C
          </Text>
          <View style={s.tagRow}>
            <View style={s.tag}><Text style={s.tagText}>🌙 นอนก่อน 23:00</Text></View>
            <View style={s.tag}><Text style={s.tagText}>📵 No Screen 90m</Text></View>
            <View style={s.tag}><Text style={s.tagText}>❄️ Cool Room</Text></View>
          </View>
        </View>

        {/* Week View */}
        <WeekSleepChart currentSleep={data.sleep} />

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  scroll:      { padding: Spacing.lg, paddingBottom: 40, gap: 16 },
  title:       { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  bigRingWrap: { alignItems: 'center', paddingVertical: 8 },
  pillRow:     { flexDirection: 'row', gap: 8 },
  pill:        { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.sm, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 4 },
  pillIcon:    { fontSize: 16 },
  pillVal:     { fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
  pillKey:     { fontSize: 9, color: Colors.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center' },

  qualityCard:  { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 20, borderWidth: 1 },
  qualityScore: { fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  qualityLabel: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  qualityHint:  { fontSize: 12, color: Colors.muted2, marginTop: 4, lineHeight: 18 },

  panel:       { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 20, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  panelTitle:  { fontSize: 14, fontWeight: '700', color: Colors.text },
  coachTxt:    { fontSize: 14, color: Colors.muted2, lineHeight: 24 },
  timeRow:     { flexDirection: 'row', justifyContent: 'space-between' },
  timeLabel:   { fontSize: 11, color: Colors.muted },
  stageBar:    { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', gap: 2 },
  stageSeg:    { borderRadius: 3 },
  legend:      { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:   { width: 10, height: 10, borderRadius: 3 },
  legendText:  { fontSize: 12, color: Colors.muted2 },

  stageRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stageEmoji:    { fontSize: 14, width: 22 },
  stageName:     { fontSize: 12, color: Colors.muted2, width: 80 },
  stageBarTrack: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  stageBarFill:  { height: '100%', borderRadius: 4 },
  stagePct:      { fontSize: 12, fontWeight: '700', width: 32, textAlign: 'right' },

  tagRow:      { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag:         { paddingHorizontal: 11, paddingVertical: 5, backgroundColor: Colors.surface2, borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  tagText:     { fontSize: 12, color: Colors.muted2, fontWeight: '500' },

  weekBars:     { flexDirection: 'row', height: 90, gap: 4, alignItems: 'flex-end' },
  weekBarWrap:  { flex: 1, alignItems: 'center', gap: 3 },
  weekBarHours: { fontSize: 9, fontWeight: '700', height: 13 },
  weekBarTrack: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  weekBarFill:  { width: '100%', borderRadius: 4, minHeight: 4 },
  weekBarLabel: { fontSize: 9, textAlign: 'center' },
  weekAvg:      { fontSize: 12, color: Colors.muted2, textAlign: 'center' },

  dayDetail:     { backgroundColor: Colors.surface2, borderRadius: Radius.sm, padding: 14, borderWidth: 1, borderColor: Colors.border },
  dayDetailTitle:{ fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  dayDetailRow:  { flexDirection: 'row' },
  dayDetailItem: { flex: 1, alignItems: 'center', gap: 3 },
  dayDetailVal:  { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  dayDetailKey:  { fontSize: 10, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
});
