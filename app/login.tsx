import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email,    setEmail]    = useState('bskeraoo@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 800);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Glow */}
          <View style={s.glow} />

          {/* Logo */}
          <View style={s.logoWrap}>
            <View style={s.logoIcon}>
              <Text style={s.logoEmoji}>💎</Text>
            </View>
            <Text style={s.appName}>VitalCore</Text>
            <Text style={s.tagline}>Smart Health · Smarter You</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Sign In</Text>
            <Text style={s.cardSub}>เข้าสู่ระบบเพื่อดูข้อมูลสุขภาพของคุณ</Text>

            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Email</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.muted}
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Password</Text>
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={Colors.muted}
              />
            </View>

            <Pressable style={s.forgotBtn}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </Pressable>

            <Pressable
              style={[s.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={s.loginBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            </Pressable>

            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>or</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Google (demo) */}
            <Pressable style={s.googleBtn} onPress={handleLogin}>
              <Text style={s.googleIcon}>G</Text>
              <Text style={s.googleText}>Continue with Google</Text>
            </Pressable>
          </View>

          {/* Demo shortcut */}
          <Pressable style={s.demoBtn} onPress={handleLogin}>
            <Text style={s.demoBtnText}>🧪 Demo Login (ข้ามเข้าระบบ)</Text>
          </Pressable>

          <Text style={s.footer}>
            VitalCore v0.1 · Demo Build
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  scroll:  { padding: Spacing.lg, paddingBottom: 40, alignItems: 'center', gap: 24, flexGrow: 1, justifyContent: 'center' },

  glow: {
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(0,207,168,0.07)',
    position: 'absolute', top: -100,
  },

  logoWrap:  { alignItems: 'center', gap: 10, marginBottom: 8 },
  logoIcon:  { width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.green + '50', alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 38 },
  appName:   { fontSize: 34, fontWeight: '900', color: Colors.text, letterSpacing: -1 },
  tagline:   { fontSize: 14, color: Colors.muted2 },

  card:      { width: '100%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 24, borderWidth: 1, borderColor: Colors.border, gap: 14 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: Colors.text },
  cardSub:   { fontSize: 13, color: Colors.muted2, marginTop: -6 },

  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: Colors.muted2, letterSpacing: 0.3 },
  input: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.text,
  },

  forgotBtn:  { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontSize: 12, color: Colors.green },

  loginBtn:     { backgroundColor: Colors.green, borderRadius: Radius.sm, paddingVertical: 15, alignItems: 'center' },
  loginBtnText: { fontSize: 16, fontWeight: '800', color: '#0C0A1A' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine:{ flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText:{ fontSize: 12, color: Colors.muted },

  googleBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.surface2, borderRadius: Radius.sm, paddingVertical: 13, borderWidth: 1, borderColor: Colors.border },
  googleIcon: { fontSize: 16, fontWeight: '900', color: Colors.text },
  googleText: { fontSize: 15, fontWeight: '600', color: Colors.text },

  demoBtn:     { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: Colors.amberDim, borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,107,74,0.3)' },
  demoBtnText: { fontSize: 13, fontWeight: '700', color: Colors.amber },

  footer: { fontSize: 11, color: Colors.muted, textAlign: 'center' },
});
