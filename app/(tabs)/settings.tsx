import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  Switch, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing, Radius } from '@/constants/theme';
import { useDemo } from '@/lib/DemoContext';
import { useColors } from '@/hooks/use-app-colors';
import { HealthSnapshot } from '@/lib/scoring';

function Stepper({
  label, unit, value, step, min, max, decimals = 0, color,
  onchange,
}: {
  label: string; unit: string; value: number; step: number;
  min: number; max: number; decimals?: number; color: string;
  onchange: (v: number) => void;
}) {
  const C = useColors();
  const dec = (v: number, s: number) =>
    Math.round((v - s) * 10 ** decimals) / 10 ** decimals;
  const inc = (v: number, s: number) =>
    Math.round((v + s) * 10 ** decimals) / 10 ** decimals;

  return (
    <View style={st.stepperRow}>
      <View style={st.stepperLeft}>
        <Text style={[st.stepperLabel, { color: C.text }]}>{label}</Text>
        <Text style={[st.stepperUnit, { color: C.muted }]}>{unit}</Text>
      </View>
      <View style={st.stepperControls}>
        <TouchableOpacity
          style={[st.stepBtn, { backgroundColor: C.surface2, borderColor: C.border }, value <= min && st.stepBtnDisabled]}
          onPress={() => value > min && onchange(Math.max(min, dec(value, step)))}
          activeOpacity={0.7}
        >
          <Text style={[st.stepBtnText, { color: C.text }]}>−</Text>
        </TouchableOpacity>
        <Text style={[st.stepperVal, { color }]}>
          {value.toFixed(decimals)}
        </Text>
        <TouchableOpacity
          style={[st.stepBtn, { backgroundColor: C.surface2, borderColor: C.border }, value >= max && st.stepBtnDisabled]}
          onPress={() => value < max && onchange(Math.min(max, inc(value, step)))}
          activeOpacity={0.7}
        >
          <Text style={[st.stepBtnText, { color: C.text }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const C = useColors();
  return (
    <View style={[st.miniBarTrack, { backgroundColor: C.border }]}>
      <View style={[st.miniBarFill, { width: `${(value / max) * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const C = useColors();
  return <Text style={[st.sectionHeader, { color: C.muted }]}>{title}</Text>;
}

function SettingsRow({
  icon, label, value, onPress, rightEl,
}: { icon: string; label: string; value?: string; onPress?: () => void; rightEl?: React.ReactNode }) {
  const C = useColors();
  return (
    <TouchableOpacity style={[st.settingsRow, { borderBottomColor: C.border }]} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <Text style={st.settingsIcon}>{icon}</Text>
      <Text style={[st.settingsLabel, { color: C.text }]}>{label}</Text>
      <View style={st.settingsRight}>
        {value && <Text style={[st.settingsValue, { color: C.muted2 }]}>{value}</Text>}
        {rightEl}
        {onPress && !rightEl && <Text style={[st.settingsChevron, { color: C.muted }]}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { data, patchField, isDark, toggleTheme } = useDemo();
  const C = useColors();

  const [notifications, setNotifications] = useState(true);
  const [liveMode,       setLiveMode]      = useState(false);
  const [unitMetric,     setUnitMetric]    = useState(true);
  const [ringConnected,  setRingConnected] = useState(false);

  const stressColor = data.stress > 60 ? C.red : data.stress > 35 ? C.amber : C.green;

  return (
    <SafeAreaView style={[st.safe, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile */}
        <View style={[st.profileCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={[st.avatar, { backgroundColor: `${C.green}30`, borderColor: C.green }]}>
            <Text style={[st.avatarText, { color: C.green }]}>NA</Text>
          </View>
          <View style={st.profileInfo}>
            <Text style={[st.profileName, { color: C.text }]}>Noah Akmal</Text>
            <Text style={[st.profileEmail, { color: C.muted2 }]}>bskeraoo@gmail.com</Text>
            <View style={[st.profileBadge, { backgroundColor: C.amberDim }]}>
              <Text style={[st.profileBadgeText, { color: C.amber }]}>🥇 Pro Member · Level 12</Text>
            </View>
          </View>
        </View>

        {/* Device */}
        <SectionHeader title="DEVICE" />
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <SettingsRow
            icon="💍" label="Smart Ring" value={ringConnected ? 'Connected' : 'Not Connected'}
            rightEl={
              <Switch
                value={ringConnected}
                onValueChange={setRingConnected}
                trackColor={{ false: C.border, true: `${C.green}60` }}
                thumbColor={ringConnected ? C.green : C.muted2}
              />
            }
          />
          {ringConnected && (
            <View style={st.ringStatus}>
              <View style={[st.ringStatusDot, { backgroundColor: C.green }]} />
              <Text style={[st.ringStatusText, { color: C.muted2 }]}>VitalCore Ring · Battery 87% · Last sync 2m ago</Text>
            </View>
          )}
          <SettingsRow icon="🔄" label="Sync Interval" value="Every 5 min" onPress={() => {}} />
          <SettingsRow icon="📡" label="Bluetooth"      value="On"          onPress={() => {}} />
        </View>

        {/* Demo Simulator — no preset buttons */}
        <SectionHeader title="DEMO SIMULATOR" />
        <View style={[st.card, st.simulatorCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={st.simHeader}>
            <Text style={[st.simTitle, { color: C.text }]}>🧪 Biometric Simulator</Text>
            <Text style={[st.simSub, { color: C.muted2 }]}>ปรับค่าสำหรับทดสอบ Demo</Text>
          </View>

          <Stepper label="HRV"        unit="ms"    value={data.hrv}      step={5}   min={20}  max={160} color={C.green}  onchange={v => patchField('hrv', v)} />
          <MiniBar value={data.hrv} max={160} color={C.green} />

          <Stepper label="Resting HR" unit="bpm"   value={data.hr}       step={2}   min={40}  max={100} color={C.red}    onchange={v => patchField('hr', v)} />
          <MiniBar value={data.hr} max={100} color={C.red} />

          <Stepper label="SpO₂"       unit="%"     value={data.spo2}     step={1}   min={85}  max={100} color={C.blue}   onchange={v => patchField('spo2', v)} />
          <MiniBar value={data.spo2 - 85} max={15} color={C.blue} />

          <Stepper label="Sleep"      unit="hrs"   value={data.sleep}    step={0.5} min={0}   max={12}  decimals={1} color={C.blue} onchange={v => patchField('sleep', v)} />
          <MiniBar value={data.sleep} max={12} color={C.blue} />

          <Stepper label="Recovery"   unit="%"     value={data.recovery} step={5}   min={0}   max={100} color={C.green}  onchange={v => patchField('recovery', v)} />
          <MiniBar value={data.recovery} max={100} color={C.green} />

          <Stepper label="Strain"     unit="%"     value={data.strain}   step={5}   min={0}   max={100} color={C.amber}  onchange={v => patchField('strain', v)} />
          <MiniBar value={data.strain} max={100} color={C.amber} />

          <Stepper label="Stress"     unit="%"     value={data.stress}   step={5}   min={0}   max={100} color={stressColor} onchange={v => patchField('stress', v)} />
          <MiniBar value={data.stress} max={100} color={stressColor} />

          <Stepper label="Steps"      unit=""      value={data.steps}    step={500} min={0}   max={30000} color={C.amber} onchange={v => patchField('steps', v)} />
          <MiniBar value={data.steps} max={30000} color={C.amber} />

          <Stepper label="VO₂ Max"    unit="ml/kg" value={data.vo2max}   step={1}   min={20}  max={70}  color={C.green}  onchange={v => patchField('vo2max', v)} />
          <MiniBar value={data.vo2max - 20} max={50} color={C.green} />

          <Stepper label="Resp Rate"  unit="/min"  value={data.respRate} step={1}   min={8}   max={30}  color={C.muted2} onchange={v => patchField('respRate', v)} />
          <MiniBar value={data.respRate - 8} max={22} color={C.muted2} />

          <Stepper label="Skin Temp"  unit="°C"    value={data.temp}     step={0.1} min={35}  max={38.5} decimals={1} color={C.muted2} onchange={v => patchField('temp', v)} />
          <MiniBar value={data.temp - 35} max={3.5} color={C.muted2} />
        </View>

        {/* Notifications */}
        <SectionHeader title="NOTIFICATIONS" />
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <SettingsRow icon="🔔" label="Push Notifications" rightEl={
            <Switch value={notifications} onValueChange={setNotifications}
              trackColor={{ false: C.border, true: `${C.green}60` }}
              thumbColor={notifications ? C.green : C.muted2} />
          } />
          <SettingsRow icon="🪑" label="Posture Alerts"       value="Every 90 min"   onPress={() => {}} />
          <SettingsRow icon="💧" label="Hydration Reminders"  value="On"             onPress={() => {}} />
          <SettingsRow icon="🌙" label="Bedtime Reminder"     value="22:30"          onPress={() => {}} />
          <SettingsRow icon="🎯" label="Mission Reminders"    value="09:00 daily"    onPress={() => {}} />
        </View>

        {/* Preferences */}
        <SectionHeader title="PREFERENCES" />
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <SettingsRow icon="📏" label="Units" value={unitMetric ? 'Metric' : 'Imperial'} rightEl={
            <Switch value={unitMetric} onValueChange={setUnitMetric}
              trackColor={{ false: C.border, true: `${C.green}60` }}
              thumbColor={unitMetric ? C.green : C.muted2} />
          } />
          <SettingsRow icon="⚡" label="Live Mode" rightEl={
            <Switch value={liveMode} onValueChange={setLiveMode}
              trackColor={{ false: C.border, true: `${C.amber}60` }}
              thumbColor={liveMode ? C.amber : C.muted2} />
          } />
          {/* Theme Toggle */}
          <SettingsRow
            icon={isDark ? '🌙' : '☀️'}
            label={isDark ? 'Dark Mode' : 'Light Mode'}
            rightEl={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: `${C.amber}60`, true: `${C.blue}60` }}
                thumbColor={isDark ? C.blue : C.amber}
              />
            }
          />
          <SettingsRow icon="🌍" label="Language"     value="English / ไทย" onPress={() => {}} />
          <SettingsRow icon="🔒" label="Data Privacy"                       onPress={() => {}} />
        </View>

        {/* Health Profile */}
        <SectionHeader title="HEALTH PROFILE" />
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <SettingsRow icon="👤" label="Age"             value="28 years"   onPress={() => {}} />
          <SettingsRow icon="⚖️" label="Weight"          value="68 kg"      onPress={() => {}} />
          <SettingsRow icon="📏" label="Height"          value="175 cm"     onPress={() => {}} />
          <SettingsRow icon="🏃" label="Activity Level"  value="Active"     onPress={() => {}} />
          <SettingsRow icon="🎯" label="Daily Step Goal" value="10,000"     onPress={() => {}} />
          <SettingsRow icon="😴" label="Sleep Goal"      value="8 hours"    onPress={() => {}} />
        </View>

        {/* About */}
        <SectionHeader title="ABOUT" />
        <View style={[st.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <SettingsRow icon="📱" label="App Version"    value="0.1.0 (Demo)" />
          <SettingsRow icon="📄" label="Terms of Use"   onPress={() => {}} />
          <SettingsRow icon="🔐" label="Privacy Policy" onPress={() => {}} />
          <SettingsRow icon="📮" label="Contact Us"     onPress={() => {}} />
        </View>

        <Pressable style={[st.signOutBtn, { backgroundColor: C.redDim, borderColor: `${C.red}50` }]}>
          <Text style={[st.signOutText, { color: C.red }]}>Sign Out</Text>
        </Pressable>

        <Text style={[st.footerText, { color: C.muted }]}>VitalCore · Built with ❤️ for health</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: 48, gap: 12 },

  profileCard:      { flexDirection: 'row', borderRadius: Radius.lg, padding: 20, borderWidth: 1, gap: 16, alignItems: 'center', marginBottom: 4 },
  avatar:           { width: 56, height: 56, borderRadius: 28, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  avatarText:       { fontSize: 20, fontWeight: '800' },
  profileInfo:      { flex: 1, gap: 3 },
  profileName:      { fontSize: 18, fontWeight: '800' },
  profileEmail:     { fontSize: 13 },
  profileBadge:     { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 4 },
  profileBadgeText: { fontSize: 11, fontWeight: '700' },

  sectionHeader: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 8, marginBottom: 2, paddingLeft: 2 },

  card: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },

  ringStatus:     { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  ringStatusDot:  { width: 7, height: 7, borderRadius: 4 },
  ringStatusText: { fontSize: 11 },

  settingsRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1 },
  settingsIcon:    { fontSize: 18, width: 26, textAlign: 'center' },
  settingsLabel:   { flex: 1, fontSize: 15, fontWeight: '500' },
  settingsRight:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingsValue:   { fontSize: 13 },
  settingsChevron: { fontSize: 20, lineHeight: 22 },

  simulatorCard: { padding: 20, gap: 8 },
  simHeader:     { gap: 2, marginBottom: 4 },
  simTitle:      { fontSize: 16, fontWeight: '800' },
  simSub:        { fontSize: 12 },

  stepperRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 2 },
  stepperLeft:     { flex: 1 },
  stepperLabel:    { fontSize: 13, fontWeight: '600' },
  stepperUnit:     { fontSize: 11 },
  stepperControls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepperVal:      { fontSize: 17, fontWeight: '800', letterSpacing: -0.5, minWidth: 52, textAlign: 'center' },
  stepBtn:         { width: 30, height: 30, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepBtnDisabled: { opacity: 0.35 },
  stepBtnText:     { fontSize: 18, lineHeight: 22 },

  miniBarTrack: { height: 3, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  miniBarFill:  { height: '100%', borderRadius: 2 },

  signOutBtn:  { borderRadius: Radius.md, padding: 16, alignItems: 'center', borderWidth: 1, marginTop: 8 },
  signOutText: { fontSize: 15, fontWeight: '700' },

  footerText: { textAlign: 'center', fontSize: 12, marginTop: 4 },
});
