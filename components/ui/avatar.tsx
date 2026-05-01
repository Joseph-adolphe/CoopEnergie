import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type AvatarProps = {
  uri?: string;
  name?: string;
  size?: number;
  style?: any;
};

export function Avatar({ uri, name, size = 40, style }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const bg = useThemeColor({}, 'accentGreen');
  const textColor = useThemeColor({}, 'white');

  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  if (uri && !errored) {
    return (
      <Image
        source={{ uri }}
        onError={() => setErrored(true)}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }, style]}>
      <ThemedText style={[styles.initials, { color: textColor }]}>{initials}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontWeight: '700' },
});
