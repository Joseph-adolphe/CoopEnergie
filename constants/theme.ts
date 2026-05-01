/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#00450D';
const tintColorDark = '#fff';

// Colors contains both the classic keys used across the starter app
// (text, background, tint, icon, tabIconDefault, tabIconSelected)
// and the new design tokens requested in the design system.
export const Colors = {
  light: {
    // classic keys
    text: '#00450D',
    background: '#F7FAF5',
    tint: tintColorLight,
    icon: '#41493E',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    // design system tokens
    bg: '#F7FAF5',
    darkGreen: '#00450D',
    accentGreen: '#5be074',
    textPrimary: '#00450D',
    textMuted: '#41493E',
    white: '#ffffff',
    cyanCard: '#c8f5ea',
    grayCard: '#e0ddd6',
    border: 'rgba(21,43,25,0.14)',
  },
  dark: {
    // classic keys (simple dark fallback)
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,

    // design system tokens (kept same for now)
    bg: '#F7FAF5',
    darkGreen: '#00450D',
    accentGreen: '#5be074',
    textPrimary: '#00450D',
    textMuted: '#41493E',
    white: '#ffffff',
    cyanCard: '#c8f5ea',
    grayCard: '#e0ddd6',
    border: 'rgba(21,43,25,0.14)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const spacing = {
    rSm: 8,
    rMd: 14,
    rLg: 20,
    rXl: 28,
};

