import { useDemo } from '@/lib/DemoContext';
import { DarkColors, LightColors } from '@/constants/theme';

export function useColors() {
  const { isDark } = useDemo();
  return isDark ? DarkColors : LightColors;
}

export type AppColors = ReturnType<typeof useColors>;
