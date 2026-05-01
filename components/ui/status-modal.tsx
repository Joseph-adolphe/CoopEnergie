import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Button } from '@/components/ui/button';

type Props = {
  visible: boolean;
  status: 'success' | 'error';
  title?: string;
  message?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  onClose?: () => void;
};

export function StatusModal({ visible, status, title, message, primaryLabel = 'OK', onPrimary, onClose }: Props) {
  const bg = status === 'success' ? '#1b8a2e' : '#c82323';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.iconWrap, { backgroundColor: bg }]}> 
            <ThemedText style={styles.icon}>{status === 'success' ? '✓' : '✕'}</ThemedText>
          </View>

          {title ? <ThemedText type="title">{title}</ThemedText> : null}
          {message ? <ThemedText style={styles.message}>{message}</ThemedText> : null}

          <View style={styles.actions}>
            <Button title={primaryLabel} onPress={onPrimary ?? onClose} variant="primary" />
            <TouchableOpacity onPress={onClose} style={{ marginLeft: 8 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  container: { padding: 18, borderRadius: 12, backgroundColor: '#fff', minWidth: 260, alignItems: 'center' },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  icon: { fontSize: 32, color: '#fff', fontWeight: '700' },
  message: { marginTop: 8, textAlign: 'center' },
  actions: { marginTop: 16, width: '100%' },
});
