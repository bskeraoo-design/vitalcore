import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

type StatusLevel = 'green' | 'amber' | 'red' | 'waiting';

interface StatusBadgeProps {
  level: StatusLevel;
  label: string;
}

const CONFIG: Record<StatusLevel, { color: string; bg: string; border: string }> = {
  green:   { color: Colors.green,  bg: Colors.greenDim,  border: 'rgba(0,207,168,0.28)'  },
  amber:   { color: Colors.amber,  bg: Colors.amberDim,  border: 'rgba(255,107,74,0.28)' },
  red:     { color: Colors.red,    bg: Colors.redDim,    border: 'rgba(255,77,106,0.28)' },
  waiting: { color: Colors.muted2, bg: 'rgba(72,66,104,0.2)', border: 'rgba(72,66,104,0.25)' },
};

export function StatusBadge({ level, label }: StatusBadgeProps) {
  const opacity = useSharedValue(1);
  const cfg     = CONFIG[level];

  useEffect(() => {
    if (level === 'waiting') { opacity.value = 1; return; }
    opacity.value = withRepeat(withTiming(0.35, { duration: 900 }), -1, true);
  }, [level]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <Animated.View style={[styles.dot, { backgroundColor: cfg.color }, dotStyle]} />
      <Text style={[styles.text, { color: cfg.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  dot:   { width: 7, height: 7, borderRadius: 99 },
  text:  { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
});
