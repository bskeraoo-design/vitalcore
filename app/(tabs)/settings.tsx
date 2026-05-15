import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  Switch, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useDemo } from '@/lib/DemoContext';
import { HealthSnapshot } from '@/lib/scoring';

/* ── Stepper ── */
function Stepper({
  label, unit, value, step, min, max, decimals = 0, color = Colors.green,
  onchange,
}: {
  label: string; unit: string; value: number; step: number;
  min: number; max: number; decimals?: number; color?: string;
  onchange: (v: number) => void;
}) {
  const dec = (v: number, s: number) =>
    Math.round((v - s) * 10 ** decimals) / 10 ** decimals;
  const inc = (v: number, s: number) =>
    Math.round((v + s) * 10 ** decimals) / 10 ** decimals;

  return (
    <View style={st.stepperRow}>
      <View style={st.stepperLeft}>
        <Text style={st.stepperLabel}>{label}</Text>
        <Text style={st.stepperUnit}>{unit}</Text>
      </View>
      <View style={st.stepperControls}>
        <TouchableOpacity
          style={[st.stepBtn, value <= min && st.stepBtnDisabled]}
          onPress={() => value > min && onchange(Math.max(min, dec(value, step)))}
          activeOpacity={0.7}
        >
          <Text style={st.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={[st.stepperVal, { color }]}>
          {value.toFixed(decimals)}
        </Text>
        <TouchableOpacity
          style={[st.stepBtn, value >= max && st.stepBtnDisabled]}
          onPress={() => value < max && onchange(Math.min(max, inc(value, step)))}
          activeOpacity={0.7}
        >
          <Text style={st.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ── Mini bar visual ── */
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <View style={st.miniBarTrack}>
      <View style={[st.miniBarFill, { width: `${(value / max) * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

/* ── Section Header ── */
function SectionHeader({ title }: { title: string }) {
  return <Text style={st.sectionHeader}>{title}</Text>;
}

/* ── Settings Row ── */
function SettingsRow({
  icon, label, value, onPress, rightEl,
}: { icon: string; label: string; value?: string; onPress?: () => void; rightEl?: React.ReactNode }) {
  return (
    <TouchableOpacity style={st.settingsRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <Text style={st.settingsIcon}>{icon}</Text>
      <Text style={st.settingsLabel}>{label}</Text>
      <View style={st.settingsRight}>
        {value && <Text style={st.settingsValue}>{value}</Text>}
        {rightEl}
        {onPress && !rightEl && <Text style={st.settingsChevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { data, activePreset, applyPreset, patchField } = useDemo();

  const [notifications, setNotifications] = useState(true);
  const [liveMode,       setLiveMode]      = useState(false);
  const [unitMetric,     setUnitMetric]    = useState(true);
  const [ringConnected,  setRingConnected] = useState(false);

  const PRESETS: Array<{ key: 'peak' | 'normal' | 'rest'; label: string; emoji: string; desc: string; color: string }> = [
    { key: 'peak',   label: 'Peak Day',    emoji: '🔥', desc: 'HRV High · Rest Well · High Energy', color: Colors.green },
    { key: 'normal', label: 'Normal Day',  emoji: '✅', desc: 'Balanced · Moderate Recovery',        color: Colors.blue  },
    { key: 'rest',   label: 'Rest Day',    emoji: '😴', desc: 'Low HRV · High Stress · Tired',       color: Colors.red   },
  ];

  return (
    <SafeAreaView style={st.safe}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Profile ── */}
        <View style={st.profileCard}>
          <View style={st.avatar}>
            <Text style={st.avatarText}>NA</Text>
          </View>
          <View style={st.profileInfo}>
            <Text style={st.profileName}>Noah Akmal</Text>
            <Text style={st.profileEmail}>bskeraoo@gmail.com</Text>
            <View style={st.profileBadge}>
              <Text style={st.profileBadgeText}>🥇 Pro Member · Level 12</Text>
            </View>
          </View>
        </View>

        {/* ── Smart Ring ── */}
        <SectionHeader title="DEVICE" />
        <View style={st.card}>
          <SettingsRow
            icon="💍" label="Smart Ring" value={ringConnected ? 'Connected' : 'Not Connected'}
            rightEl={
              <Switch
                value={ringConnected}
                onValueChange={setRingConnected}
                trackColor={{ false: Colors.border, true: Colors.green + '60' }}
                thumbColor={ringConnected ? Colors.green : Colors.muted2}
              />
            }
          />
          {ringConnected && (
            <View style={st.ringStatus}>
              <View style={st.ringStatusDot} />
              <Text style={st.ringStatusText}>VitalCore Ring · Battery 87% · Last sync 2m ago</Text>
            </View>
          )}
          <SettingsRow icon="🔄" label="Sync Interval" value="Every 5 min" onPress={() => {}} />
          <SettingsRow icon="📡" label="Bluetooth"      value="On"          onPress={() => {}} />
        </View>

        {/* ── Demo Simulator ── */}
        <SectionHeader title="DEMO SIMULATOR" />
        <View style={[st.card, st.simulatorCard]}>
          <View style={st.simHeader}>
            <Text style={st.simTitle}>🧪 Biometric Simulator</Text>
            <Text style={st.simSub}>ปรับค่าสำหรับทดสอบ Demo</Text>
          </View>

          {/* Preset Buttons */}
          <View style={st.presetRow}>
            {PRESETS.map(p => (
              <Pressable
                key={p.key}
                style={[st.presetBtn, activePreset === p.key && { borderColor: p.color, backgroundColor: p.color + '18' }]}
                onPress={() => applyPreset(p.key)}
              >
                <Text style={st.presetEmoji}>{p.emoji}</Text>
                <Text style={[st.presetLabel, activePreset === p.key && { color: p.color }]}>{p.label}</Text>
                <Text style={st.presetDesc}>{p.desc}</Text>
              </Pressable>
            ))}
          </View>

          <View style={st.divider} />
          <Text style={st.simSubLabel}>FINE TUNE</Text>

          {/* Steppers */}
          <Stepper label="HRV" unit="ms" value={data.hrv} step={5} min={20} max={160} color={Colors.green}
            onchange={v => patchField('hrv', v)} />
          <MiniBar value={data.hrv} max={160} color={Colors.green} />

          <Stepper label="Resting HR" unit="bpm" value={data.hr} step={2} min={40} max={100} color={Colors.red}
            onchange={v => patchField('hr', v)} />
          <MiniBar value={data.hr} max={100} color={Colors.red} />

          <Stepper label="SpO₂" unit="%" value={data.spo2} step={1} min={85} max={100} color={Colors.blue}
            onchange={v => patchField('spo2', v)} />
          <MiniBar value={data.spo2 - 85} max={15} color={Colors.blue} />

          <Stepper label="Sleep" unit="hrs" value={data.sleep} step={0.5} min={0} max={12} decimals={1} color={Colors.blue}
            onchange={v => patchField('sleep', v)} />
          <MiniBar value={data.sleep} max={12} color={Colors.blue} />

          <Stepper label="Recovery" unit="%" value={data.recovery} step={5} min={0} max={100} color={Colors.green}
            onchange={v => patchField('recovery', v)} />
          <MiniBar value={data.recovery} max={100} color={Colors.green} />

          <Stepper label="Strain" unit="%" value={data.strain} step={5} min={0} max={100} color={Colors.amber}
            onchange={v => patchField('strain', v)} />
          <MiniBar value={data.strain} max={100} color={Colors.amber} />

          <Stepper label="Stress" unit="%" value={data.stress} step={5} min={0} max={100}
            color={data.stress > 60 ? Colors.red : data.stress > 35 ? Colors.amber : Colors.green}
            onchange={v => patchField('stress', v)} />
          <MiniBar value={data.stress} max={100}
            color={data.stress > 60 ? Colors.red : data.stress > 35 ? Colors.amber : Colors.green} />

          <Stepper label="Steps" unit="" value={data.steps} step={500} min={0} max={30000} color={Colors.amber}
            onchange={v => patchField('steps', v)} />
          <MiniBar value={data.steps} max={30000} color={Colors.amber} />

          <Stepper label="VO₂ Max" unit="ml/kg" value={data.vo2max} step={1} min={20} max={70} color={Colors.green}
            onchange={v => patchField('vo2max', v)} />
          <MiniBar value={data.vo2max - 20} max={50} color={Colors.green} />

          <Stepper label="Resp Rate" unit="/min" value={data.respRate} step={1} min={8} max={30} color={Colors.muted2}
            onchange={v => patchField('respRate', v)} />
          <MiniBar value={data.respRate - 8} max={22} color={Colors.muted2} />

          <Stepper label="Skin Temp" unit="°C" value={data.temp} step={0.1} min={35} max={38.5} decimals={1} color={Colors.muted2}
            onchange={v => patchField('temp', v)} />
          <MiniBar value={data.temp - 35} max={3.5} color={Colors.muted2} />
        </View>

        {/* ── Notifications ── */}
        <SectionHeader title="NOTIFICATIONS" />
        <View style={st.card}>
          <SettingsRow icon="🔔" label="Push Notifications" rightEl={
            <Switch value={notifications} onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.green + '60' }}
              thumbColor={notifications ? Colors.green : Colors.muted2} />
          } />
          <SettingsRow icon="🪑" label="Posture Alerts"    value="Every 90 min"   onPress={() => {}} />
          <SettingsRow icon="💧" label="Hydration Reminders" value="On"           onPress={() => {}} />
          <SettingsRow icon="🌙" label="Bedtime Reminder"  value="22:30"          onPress={() => {}} />
          <SettingsRow icon="🎯" label="Mission Reminders" value="09:00 daily"    onPress={() => {}} />
        </View>

        {/* ── Preferences ── */}
        <SectionHeader title="PREFERENCES" />
        <View style={st.card}>
          <SettingsRow icon="📏" label="Units" value={unitMetric ? 'Metric' : 'Imperial'} rightEl={
            <Switch value={unitMetric} onValueChange={setUnitMetric}
              trackColor={{ false: Colors.border, true: Colors.green + '60' }}
              thumbColor={unitMetric ? Colors.green : Colors.muted2} />
          } />
          <SettingsRow icon="⚡" label="Live Mode" rightEl={
            <Switch value={liveMode} onValueChange={setLiveMode}
              trackColor={{ false: Colors.border, true: Colors.amber + '60' }}
              thumbColor={liveMode ? Colors.amber : Colors.muted2} />
          } />
          <SettingsRow icon="🌍" label="Language"    value="English / ไทย" onPress={() => {}} />
          <SettingsRow icon="🎨" label="Theme"       value="Dark (Auto)"    onPress={() => {}} />
          <SettingsRow icon="🔒" label="Data Privacy" onPress={() => {}} />
        </View>

        {/* ── Health Data ── */}
        <SectionHeader title="HEALTH PROFILE" />
        <View style={st.card}>
          <SettingsRow icon="👤" label="Age"         value="28 years"    onPress={() => {}} />
          <SettingsRow icon="⚖️" label="Weight"      value="68 kg"       onPress={() => {}} />
          <SettingsRow icon="📏" label="Height"      value="175 cm"      onPress={() => {}} />
          <SettingsRow icon="🏃" label="Activity Level" value="Active"   onPress={() => {}} />
          <SettingsRow icon="🎯" label="Daily Step Goal" value="10,000"  onPress={() => {}} />
          <SettingsRow icon="😴" label="Sleep Goal"   value="8 hours"    onPress={() => {}} />
        </View>

        {/* ── About ── */}
        <SectionHeader title="ABOUT" />
        <View style={st.card}>
          <SettingsRow icon="📱" label="App Version"   value="0.1.0 (Demo)" />
          <SettingsRow icon="📄" label="Terms of Use"  onPress={() => {}} />
          <SettingsRow icon="🔐" label="Privacy Policy" onPress={() => {}} />
          <SettingsRow icon="📮" label="Contact Us"    onPress={() => {}} />
        </View>

        {/* Sign Out */}
        <Pressable style={st.signOutBtn}>
          <Text style={st.signOutText}>Sign Out</Text>
        </Pressable>

        <Text style={st.footerText}>VitalCore · Built with ❤️ for health</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingBottom: 48, gap: 12 },

  /* Profile */
  profileCard:    { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 20, borderWidth: 1, borderColor: Colors.border, gap: 16, alignItems: 'center', marginBottom: 4 },
  avatar:         { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.green + '30', borderWidth: 2, borderColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
  avatarText:     { fontSize: 20, fontWeight: '800', color: Colors.green },
  profileInfo:    { flex: 1, gap: 3 },
  profileName:    { fontSize: 18, fontWeight: '800', color: Colors.text },
  profileEmail:   { fontSize: 13, color: Colors.muted2 },
  profileBadge:   { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, backgroundColor: Colors.amberDim, borderRadius: 20, marginTop: 4 },
  profileBadgeText:{ fontSize: 11, fontWeight: '700', color: Colors.amber },

  sectionHeader: { fontSize: 11, fontWeight: '700', color: Colors.muted, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 8, marginBottom: 2, paddingLeft: 2 },

  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },

  /* Ring Status */
  ringStatus:    { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  ringStatusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.green },
  ringStatusText:{ fontSize: 11, color: Colors.muted2 },

  /* Settings Row */
  settingsRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingsIcon:   { fontSize: 18, width: 26, textAlign: 'center' },
  settingsLabel:  { flex: 1, fontSize: 15, color: Colors.text, fontWeight: '500' },
  settingsRight:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingsValue:  { fontSize: 13, color: Colors.muted2 },
  settingsChevron:{ fontSize: 20, color: Colors.muted, lineHeight: 22 },

  /* Simulator */
  simulatorCard: { padding: 20, gap: 8 },
  simHeader:     { gap: 2, marginBottom: 4 },
  simTitle:      { fontSize: 16, fontWeight: '800', color: Colors.text },
  simSub:        { fontSize: 12, color: Colors.muted2 },
  simSubLabel:   { fontSize: 10, fontWeight: '700', color: Colors.muted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 },

  presetRow: { flexDirection: 'row', gap: 8 },
  presetBtn: {
    flex: 1, backgroundColor: Colors.surface2, borderRadius: Radius.sm,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, gap: 4,
  },
  presetEmoji: { fontSize: 20 },
  presetLabel: { fontSize: 12, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  presetDesc:  { fontSize: 9,  color: Colors.muted, textAlign: 'center', lineHeight: 14 },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },

  stepperRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 2 },
  stepperLeft:    { flex: 1 },
  stepperLabel:   { fontSize: 13, fontWeight: '600', color: Colors.text },
  stepperUnit:    { fontSize: 11, color: Colors.muted },
  stepperControls:{ flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepperVal:     { fontSize: 17, fontWeight: '800', letterSpacing: -0.5, minWidth: 52, textAlign: 'center' },
  stepBtn:        { width: 30, height: 30, borderRadius: 10, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  stepBtnDisabled:{ opacity: 0.35 },
  stepBtnText:    { fontSize: 18, color: Colors.text, lineHeight: 22 },

  miniBarTrack: { height: 3, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  miniBarFill:  { height: '100%', borderRadius: 2 },

  /* Sign Out */
  signOutBtn:  { backgroundColor: Colors.redDim, borderRadius: Radius.md, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,77,106,0.3)', marginTop: 8 },
  signOutText: { fontSize: 15, fontWeight: '700', color: Colors.red },

  footerText:  { textAlign: 'center', fontSize: 12, color: Colors.muted, marginTop: 4 },
});
