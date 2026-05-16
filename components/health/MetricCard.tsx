import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-app-colors';
import { SparkLine } from './SparkLine';

type TrendDir = 'up' | 'down' | 'flat';

interface MetricCardProps {
  icon:       string;
  value:      string;
  label:      string;
  trend?:     string;
  trendDir?:  TrendDir;
  color?:     string;
  sparkData?: number[];
  onPress?:   () => void;
}

export function MetricCard({ icon, value, label, trend, trendDir = 'flat', color, sparkData, onPress }: MetricCardProps) {
  const C = useColors();
  const cardColor = color ?? C.text;

  const TREND_COLORS: Record<TrendDir, string> = {
    up:   C.green,
    down: C.red,
    flat: C.muted2,
  };
  const TREND_BG: Record<TrendDir, string> = {
    up:   C.greenDim,
    down: C.redDim,
    flat: `${C.muted2}22`,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: C.surface2, borderColor: C.border },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${cardColor}22` }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.topRow}>
        <Text style={[styles.value, { color: cardColor }]}>{value}</Text>
        {sparkData && <SparkLine data={sparkData} color={cardColor} width={58} height={28} />}
      </View>
      <Text style={[styles.label, { color: C.muted }]}>{label}</Text>
      {trend && (
        <View style={[styles.trendBadge, { backgroundColor: TREND_BG[trendDir] }]}>
          <Text style={[styles.trendText, { color: TREND_COLORS[trendDir] }]}>{trend}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card:       { flex: 1, minWidth: '45%', borderRadius: 14, padding: 14, borderWidth: 1, gap: 4 },
  pressed:    { opacity: 0.8, transform: [{ scale: 0.97 }] },
  topRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconWrap:   { width: 34, height: 34, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  icon:       { fontSize: 18 },
  value:      { fontSize: 18, fontWeight: '800', letterSpacing: -0.3, flex: 1 },
  label:      { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  trendBadge: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20, marginTop: 2 },
  trendText:  { fontSize: 11, fontWeight: '700' },
});
