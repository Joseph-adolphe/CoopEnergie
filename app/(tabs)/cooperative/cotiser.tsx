import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingModal } from '@/components/ui/loading-modal';
import { StatusModal } from '@/components/ui/status-modal';
import { useThemeColor } from '@/hooks/use-theme-color';

// ===== IMPORT SUPABASE =====
import { createContribution, getAllCooperatives } from '@/services/supabaseService';
import { supabase } from '@/config/supabase';

export default function CotiserScreen() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'orange' | 'mtn' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const [status, setStatus] = useState<{ visible: boolean; status: 'success' | 'error'; title?: string; message?: string } | null>(null);

  const cyan = useThemeColor({}, 'cyanCard') as string;
  const darkGreen = useThemeColor({}, 'darkGreen') as string;
  const accent = useThemeColor({}, 'accentGreen') as string;
  const text = useThemeColor({}, 'text') as string;

  const quickSet = (val: number) => {
    setAmount(String(val));
  };

  // ===== PROCESSUS DE PAIEMENT =====
  const contribute = async () => {
    try {
      // Validation
      if (!amount || parseFloat(amount) <= 0) {
        setStatus({
          visible: true,
          status: 'error',
          title: 'Montant invalide',
          message: 'Veuillez entrer un montant > 0',
        });
        return;
      }

      if (!method) {
        setStatus({
          visible: true,
          status: 'error',
          title: 'Méthode de paiement',
          message: 'Veuillez choisir une méthode de paiement',
        });
        return;
      }

      if (!phone) {
        setStatus({
          visible: true,
          status: 'error',
          title: 'Numéro de téléphone',
          message: 'Veuillez entrer votre numéro de téléphone',
        });
        return;
      }

      setLoading(true);

      // ===== ÉTAPE 1 : Initier le paiement Mobile Money =====
      console.log(`📱 Initiation paiement ${method.toUpperCase()} : ${amount} FCFA`);

      const transactionId = `TXN_${Date.now()}`;
      
      // Appel à l'API de paiement (simulation)
      const paymentResult = await initiatePayment({
        amount: parseFloat(amount),
        phone,
        method,
        transactionId,
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }

      console.log('✅ Paiement initié :', paymentResult.transactionId);

      // ===== ÉTAPE 2 : Enregistrer dans Supabase =====
      const cooperatives = await getAllCooperatives();
      if (!cooperatives || cooperatives.length === 0) {
        throw new Error('Aucune coopérative trouvée');
      }

      const userId = 'b3c965b9-7df6-45c2-92c3-809c6c8c3741'; // ID test

      const contribution = await createContribution(
        userId,
        cooperatives[0].id,
        parseFloat(amount),
        paymentResult.transactionId,
        'pending'
      );

      console.log('✅ Contribution enregistrée :', contribution);

      // ===== ÉTAPE 3 : Créer transaction Blockchain =====
      const blockchainHash = await createBlockchainTransaction({
        type: 'contribution',
        referenceId: contribution[0]?.id,
        amount: parseFloat(amount),
        method,
        transactionId: paymentResult.transactionId,
      });

      console.log('✅ Transaction Blockchain :', blockchainHash);

      // ===== ÉTAPE 4 : Mettre à jour le statut =====
      const { error: updateError } = await supabase
        .from('contributions')
        .update({ status: 'completed' })
        .eq('id', contribution[0]?.id);

      if (updateError) {
        throw updateError;
      }

      setLoading(false);
      setStatus({
        visible: true,
        status: 'success',
        title: 'Paiement réussi !',
        message: `Votre contribution de ${amount} FCFA a été enregistrée et certifiée sur la blockchain.`,
      });

      // Réinitialiser le formulaire
      setTimeout(() => {
        setAmount('');
        setPhone('');
        setMethod(null);
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      console.error('❌ Erreur :', err.message);
      setStatus({
        visible: true,
        status: 'error',
        title: 'Erreur de paiement',
        message: err.message || 'Une erreur est survenue',
      });
    }
  };

  // ===== INITIER LE PAIEMENT =====
  const initiatePayment = async ({
    amount,
    phone,
    method,
    transactionId,
  }: {
    amount: number;
    phone: string;
    method: 'orange' | 'mtn';
    transactionId: string;
  }) => {
    try {
      // SIMULATION : En production, appeler l'API réelle
      // Orange Money API : https://developer.orange-cameroon.cm/
      // MTN Mobile Money API : https://www.mtnbusiness.com/en/uganda

      if (method === 'orange') {
        // Appel Orange Money API
        // POST https://api.orange.cm/payment/v1/pay
        console.log('🟠 Appel Orange Money API');
        // SIMULATION
        return {
          success: true,
          transactionId: transactionId,
          status: 'pending',
        };
      } else if (method === 'mtn') {
        // Appel MTN Mobile Money API
        // POST https://api.mtnbusiness.com/api/payment/
        console.log('🟡 Appel MTN Mobile Money API');
        // SIMULATION
        return {
          success: true,
          transactionId: transactionId,
          status: 'pending',
        };
      }

      throw new Error('Méthode de paiement invalide');
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  };

  // ===== CRÉER TRANSACTION BLOCKCHAIN =====
  const createBlockchainTransaction = async ({
    type,
    referenceId,
    amount,
    method,
    transactionId,
  }: any) => {
    try {
      // Enregistrer dans Supabase
      const { data, error } = await supabase
        .from('transactions_blockchain')
        .insert([
          {
            type,
            reference_id: referenceId,
            hash: `HASH_${Date.now()}`, // En production : hash Celo
            date: new Date().toISOString(),
            details: JSON.stringify({
              amount,
              method,
              transactionId,
              timestamp: new Date().getTime(),
            }),
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log('✅ Blockchain transaction créée :', data);
      return data[0]?.hash;
    } catch (err: any) {
      console.error('❌ Erreur blockchain :', err.message);
      throw err;
    }
  };

  // ===== MÉTHODES DE PAIEMENT =====
  const paymentMethods = [
    { id: 'orange', name: '🟠 Orange Money', color: '#FF6600' },
    { id: 'mtn', name: '🟡 MTN Mobile Money', color: '#FFC800' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Cotiser</ThemedText>

      <ThemedText style={styles.label}>Montant (FCFA)</ThemedText>
      <Input
        placeholder="0"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        editable={!loading}
      />

      {/* Montants rapides */}
      <ScrollView
        style={{ height: 0, padding: 12, maxHeight: 74 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {[2000, 5000, 10000, 20000].map((val) => (
          <TouchableOpacity
            key={val}
            style={styles.quickBox}
            onPress={() => quickSet(val)}
            disabled={loading}
          >
            <ThemedText type="defaultSemiBold" style={[styles.quickText, { color: text }]}>
              {val.toLocaleString('fr-FR')} FCFA
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Numéro de téléphone */}
      <ThemedText style={[styles.label, { marginTop: 12 }]}>Numéro de téléphone</ThemedText>
      <Input
        placeholder="+237 6XX XXX XXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        editable={!loading}
      />

      {/* Méthode de paiement */}
      <ThemedText style={[styles.label, { marginTop: 12 }]}>Méthode de paiement</ThemedText>
      <TouchableOpacity
        style={[styles.methodRow, { borderColor: method ? darkGreen : '#e7e7e7' }]}
        onPress={() => setShowMethodPicker(true)}
        disabled={loading}
      >
        <ThemedText>
          {method
            ? paymentMethods.find((m) => m.id === method)?.name
            : 'Choisir une méthode'}
        </ThemedText>
        <ThemedText>{'\u25BC'}</ThemedText>
      </TouchableOpacity>

      {/* Bouton contribuer */}
      <View style={{ marginTop: 20 }}>
        <Button
          title={loading ? 'Traitement...' : 'Contribuer'}
          variant="primary"
          onPress={contribute}
          disabled={loading}
        />
      </View>

      {/* Note de sécurité */}
      <View style={[styles.note, { backgroundColor: cyan }]}>
        <ThemedText style={{ fontSize: 12 }}>
          ✅ Transaction sécurisée et enregistrée sur la blockchain
        </ThemedText>
      </View>

      {/* Modal pour choisir la méthode */}
      <Modal
        visible={showMethodPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMethodPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="defaultSemiBold" style={{ marginBottom: 16 }}>
              Choisir une méthode de paiement
            </ThemedText>

            {paymentMethods.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.methodOption,
                  method === m.id && { backgroundColor: cyan, borderColor: darkGreen, borderWidth: 2 },
                ]}
                onPress={() => {
                  setMethod(m.id as 'orange' | 'mtn');
                  setShowMethodPicker(false);
                }}
              >
                <ThemedText style={{ fontSize: 16 }}>{m.name}</ThemedText>
              </TouchableOpacity>
            ))}

            <Button
              title="Fermer"
              variant="secondary"
              onPress={() => setShowMethodPicker(false)}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>

      <LoadingModal visible={loading} message="Traitement du paiement..." />

      {status ? (
        <StatusModal
          visible={status.visible}
          status={status.status}
          title={status.title}
          message={status.message}
          onClose={() => setStatus((s) => (s ? { ...s, visible: false } : s))}
        />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 64, paddingHorizontal: 24 },
  label: { marginTop: 12, marginBottom: 8, fontWeight: '600' },
  quickBox: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginHorizontal: 4,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e7e7e7',
  },
  quickText: {},
  methodRow: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e7e7e7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodOption: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e7e7e7',
    marginBottom: 12,
  },
  note: { marginTop: 20, padding: 14, borderRadius: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
});
