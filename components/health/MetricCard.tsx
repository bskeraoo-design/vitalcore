import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/theme';

type TrendDir = 'up' | 'down' | 'flat';

interface MetricCardProps {
  icon:      string;
  value:     string;
  label:     string;
  trend?:    string;
  trendDir?: TrendDir;
  color?:    string;
  onPress?:  () => void;
}

const TREND_COLORS: Record<TrendDir, string> = {
  up:   Colors.green,
  down: Colors.red,
  flat: Colors.muted2,
};
const TREND_BG: Record<TrendDir, string> = {
  up:   'rgba(0,232,122,0.12)',
  down: 'rgba(255,71,87,0.12)',
  flat: 'rgba(90,90,112,0.15)',
};

export function MetricCard({ icon, value, label, trend, trendDir = 'flat', color = Colors.text, onPress }: MetricCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {trend && (
        <View style={[styles.trendBadge, { backgroundColor: TREND_BG[trendDir] }]}>
          <Text style={[styles.trendText, { color: TREND_COLORS[trendDir] }]}>{trend}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface2,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  pressed:    { opacity: 0.8, transform: [{ scale: 0.97 }] },
  iconWrap:   { width: 34, height: 34, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  icon:       { fontSize: 18 },
  value:      { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  label:      { fontSize: 11, color: Colors.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  trendBadge: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20, marginTop: 2 },
  trendText:  { fontSize: 11, fontWeight: '700' },
});
