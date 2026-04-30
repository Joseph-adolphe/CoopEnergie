import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

function PayModal({ visible, onClose, user, cooperatives, onPaid }) {
  const [step, setStep] = useState(1);
  const [coopIdx, setCoopIdx] = useState(0);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("celo");
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState(null);

  const selectedCoop = cooperatives[coopIdx];

  const handlePay = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Erreur", "Montant invalide");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cotisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cooperative_id: selectedCoop?.id,
          user_id: user?.id,
          amount: parseFloat(amount),
          payment_method: method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setTxResult(data);
      setStep(3);
      onPaid && onPaid(data.cotisation);
    } catch (err) {
      Alert.alert("Erreur", err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setAmount("");
    setTxResult(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={reset}
    >
      <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
        <View style={{ flex: 1, backgroundColor: COLORS.dark }}>
          <View
            style={{
              backgroundColor: COLORS.darkCard,
              padding: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.08)",
            }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor:
                      step >= s ? COLORS.primary : "rgba(255,255,255,0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}
                  >
                    {s}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={reset}>
              <Text style={{ color: "#64748B", fontSize: 24 }}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 24 }}>
            {step === 1 && (
              <>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: "#F1F5F9",
                    marginBottom: 4,
                  }}
                >
                  💳 Payer une cotisation
                </Text>
                <Text
                  style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}
                >
                  Sécurisé sur la blockchain Celo
                </Text>
                <Text
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: "700",
                    marginBottom: 10,
                  }}
                >
                  COOPÉRATIVE
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 20 }}
                >
                  {cooperatives.map((c, i) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setCoopIdx(i)}
                      style={{
                        marginRight: 10,
                        padding: 12,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor:
                          coopIdx === i
                            ? COLORS.primary
                            : "rgba(255,255,255,0.08)",
                        backgroundColor:
                          coopIdx === i
                            ? `${COLORS.primary}10`
                            : "rgba(255,255,255,0.03)",
                        width: 160,
                      }}
                    >
                      <Text
                        style={{
                          color: coopIdx === i ? COLORS.primary : "#94A3B8",
                          fontWeight: "700",
                          fontSize: 13,
                        }}
                        numberOfLines={2}
                      >
                        {c.name}
                      </Text>
                      <Text
                        style={{ color: "#475569", fontSize: 11, marginTop: 4 }}
                      >
                        {Math.round((c.current_amount / c.goal_amount) * 100)}%
                        complété
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Text
                  style={{
                    color: "#94A3B8",
                    fontSize: 12,
                    fontWeight: "700",
                    marginBottom: 8,
                  }}
                >
                  MONTANT (FCFA)
                </Text>
                <TextInput
                  placeholder="Ex: 50000"
                  placeholderTextColor="#475569"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 14,
                    color: "#F1F5F9",
                    fontSize: 18,
                    fontWeight: "700",
                    marginBottom: 20,
                  }}
                />
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}
                >
                  {[
                    { val: "celo", label: "⛓️ Celo" },
                    { val: "mobile_money", label: "📱 Mobile Money" },
                  ].map((m) => (
                    <TouchableOpacity
                      key={m.val}
                      onPress={() => setMethod(m.val)}
                      style={{
                        flex: 1,
                        padding: 14,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor:
                          method === m.val
                            ? COLORS.primary
                            : "rgba(255,255,255,0.08)",
                        backgroundColor:
                          method === m.val
                            ? `${COLORS.primary}10`
                            : "transparent",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: method === m.val ? COLORS.primary : "#94A3B8",
                          fontWeight: "700",
                          fontSize: 14,
                        }}
                      >
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => setStep(2)}
                  disabled={!amount}
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 14,
                    padding: 16,
                    alignItems: "center",
                    opacity: !amount ? 0.5 : 1,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}
                  >
                    Continuer →
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: "#F1F5F9",
                    marginBottom: 24,
                  }}
                >
                  Confirmer le paiement
                </Text>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: 14,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  {[
                    ["Coopérative", selectedCoop?.name],
                    [
                      "Montant",
                      Number(amount).toLocaleString("fr-FR") + " FCFA",
                    ],
                    [
                      "Méthode",
                      method === "celo" ? "⛓️ Celo" : "📱 Mobile Money",
                    ],
                    ["Réseau", "Celo Mainnet"],
                  ].map(([label, val]) => (
                    <View
                      key={label}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <Text style={{ color: "#64748B", fontSize: 14 }}>
                        {label}
                      </Text>
                      <Text
                        style={{
                          color: "#F1F5F9",
                          fontWeight: "700",
                          fontSize: 14,
                          flex: 1,
                          textAlign: "right",
                        }}
                      >
                        {val}
                      </Text>
                    </View>
                  ))}
                </View>
                <View
                  style={{
                    backgroundColor: `${COLORS.blockchain}12`,
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: `${COLORS.blockchain}25`,
                  }}
                >
                  <Text style={{ color: "#93C5FD", fontSize: 12 }}>
                    ⛓️ Cette transaction sera permanente et non-annulable sur la
                    blockchain Celo.
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    style={{
                      flex: 1,
                      borderRadius: 14,
                      padding: 16,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <Text style={{ color: "#94A3B8", fontWeight: "700" }}>
                      Retour
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handlePay}
                    disabled={loading}
                    style={{
                      flex: 2,
                      backgroundColor: COLORS.primary,
                      borderRadius: 14,
                      padding: 16,
                      alignItems: "center",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "800",
                          fontSize: 15,
                        }}
                      >
                        ✅ Confirmer
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 3 && txResult && (
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: `${COLORS.primary}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>✅</Text>
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "900",
                    color: "#F1F5F9",
                    marginBottom: 8,
                  }}
                >
                  Confirmé !
                </Text>
                <Text
                  style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}
                >
                  Enregistré sur la blockchain Celo
                </Text>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: 12,
                    padding: 16,
                    width: "100%",
                    marginBottom: 24,
                  }}
                >
                  <Text
                    style={{ color: "#64748B", fontSize: 11, marginBottom: 4 }}
                  >
                    Hash de transaction
                  </Text>
                  <Text
                    style={{
                      color: "#93C5FD",
                      fontSize: 11,
                      fontFamily: "monospace",
                    }}
                    numberOfLines={2}
                  >
                    {txResult.tx_hash}
                  </Text>
                  <Text
                    style={{ color: "#475569", fontSize: 11, marginTop: 6 }}
                  >
                    Block #{txResult.block_number}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={reset}
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 14,
                    padding: 16,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}
                  >
                    Fermer
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingAnimatedView>
    </Modal>
  );
}

export default function CotisationsScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [cotisations, setCotisations] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPay, setShowPay] = useState(false);

  const load = async () => {
    try {
      const u = await AsyncStorage.getItem("ce_user");
      if (!u) return;
      const parsed = JSON.parse(u);
      setUser(parsed);
      const [cotRes, coopRes] = await Promise.all([
        fetch(`/api/cotisations?user_id=${parsed.id}`).then((r) => r.json()),
        fetch("/api/cooperatives").then((r) => r.json()),
      ]);
      setCotisations(cotRes.cotisations || []);
      setCooperatives(coopRes.cooperatives || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalPaid = cotisations
    .filter((c) => c.status === "confirmed")
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

  return (
    <View
      style={{ flex: 1, backgroundColor: COLORS.dark, paddingTop: insets.top }}
    >
      <StatusBar style="light" />
      <PayModal
        visible={showPay}
        onClose={() => setShowPay(false)}
        user={user}
        cooperatives={cooperatives}
        onPaid={(c) => setCotisations((prev) => [c, ...prev])}
      />

      {/* Header */}
      <View
        style={{
          backgroundColor: COLORS.darkCard,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.06)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: "900", color: "#F1F5F9" }}>
              💳 Cotisations
            </Text>
            <Text style={{ fontSize: 12, color: "#64748B" }}>
              Paiements blockchain Celo
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowPay(true)}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
              + Payer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 80,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.darkCard,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: `${COLORS.primary}25`,
            }}
          >
            <Text style={{ fontSize: 22 }}>💰</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: COLORS.primary,
                marginTop: 6,
              }}
            >
              {(totalPaid / 1000).toFixed(0)}k FCFA
            </Text>
            <Text style={{ fontSize: 11, color: "#64748B" }}>Total cotisé</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.darkCard,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            <Text style={{ fontSize: 22 }}>⛓️</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: COLORS.blockchain,
                marginTop: 6,
              }}
            >
              {cotisations.filter((c) => c.tx_hash).length}
            </Text>
            <Text style={{ fontSize: 11, color: "#64748B" }}>
              Sur blockchain
            </Text>
          </View>
        </View>

        {/* Transactions */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: "#F1F5F9",
            marginBottom: 14,
          }}
        >
          ⛓️ Historique Celo
        </Text>

        {loading ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : cotisations.length === 0 ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>💳</Text>
            <Text style={{ color: "#64748B", fontSize: 14, marginBottom: 16 }}>
              Aucune cotisation
            </Text>
            <TouchableOpacity
              onPress={() => setShowPay(true)}
              style={{
                backgroundColor: `${COLORS.primary}15`,
                borderRadius: 10,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: `${COLORS.primary}30`,
              }}
            >
              <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
                Payer ma première cotisation
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          cotisations.map((tx) => (
            <View
              key={tx.id}
              style={{
                backgroundColor: COLORS.darkCard,
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 14,
                      color: "#E2E8F0",
                    }}
                  >
                    {tx.cooperative_name}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}
                  >
                    {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "900",
                    color: COLORS.primary,
                  }}
                >
                  {Number(tx.amount).toLocaleString("fr-FR")} FCFA
                </Text>
              </View>
              {tx.tx_hash && (
                <View
                  style={{
                    marginTop: 10,
                    backgroundColor: `${COLORS.blockchain}10`,
                    borderRadius: 8,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: `${COLORS.blockchain}20`,
                  }}
                >
                  <Text
                    style={{
                      color: "#93C5FD",
                      fontSize: 10,
                      fontFamily: "monospace",
                    }}
                    numberOfLines={1}
                  >
                    ⛓️ {tx.tx_hash.substring(0, 40)}...
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      tx.payment_method === "celo"
                        ? `${COLORS.blockchain}15`
                        : `${COLORS.secondary}15`,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      color:
                        tx.payment_method === "celo"
                          ? "#93C5FD"
                          : COLORS.secondary,
                      fontSize: 11,
                      fontWeight: "600",
                    }}
                  >
                    {tx.payment_method === "celo" ? "⛓️ Celo" : "📱 Mobile"}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: `${COLORS.primary}15`,
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
                    ✅ Confirmée
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
