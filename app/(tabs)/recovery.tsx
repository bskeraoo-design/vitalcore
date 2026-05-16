import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RingChart } from '@/components/health/RingChart';
import { SparkLine } from '@/components/health/SparkLine';
import { Spacing, Radius } from '@/constants/theme';
import { useColors } from '@/hooks/use-app-colors';
import { getStressLabel, getVO2Category } from '@/lib/scoring';
import { useDemo } from '@/lib/DemoContext';

const WEEK_DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Today'];

const IMPACT_BEHAVIORS = [
  { label: 'Hydration',        impact: +24 },
  { label: '80%+ Sleep Score', impact: +21 },
  { label: 'Read Before Bed',  impact: +13 },
  { label: 'Device in Bed',    impact: +2  },
  { label: '12+ Strain Day',   impact: +1  },
  { label: 'Work Late',        impact: -6  },
  { label: 'High Stress Day',  impact: -9  },
];

function VitalRow({
  icon, label, value, unit, history, color, normal,
}: {
  icon: string; label: string; value: string; unit: string;
  history: number[]; color: string; normal: boolean;
}) {
  const C = useColors();
  return (
    <View style={[vr.row, { borderBottomColor: C.border }]}>
      <View style={[vr.iconWrap, { backgroundColor: `${color}18` }]}>
        <Text style={vr.icon}>{icon}</Text>
      </View>
      <View style={vr.info}>
        <Text style={[vr.label, { color: C.text }]}>{label}</Text>
        <View style={[vr.badge, { backgroundColor: normal ? C.greenDim : C.amberDim }]}>
          <View style={[vr.badgeDot, { backgroundColor: normal ? C.green : C.amber }]} />
          <Text style={[vr.badgeText, { color: normal ? C.green : C.amber }]}>
            {normal ? 'Normal range' : 'Below normal'}
          </Text>
        </View>
      </View>
      <View style={vr.valueWrap}>
        <Text style={[vr.value, { color: C.text }]}>{value}</Text>
        <Text style={[vr.unit, { color: C.muted2 }]}>{unit}</Text>
      </View>
      <SparkLine data={history} color={color} width={72} height={32} />
    </View>
  );
}

