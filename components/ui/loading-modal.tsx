import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  visible: boolean;
  message?: string;
};

export function LoadingModal({ visible, message = 'Veuillez patienter...' }: Props) {
  const accent = useThemeColor({}, 'darkGreen') as string;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={accent} />
          <ThemedText style={styles.message}>{message}</ThemedText>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  container: { padding: 18, borderRadius: 12, backgroundColor: '#fff', minWidth: 200, alignItems: 'center' },
  message: { marginTop: 12 },
});
