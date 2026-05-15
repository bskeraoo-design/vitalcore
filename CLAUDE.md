# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
npm install          # Install dependencies
npx expo start       # Start dev server with QR code (for Expo Go)
npm run android      # Start and open on Android
npm run ios          # Start and open on iOS (macOS only)
npm run web          # Start and open in browser
npm run lint         # Run ESLint
npm run reset-project  # Clear starter code and start fresh
```

## Architecture

This is an **Expo 54 + React Native** app using **file-based routing** via `expo-router`.

### Routing

- `app/_layout.tsx` — Root layout: wraps the entire app in a `ThemeProvider` (dark/light), defines a `Stack` navigator with two routes: `(tabs)` and `modal`
- `app/(tabs)/_layout.tsx` — Tab navigator with two tabs: Home and Explore
- `app/(tabs)/index.tsx` — Home screen
- `app/(tabs)/explore.tsx` — Explore screen
- `app/modal.tsx` — Modal screen (presented over tabs)

New screens go inside `app/`. New tabs go inside `app/(tabs)/`. The `@/` alias maps to the project root.

### Theming

- `constants/theme.ts` exports `Colors` (light/dark palettes) and `Fonts` (platform-specific font stacks)
- `hooks/use-color-scheme.ts` — wraps React Native's `useColorScheme`; `.web.ts` variant handles web-specific behavior
- `hooks/use-theme-color.ts` — resolves a color name from `Colors` based on current scheme; accepts per-component light/dark overrides

Themed primitives live in `components/themed-text.tsx` and `components/themed-view.tsx`. Use these instead of raw `Text`/`View` to inherit theme colors automatically.

### Key flags (app.json)

- `newArchEnabled: true` — React Native New Architecture is on
- `experiments.reactCompiler: true` — React Compiler is enabled
- `experiments.typedRoutes: true` — Expo Router typed routes are on

### Notes on Bluetooth

Bluetooth (BLE or Classic) requires a **Development Build** — it cannot run inside Expo Go. Use `eas build --profile development` to build a dev client before adding `react-native-ble-plx` or `react-native-bluetooth-classic`.
