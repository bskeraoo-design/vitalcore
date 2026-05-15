import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';

interface CoachingCardProps {
  text:  string;
  tags?: string[];
  status?: 'live' | 'waiting';
}

export function CoachingCard({ text, tags = [], status = 'waiting' }: CoachingCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Coaching</Text>
        <View style={[styles.chip, status === 'live' ? styles.chipLive : styles.chipWait]}>
          <Text style={[styles.chipText, { color: status === 'live' ? Colors.green : Colors.muted2 }]}>
            {status === 'live' ? 'Live' : 'Waiting'}
          </Text>
        </View>
      </View>
      <Text style={styles.body}>{text}</Text>
      {tags.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tags}>
          {tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:     { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border },
  header:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title:    { fontSize: 14, fontWeight: '700', color: Colors.text },
  chip:     { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  chipLive: { backgroundColor: 'rgba(0,232,122,0.15)' },
  chipWait: { backgroundColor: 'rgba(90,90,112,0.15)' },
  chipText: { fontSize: 11, fontWeight: '700' },
  body:     { fontSize: 14, color: Colors.muted2, lineHeight: 22, marginBottom: 12 },
  tags:     {},
  tag:      { paddingHorizontal: 11, paddingVertical: 5, backgroundColor: Colors.surface2, borderRadius: 20, marginRight: 7, borderWidth: 1, borderColor: Colors.border },
  tagText:  { fontSize: 12, fontWeight: '500', color: Colors.muted2 },
});
