import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedProps, withTiming, Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WellnessGaugeProps {
  score:     number;   // 0–100
  label:     string;   // "Excellent", "Good", etc.
  delta?:    string;   // e.g. "+5 from yesterday"
}

const SIZE       = 220;
const STROKE_W   = 18;
const cx         = SIZE / 2;
const cy         = SIZE / 2;
const r          = (SIZE - STROKE_W) / 2;
const CIRC       = 2 * Math.PI * r;
const ARC_FRAC   = 0.72;   // 259° visible arc
const ARC_LEN    = CIRC * ARC_FRAC;
const GAP_LEN    = CIRC - ARC_LEN;
// Rotation so the arc starts at bottom-left and ends at bottom-right
const ROTATION   = 90 + (1 - ARC_FRAC) * 180;

function scoreColor(score: number): string {
  if (score >= 70) return Colors.green;
  if (score >= 45) return Colors.amber;
  return Colors.red;
}

export function WellnessGauge({ score, label, delta }: WellnessGaugeProps) {
  const progress = useSharedValue(0);
  const color    = scoreColor(score);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1600,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: ARC_LEN * (1 - progress.value),
  }));

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        {/* Track arc */}
        <Circle
          cx={cx} cy={cy} r={r}
          stroke={Colors.border}
          strokeWidth={STROKE_W}
          fill="none"
          strokeDasharray={`${ARC_LEN} ${GAP_LEN}`}
          rotation={ROTATION}
          origin={`${cx}, ${cy}`}
          strokeLinecap="round"
        />
        {/* Fill arc (animated) */}
        <AnimatedCircle
          cx={cx} cy={cy} r={r}
          stroke={color}
          strokeWidth={STROKE_W}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${ARC_LEN} ${GAP_LEN}`}
          rotation={ROTATION}
          origin={`${cx}, ${cy}`}
          animatedProps={animatedProps}
        />
      </Svg>

      {/* Center content */}
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text style={styles.sectionLabel}>WELLNESS SCORE</Text>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={styles.label}>{label}</Text>
        {delta && <Text style={styles.delta}>{delta}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { alignItems: 'center', justifyContent: 'center', width: SIZE, height: SIZE },
  center:       { justifyContent: 'center', alignItems: 'center', gap: 2 },
  sectionLabel: { fontSize: 9, fontWeight: '700', color: Colors.muted2, letterSpacing: 1.5, textTransform: 'uppercase' },
  score:        { fontSize: 52, fontWeight: '900', letterSpacing: -2, lineHeight: 56 },
  label:        { fontSize: 14, fontWeight: '700', color: Colors.text, marginTop: 2 },
  delta:        { fontSize: 11, color: Colors.green, fontWeight: '600', marginTop: 2 },
});
