import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { useColors } from '@/hooks/use-app-colors';

function TabIcon({ emoji, active }: { emoji: string; active: boolean }) {
  return <Text style={{ fontSize: 20, opacity: active ? 1 : 0.4 }}>{emoji}</Text>;
}

export default function TabLayout() {
  const C = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor:  C.surface,
          borderTopColor:   C.border,
          borderTopWidth:   1,
          height:           82,
          paddingBottom:    22,
          paddingTop:       8,
        },
        tabBarActiveTintColor:   C.green,
        tabBarInactiveTintColor: C.muted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" active={focused} />,
        }}
      />
      <Tabs.Screen
        name="recovery"
        options={{
          title: 'Recovery',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📈" active={focused} />,
        }}
      />
      <Tabs.Screen
        name="strain"
        options={{
          title: 'Strain',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" active={focused} />,
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Sleep',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🌙" active={focused} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" active={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" active={focused} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
