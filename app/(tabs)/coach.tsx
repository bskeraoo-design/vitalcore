import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing, Radius } from '@/constants/theme';
import { useColors } from '@/hooks/use-app-colors';

export default function CoachScreen() {
  const C = useColors();
  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <View style={s.container}>
        <View style={[s.glow, { backgroundColor: `${C.green}06` }]} />
        <Text style={s.emoji}>🤖</Text>
        <Text style={[s.title, { color: C.text }]}>Bewell AI Coach</Text>
        <View style={[s.badge, { backgroundColor: C.amberDim, borderColor: `${C.amber}55` }]}>
          <Text style={[s.badgeText, { color: C.amber }]}>🚧 กำลังพัฒนา</Text>
        </View>
        <Text style={[s.desc, { color: C.muted2 }]}>
          ระบบโค้ชอัจฉริยะที่วิเคราะห์{'\n'}พฤติกรรมสุขภาพของคุณเชิงลึก{'\n'}
          จะพร้อมใช้งานเร็วๆ นี้
        </Text>
        <View style={[s.eta, { backgroundColor: C.surface, borderColor: C.border }]}>
          <Text style={[s.etaText, { color: C.muted2 }]}>🚀 Coming Soon — Q3 2026</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, gap: 20 },
  glow:      { width: 400, height: 400, borderRadius: 200, position: 'absolute' },
  emoji:     { fontSize: 64 },
  title:     { fontSize: 28, fontWeight: '900', letterSpacing: -0.5, textAlign: 'center' },
  badge:     { paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.full, borderWidth: 1 },
  badgeText: { fontSize: 16, fontWeight: '800' },
  desc:      { fontSize: 16, lineHeight: 26, textAlign: 'center' },
  eta:       { paddingHorizontal: 20, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1 },
  etaText:   { fontSize: 13 },
});
