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
    tint: tintColorLight,
    bg: '#F7FAF5',
    text: '#1A1A1A',
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
    tint: tintColorDark,
    bg: '#F7FAF5',
    text: '#0000',
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
    sans: 'Inter',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'SF Pro Rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'SFMono-Regular',
    // Design system families
    manrope: 'Manrope',
    inter: 'Inter',
    // Typographic scale (px)
    displayLg: 56,
    headlineMd: 28,
    titleMd: 18,
    bodyLg: 16,
  },
  default: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    manrope: 'Manrope',
    inter: 'Inter',
    displayLg: 56,
    headlineMd: 28,
    titleMd: 18,
    bodyLg: 16,
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    manrope: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    inter: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    displayLg: 56,
    headlineMd: 28,
    titleMd: 18,
    bodyLg: 16,
  },
});

export const spacing = {
    rSm: 8,
    rMd: 14,
    rLg: 20,
    rXl: 28,
};

