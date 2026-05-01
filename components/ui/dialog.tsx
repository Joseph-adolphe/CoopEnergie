import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Button } from '@/components/ui/button';

type DialogProps = {
  visible: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  actions?: Array<{ label: string; onPress: () => void }>; 
};

export function Dialog({ visible, title, children, onClose, actions = [] }: DialogProps) {
  const bg = useThemeColor({}, 'white');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: bg }]}> 
          {title ? <ThemedText type="title">{title}</ThemedText> : null}
          <View style={styles.body}>{children}</View>
          <View style={styles.actions}>
            {actions.map((a, i) => (
              <Button key={i} title={a.label} onPress={a.onPress} variant={i === 0 ? 'primary' : 'secondary'} />
            ))}
            <TouchableOpacity onPress={onClose} style={{ marginLeft: 8 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  container: { width: '100%', maxWidth: 520, borderRadius: 12, padding: 16 },
  body: { marginTop: 8 },
  actions: { marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end' },
});
