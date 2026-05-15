import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius } from '@/constants/theme';

export default function CoachScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>

        <View style={s.glow} />

        <Text style={s.emoji}>🤖</Text>
        <Text style={s.title}>Bewell AI Coach</Text>

        <View style={s.badge}>
          <Text style={s.badgeText}>🚧 กำลังพัฒนา</Text>
        </View>

        <Text style={s.desc}>
          ระบบโค้ชอัจฉริยะที่วิเคราะห์{'\n'}พฤติกรรมสุขภาพของคุณเชิงลึก{'\n'}
          จะพร้อมใช้งานเร็วๆ นี้
        </Text>

        <View style={s.eta}>
          <Text style={s.etaText}>🚀 Coming Soon — Q3 2026</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, gap: 20 },
  glow:      { width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(0,207,168,0.06)', position: 'absolute' },
  emoji:     { fontSize: 64 },
  title:     { fontSize: 28, fontWeight: '900', color: Colors.text, letterSpacing: -0.5, textAlign: 'center' },
  badge:     { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.amberDim, borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,107,74,0.35)' },
  badgeText: { fontSize: 16, fontWeight: '800', color: Colors.amber },
  desc:      { fontSize: 16, color: Colors.muted2, lineHeight: 26, textAlign: 'center' },
  eta:       { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: Colors.surface, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border },
  etaText:   { fontSize: 13, color: Colors.muted2 },
});