const vr = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1 },
  iconWrap:  { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  icon:      { fontSize: 16 },
  info:      { flex: 1, gap: 4 },
  label:     { fontSize: 13, fontWeight: '600' },
  badge:     { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  badgeDot:  { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  valueWrap: { alignItems: 'flex-end', gap: 1 },
  value:     { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  unit:      { fontSize: 10 },
});

export default function RecoveryScreen() {
  const { data } = useDemo();
  const C = useColors();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const hrvHistory = [88, 92, 78, 105, 99, 112, data.hrv];
  const hr7        = [62, 65, 68, 64,  61, 63,  data.hr];
  const spo7       = [98, 97, 98, 96,  97, 98,  data.spo2];
  const resp7      = [16, 17, 18, 16,  17, 16,  data.respRate];
  const temp7      = [36.2, 36.3, 36.1, 36.4, 36.2, 36.0, data.temp];
  const rec7       = [72, 68, 45, 88,  76, 82,  data.recovery];

  const stressLabel = getStressLabel(data.stress);
  const vo2Cat      = getVO2Category(data.vo2max);

  const healthAge  = parseFloat(
    Math.max(18, 28 - (data.hrv - 75) * 0.05 - (data.recovery - 60) * 0.04 + (data.stress - 35) * 0.03).toFixed(1)
  );
  const ageDiff   = parseFloat((28 - healthAge).toFixed(1));
  const paceOfAge = parseFloat(Math.max(0.4, Math.min(2.0, 1 - (data.recovery - 50) * 0.01)).toFixed(1));

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Text style={[s.title, { color: C.text }]}>Recovery</Text>

        {/* Big Ring */}
        <View style={s.bigRingWrap}>
          <RingChart value={data.recovery} label="Recovered" color="green" size={190} strokeWidth={16} />
        </View>

        {/* Top Row Pills */}
        <View style={s.pillRow}>
          {[
            { icon: '📊', val: `${data.hrv} ms`,  key: 'Resting HRV', color: C.green  },
            { icon: '❤️', val: `${data.hr} bpm`,  key: 'Resting HR',  color: C.red    },
            { icon: '🫁', val: `${data.spo2}%`,   key: 'SpO₂',        color: C.blue   },
            { icon: '🌡️', val: `${data.temp}°C`,  key: 'Skin Temp',   color: C.muted2 },
          ].map(p => (
            <View key={p.key} style={[s.pill, { backgroundColor: C.surface, borderColor: C.border }]}>
              <Text style={s.pillIcon}>{p.icon}</Text>
              <Text style={[s.pillVal, { color: p.color }]}>{p.val}</Text>
              <Text style={[s.pillKey, { color: C.muted }]}>{p.key}</Text>
            </View>
          ))}
        </View>

        {/* Second Row Pills */}
        <View style={s.pillRow}>
          {[
            { icon: '🫀', val: `${data.vo2max}`,     key: 'VO₂ Max',    color: C.green  },
            { icon: '🌬️', val: `${data.respRate}/m`, key: 'Resp Rate',  color: C.muted2 },
            { icon: '🧠', val: `${data.stress}%`,    key: 'Stress',
              color: data.stress > 60 ? C.red : data.stress > 35 ? C.amber : C.green },
            { icon: '🩸', val: '118/76',              key: 'Blood Pres.', color: C.purple },
          ].map(p => (
            <View key={p.key} style={[s.pill, { backgroundColor: C.surface, borderColor: C.border }]}>
              <Text style={s.pillIcon}>{p.icon}</Text>
              <Text style={[s.pillVal, { color: p.color }]}>{p.val}</Text>
              <Text style={[s.pillKey, { color: C.muted }]}>{p.key}</Text>
            </View>
          ))}
        </View>

        {/* ── Vitals Snapshot (OURA-style) ── */}
        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>Vitals Snapshot</Text>
          <VitalRow icon="📈" label="Recovery Score"    value={`${data.recovery}`}  unit="%" history={rec7}       color={C.green}  normal={data.recovery > 40} />
          <VitalRow icon="📊" label="Resting HRV"       value={`${data.hrv}`}       unit="ms" history={hrvHistory} color={C.green}  normal={data.hrv > 50} />
          <VitalRow icon="❤️" label="Resting HR"        value={`${data.hr}`}        unit="bpm" history={hr7}      color={C.red}    normal={data.hr < 80} />
          <VitalRow icon="🌬️" label="Respiratory Rate"  value={`${data.respRate}`}  unit="rpm" history={resp7}    color={C.blue}   normal={data.respRate <= 20} />
          <VitalRow icon="🫁" label="Oxygen Saturation" value={`${data.spo2}`}      unit="%" history={spo7}        color={C.blue}   normal={data.spo2 >= 96} />
          <VitalRow icon="🌡️" label="Wrist Temperature" value={`${data.temp}`}     unit="°C" history={temp7}      color={C.muted2} normal={data.temp < 37.5} />
        </View>

        {/* ── Healthspan / Pace of Aging ── */}
        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>HEALTHSPAN</Text>
          <Text style={[s.hsSubtitle, { color: C.muted2 }]}>Next update in 6 days</Text>

          <View style={s.hsCircleWrap}>
            <View style={[s.hsGlow,  { backgroundColor: `${C.green}08` }]} />
            <View style={[s.hsGlow2, { backgroundColor: `${C.green}04` }]} />
            <View style={[s.hsInner, { borderColor: `${C.green}50` }]}>
              <Text style={[s.hsAge, { color: C.text }]}>{healthAge}</Text>
              <Text style={[s.hsAgeLabel, { color: C.muted2 }]}>HEALTH AGE</Text>
              <Text style={[s.hsDiff, { color: ageDiff >= 0 ? C.green : C.red }]}>
                {ageDiff >= 0 ? `${ageDiff} yrs younger` : `${Math.abs(ageDiff)} yrs older`}
              </Text>
            </View>
          </View>

          <View style={s.paceSection}>
            <Text style={[s.paceTitle, { color: C.muted2 }]}>PACE OF AGING</Text>
            <View style={s.paceRow}>
              <Text style={[s.paceEdge, { color: C.muted }]}>Slow</Text>
              <View style={[s.paceTrack, { backgroundColor: C.border }]}>
                <View style={[s.paceFill, {
                  width: `${Math.min(100, ((paceOfAge + 1) / 4) * 100)}%` as any,
                  backgroundColor: paceOfAge < 1 ? C.green : paceOfAge < 1.5 ? C.amber : C.red,
                }]} />
              </View>
              <Text style={[s.paceEdge, { color: C.muted, textAlign: 'right' }]}>Fast</Text>
            </View>
            <Text style={[s.paceVal, { color: paceOfAge < 1 ? C.green : C.amber }]}>{paceOfAge}x</Text>
          </View>

          <View style={[s.paceDesc, { backgroundColor: C.surface2, borderColor: C.border }]}>
            <Text style={[s.paceDescTitle, { color: C.text }]}>
              {paceOfAge < 0.9 ? 'Steady and Healthy' : paceOfAge < 1.2 ? 'On Track' : 'Attention Needed'}
            </Text>
            <Text style={[s.paceDescBody, { color: C.muted2 }]}>
              {paceOfAge < 0.9
                ? `Your Pace of Aging slowed by ${(1 - paceOfAge).toFixed(1)}x this week, mostly due to positive changes in your VO₂ Max. Continue your current habits.`
                : paceOfAge < 1.2
                ? 'Your biological age is tracking close to your actual age. Focus on sleep quality and HRV to improve.'
                : 'Elevated stress and reduced sleep are accelerating your pace of aging. Prioritise recovery.'}
            </Text>
          </View>
        </View>

        {/* ── Stress Panel ── */}
        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.panelHeaderRow}>
            <Text style={[s.panelTitle, { color: C.text }]}>🧠 Stress Level</Text>
            <View style={[s.stressBadge, {
              backgroundColor: data.stress > 60 ? C.redDim : data.stress > 35 ? C.amberDim : C.greenDim,
            }]}>
              <Text style={[s.stressBadgeText, {
                color: data.stress > 60 ? C.red : data.stress > 35 ? C.amber : C.green,
              }]}>{stressLabel}</Text>
            </View>
          </View>
          <View style={[s.stressBarTrack, { backgroundColor: C.border }]}>
            <View style={[s.stressBarFill, {
              width: `${data.stress}%` as any,
              backgroundColor: data.stress > 60 ? C.red : data.stress > 35 ? C.amber : C.green,
            }]} />
          </View>
          <Text style={[s.coachTxt, { color: C.muted2 }]}>
            {data.stress <= 25
              ? 'Stress เบาบาง — ร่างกายและจิตใจอยู่ในสภาวะสมดุลดี'
              : data.stress <= 50
              ? 'Stress อยู่ในระดับต่ำ — แนะนำ breathing exercise ก่อนนอน'
              : 'Stress สูง — ลด caffeine, เพิ่มเวลา mindfulness 10 นาทีต่อวัน'}
          </Text>
        </View>

        {/* ── Recovery Impact Analysis ── */}
        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={[s.impactRefreshed, { backgroundColor: C.amberDim }]}>
            <Text style={[s.impactRefreshedTxt, { color: C.amber }]}>REFRESHED DAILY</Text>
          </View>
          <Text style={[s.panelTitle, { color: C.text }]}>Recovery Impact Analysis</Text>
          <Text style={[s.impactSub, { color: C.muted2 }]}>
            See how behaviors impacted your Recovery over the past 90 days.
          </Text>
          <View style={[s.impactHeader, { borderBottomColor: C.border }]}>
            <Text style={[s.impactHurts, { color: C.amber }]}>▼ HURTS</Text>
            <Text style={[s.impactPctLbl, { color: C.muted }]}>% IMPACT</Text>
            <Text style={[s.impactHelps, { color: C.green }]}>HELPS ▲</Text>
          </View>
          {IMPACT_BEHAVIORS.map((b, i) => {
            const isPos = b.impact > 0;
            const pct   = Math.abs(b.impact) / 25;
            return (
              <TouchableOpacity
                key={b.label}
                style={[s.impactRow, i < IMPACT_BEHAVIORS.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border }]}
                activeOpacity={0.7}
              >
                <Text style={[s.impactLabel, { color: C.text }]}>{b.label}</Text>
                <View style={s.impactBarWrap}>
                  <View style={[s.impactBarTrack, { backgroundColor: C.border }]}>
                    <View style={[s.impactBarFill, { width: `${pct * 100}%` as any, backgroundColor: isPos ? C.green : C.amber }]} />
                  </View>
                </View>
                <Text style={[s.impactPct, { color: isPos ? C.green : C.amber }]}>
                  {isPos ? '+' : ''}{b.impact}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── VO2 Max Panel ── */}
        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>🫀 VO₂ Max — Cardio Fitness</Text>
          <View style={s.vo2Row}>
            <Text style={[s.vo2Score, { color: C.green }]}>{data.vo2max}</Text>
            <View>
              <Text style={[s.vo2Unit, { color: C.muted2 }]}>mL/kg/min</Text>
              <View style={[s.vo2Badge, { backgroundColor: C.greenDim }]}>
                <Text style={[s.vo2BadgeText, { color: C.green }]}>{vo2Cat}</Text>
              </View>
            </View>
          </View>
          <View style={s.vo2Scale}>
            {[
              { label: 'Poor', min: 0,  max: 36, color: C.red    },
              { label: 'Fair', min: 36, max: 42, color: C.amber  },
              { label: 'Good', min: 42, max: 47, color: C.green  },
              { label: 'Exc.', min: 47, max: 55, color: C.blue   },
              { label: 'Sup.', min: 55, max: 70, color: C.purple },
            ].map(seg => {
              const isActive = data.vo2max >= seg.min && data.vo2max < seg.max;
              return (
                <View key={seg.label} style={[s.vo2ScaleSeg, { backgroundColor: isActive ? seg.color : C.border }]}>
                  <Text style={[s.vo2ScaleLabel, { color: isActive ? seg.color : C.muted }]}>{seg.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── AI Coaching ── */}
        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>AI Coaching</Text>
          <Text style={[s.coachTxt, { color: C.muted2 }]}>
            Recovery {data.recovery}% — HRV {data.hrv}ms
            {data.hrv > 100 ? ' สูงกว่าค่าเฉลี่ย ' : ' ต่ำกว่าค่าเฉลี่ย '}
            30 วัน (100ms){'\n'}
            {data.recovery >= 67
              ? 'เหมาะสำหรับ High Intensity Training — Strain เป้าหมาย: '
              : data.recovery >= 34
              ? 'เหมาะสำหรับ Moderate Training — Strain เป้าหมาย: '
              : 'แนะนำพักผ่อน — Strain ไม่เกิน: '}
            <Text style={{ color: C.green, fontWeight: '700' }}>
              {data.recovery >= 67 ? '70–85%' : data.recovery >= 34 ? '50–70%' : '30%'}
            </Text>
          </Text>
        </View>

        {/* ── HRV Trend ── */}
        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>HRV Trend — 7 Days</Text>
          <View style={s.chartBars}>
            {hrvHistory.map((v, i) => {
              const isToday    = i === 6;
              const isSelected = selectedDay === i;
              const maxHrv     = Math.max(...hrvHistory);
              const h = (v / maxHrv) * 80;
              return (
                <TouchableOpacity key={i} style={s.barWrap} onPress={() => setSelectedDay(isSelected ? null : i)} activeOpacity={0.7}>
                  <Text style={[s.barVal, { color: isSelected ? C.green : isToday ? C.green : C.muted }]}>
                    {(isToday || isSelected) ? v : ''}
                  </Text>
                  <View style={[s.bar, {
                    height: h,
                    backgroundColor: isSelected ? C.green : isToday ? C.green : C.surface2,
                    borderWidth: (isSelected || isToday) ? 0 : 1,
                    borderColor: C.border,
                  }]} />
                  <Text style={[s.barLabel, { color: isSelected ? C.green : isToday ? C.green : C.muted, fontSize: 8 }]}
                    numberOfLines={1} adjustsFontSizeToFit>
                    {isToday ? 'Today' : WEEK_DAYS_FULL[i].slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedDay !== null && (
            <View style={[s.dayCard, { backgroundColor: C.surface2, borderColor: C.border }]}>
              <Text style={[s.dayCardTitle, { color: C.text }]}>{WEEK_DAYS_FULL[selectedDay]}</Text>
              <View style={s.dayCardRow}>
                <View style={s.dayCardItem}>
                  <Text style={[s.dayCardVal, { color: C.green }]}>{hrvHistory[selectedDay]} ms</Text>
                  <Text style={[s.dayCardKey, { color: C.muted }]}>HRV</Text>
                </View>
                <View style={s.dayCardItem}>
                  <Text style={[s.dayCardVal, { color: C.green }]}>
                    {Math.round(Math.min(100, (hrvHistory[selectedDay] / 100) * 85))}%
                  </Text>
                  <Text style={[s.dayCardKey, { color: C.muted }]}>Recovery</Text>
                </View>
                <View style={s.dayCardItem}>
                  <Text style={[s.dayCardVal, { color: C.blue }]}>
                    {hrvHistory[selectedDay] >= 100 ? 'Good' : 'Fair'}
                  </Text>
                  <Text style={[s.dayCardKey, { color: C.muted }]}>Status</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ── Sleep Timeline ── */}
        <View style={[s.panel, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.panelTitle, { color: C.text }]}>Sleep Timeline</Text>
          <View style={s.tlItem}>
            <View style={[s.tlIcon, { backgroundColor: C.blueDim }]}>
              <Text style={s.tlEmoji}>😴</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.tlTitle, { color: C.text }]}>Primary Sleep</Text>
              <Text style={[s.tlSub, { color: C.muted2 }]}>
                5/15 · 1:08 AM – {Math.floor(1 + data.sleep)}:{Math.round((data.sleep % 1) * 60).toString().padStart(2, '0')} AM · {data.sleep}h
              </Text>
            </View>
            <View style={[s.tlScore, { backgroundColor: data.recovery >= 67 ? C.greenDim : C.amberDim }]}>
              <Text style={[s.tlScoreText, { color: data.recovery >= 67 ? C.green : C.amber }]}>
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
  safe:        { flex: 1 },
  scroll:      { padding: Spacing.lg, paddingBottom: 40, gap: 16 },
  title:       { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  bigRingWrap: { alignItems: 'center', paddingVertical: 8 },
  pillRow:     { flexDirection: 'row', gap: 10 },
  pill:        { flex: 1, borderRadius: Radius.sm, padding: 12, alignItems: 'center', borderWidth: 1, gap: 4 },
  pillIcon:    { fontSize: 16 },
  pillVal:     { fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
  pillKey:     { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, textAlign: 'center' },
  panel:       { borderRadius: Radius.md, padding: 20, borderWidth: 1, gap: 10 },
  panelTitle:  { fontSize: 14, fontWeight: '700' },
  panelHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coachTxt:    { fontSize: 14, lineHeight: 22 },

  /* Healthspan */
  hsSubtitle:   { fontSize: 12, marginTop: -6 },
  hsCircleWrap: { alignItems: 'center', justifyContent: 'center', height: 190 },
  hsGlow:       { position: 'absolute', width: 190, height: 190, borderRadius: 95 },
  hsGlow2:      { position: 'absolute', width: 230, height: 230, borderRadius: 115 },
  hsInner:      { width: 155, height: 155, borderRadius: 78, borderWidth: 2, alignItems: 'center', justifyContent: 'center', gap: 2 },
  hsAge:        { fontSize: 42, fontWeight: '900', letterSpacing: -2 },
  hsAgeLabel:   { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  hsDiff:       { fontSize: 12, fontWeight: '700', marginTop: 2 },
  paceSection:  { gap: 6 },
  paceTitle:    { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  paceRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paceEdge:     { fontSize: 11, fontWeight: '600', width: 32 },
  paceTrack:    { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  paceFill:     { height: '100%', borderRadius: 4 },
  paceVal:      { fontSize: 20, fontWeight: '900', letterSpacing: -0.5, textAlign: 'center' },
  paceDesc:     { borderRadius: Radius.sm, padding: 14, borderWidth: 1, gap: 6 },
  paceDescTitle:{ fontSize: 13, fontWeight: '700' },
  paceDescBody: { fontSize: 12, lineHeight: 18 },

  stressBadge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  stressBadgeText: { fontSize: 12, fontWeight: '700' },
  stressBarTrack:  { height: 8, borderRadius: 4, overflow: 'hidden' },
  stressBarFill:   { height: '100%', borderRadius: 4 },

  /* Impact */
  impactRefreshed:    { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  impactRefreshedTxt: { fontSize: 10, fontWeight: '700' },
  impactSub:          { fontSize: 12, lineHeight: 18 },
  impactHeader:       { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1 },
  impactHurts:        { flex: 1, fontSize: 10, fontWeight: '700' },
  impactPctLbl:       { width: 70, fontSize: 10, fontWeight: '700', textAlign: 'center' },
  impactHelps:        { width: 50, fontSize: 10, fontWeight: '700', textAlign: 'right' },
  impactRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8 },
  impactLabel:        { flex: 1, fontSize: 13, fontWeight: '500' },
  impactBarWrap:      { width: 70 },
  impactBarTrack:     { height: 6, borderRadius: 3, overflow: 'hidden' },
  impactBarFill:      { height: '100%', borderRadius: 3 },
  impactPct:          { width: 46, fontSize: 12, fontWeight: '700', textAlign: 'right' },

  vo2Row:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vo2Score:     { fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  vo2Unit:      { fontSize: 12 },
  vo2Badge:     { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  vo2BadgeText: { fontSize: 11, fontWeight: '700' },
  vo2Scale:     { flexDirection: 'row', gap: 4 },
  vo2ScaleSeg:  { flex: 1, height: 6, borderRadius: 3, alignItems: 'center', paddingTop: 10 },
  vo2ScaleLabel:{ fontSize: 9, fontWeight: '600' },

  chartBars:  { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 5 },
  barWrap:    { flex: 1, alignItems: 'center', gap: 3 },
  bar:        { width: '100%', borderRadius: 4 },
  barVal:     { fontSize: 9, fontWeight: '700', height: 14 },
  barLabel:   { fontSize: 10 },

  dayCard:      { borderRadius: Radius.sm, padding: 14, borderWidth: 1 },
  dayCardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  dayCardRow:   { flexDirection: 'row' },
  dayCardItem:  { flex: 1, alignItems: 'center', gap: 3 },
  dayCardVal:   { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  dayCardKey:   { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 },

  tlItem:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tlIcon:      { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tlEmoji:     { fontSize: 18 },
  tlTitle:     { fontSize: 14, fontWeight: '600' },
  tlSub:       { fontSize: 12, marginTop: 2 },
  tlScore:     { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  tlScoreText: { fontSize: 13, fontWeight: '700' },
});
