import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RingColor = 'green' | 'amber' | 'blue' | 'red';

interface RingChartProps {
  value: number;        // 0–100
  label: string;
  color: RingColor;
  size?: number;
  strokeWidth?: number;
}

const COLOR_MAP: Record<RingColor, string> = {
  green: Colors.green,
  amber: Colors.amber,
  blue:  Colors.blue,
  red:   Colors.red,
};

export function RingChart({ value, label, color, size = 100, strokeWidth = 9 }: RingChartProps) {
  const radius        = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress      = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(value / 100, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const strokeColor = COLOR_MAP[color];
  const displayVal  = value > 0 ? `${value}%` : '--';

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Track */}
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={Colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Fill */}
          <AnimatedCircle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Text style={[styles.value, { color: strokeColor }]}>{displayVal}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  svg:       { transform: [{ rotate: '0deg' }] },
  center:    { justifyContent: 'center', alignItems: 'center' },
  value:     { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  label:     { fontSize: 10, fontWeight: '600', color: Colors.muted2, letterSpacing: 0.4, marginTop: 1 },
});
