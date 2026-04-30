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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

const REGIONS = [
  "Centre",
  "Littoral",
  "Ouest",
  "Nord",
  "Adamaoua",
  "Est",
  "Sud-Ouest",
  "Nord-Ouest",
  "Sud",
  "Extrême-Nord",
];

function CreateModal({ visible, onClose, userId, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal_amount: "",
    max_members: "20",
    deadline: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [regionIdx, setRegionIdx] = useState(0);

  const handleSubmit = async () => {
    if (!form.name || !form.goal_amount || !form.deadline) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cooperatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          goal_amount: parseFloat(form.goal_amount),
          max_members: parseInt(form.max_members),
          created_by: userId,
          region: REGIONS[regionIdx],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreated(data.cooperative);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
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
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#F1F5F9" }}>
            🌿 Créer une coopérative
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: "#64748B", fontSize: 24 }}>×</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {[
            { key: "name", label: "Nom", placeholder: "Coop Solaire Yaoundé" },
            {
              key: "description",
              label: "Description",
              placeholder: "Objectif de la coop...",
            },
            {
              key: "goal_amount",
              label: "Objectif (FCFA)",
              placeholder: "2500000",
              keyboard: "numeric",
            },
            {
              key: "max_members",
              label: "Membres max",
              placeholder: "20",
              keyboard: "numeric",
            },
            {
              key: "deadline",
              label: "Date limite (YYYY-MM-DD)",
              placeholder: "2025-12-31",
            },
          ].map((f) => (
            <View key={f.key} style={{ marginBottom: 16 }}>
              <Text
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  fontWeight: "700",
                  marginBottom: 8,
                }}
              >
                {f.label.toUpperCase()}
              </Text>
              <TextInput
                placeholder={f.placeholder}
                placeholderTextColor="#475569"
                value={form[f.key]}
                onChangeText={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                keyboardType={f.keyboard || "default"}
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 14,
                  color: "#F1F5F9",
                  fontSize: 14,
                }}
              />
            </View>
          ))}
          <Text
            style={{
              color: "#94A3B8",
              fontSize: 12,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            RÉGION
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
          >
            {REGIONS.map((r, i) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRegionIdx(i)}
                style={{
                  marginRight: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor:
                    regionIdx === i ? COLORS.primary : "rgba(255,255,255,0.1)",
                  backgroundColor:
                    regionIdx === i ? `${COLORS.primary}15` : "transparent",
                }}
              >
                <Text
                  style={{
                    color: regionIdx === i ? COLORS.primary : "#94A3B8",
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
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
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                Créer la coopérative
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function CooperativesScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [coops, setCoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    try {
      const u = await AsyncStorage.getItem("ce_user");
      if (u) setUser(JSON.parse(u));
      const res = await fetch("/api/cooperatives");
      const d = await res.json();
      setCoops(d.cooperatives || []);
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

  const filtered = coops.filter((c) => filter === "all" || c.status === filter);

  return (
    <View
      style={{ flex: 1, backgroundColor: COLORS.dark, paddingTop: insets.top }}
    >
      <StatusBar style="light" />
      <CreateModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        userId={user?.id}
        onCreated={(c) => {
          setCoops((prev) => [c, ...prev]);
        }}
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
              🌿 Coopératives
            </Text>
            <Text style={{ fontSize: 12, color: "#64748B" }}>
              Rejoindre ou créer une coop
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCreate(true)}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
              + Créer
            </Text>
          </TouchableOpacity>
        </View>
        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 14 }}
        >
          {[
            ["all", "Toutes"],
            ["active", "Actives ✅"],
            ["completed", "Complétées 🏆"],
          ].map(([val, label]) => (
            <TouchableOpacity
              key={val}
              onPress={() => setFilter(val)}
              style={{
                marginRight: 10,
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                borderWidth: 1,
                borderColor:
                  filter === val ? COLORS.primary : "rgba(255,255,255,0.1)",
                backgroundColor:
                  filter === val ? `${COLORS.primary}15` : "transparent",
              }}
            >
              <Text
                style={{
                  color: filter === val ? COLORS.primary : "#94A3B8",
                  fontWeight: "600",
                  fontSize: 12,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
        {loading ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🌿</Text>
            <Text style={{ color: "#64748B", fontSize: 14 }}>
              Aucune coopérative trouvée
            </Text>
          </View>
        ) : (
          filtered.map((coop) => {
            const progress = Math.min(
              Math.round((coop.current_amount / coop.goal_amount) * 100),
              100,
            );
            const statusColor =
              {
                active: COLORS.primary,
                completed: COLORS.secondary,
                cancelled: "#EF4444",
              }[coop.status] || COLORS.primary;
            return (
              <View
                key={coop.id}
                style={{
                  backgroundColor: COLORS.darkCard,
                  borderRadius: 16,
                  padding: 18,
                  marginBottom: 14,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text
                      style={{
                        fontWeight: "800",
                        fontSize: 15,
                        color: "#F1F5F9",
                        marginBottom: 3,
                      }}
                    >
                      {coop.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#64748B" }}>
                      📍 {coop.region} • {coop.current_members}/
                      {coop.max_members} membres
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: `${statusColor}20`,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: statusColor,
                        fontSize: 11,
                        fontWeight: "700",
                      }}
                    >
                      {coop.status === "active" ? "✅ Active" : "🏆 Finie"}
                    </Text>
                  </View>
                </View>
                {/* Progress */}
                <View style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: COLORS.primary,
                        fontWeight: "700",
                      }}
                    >
                      {Number(coop.current_amount).toLocaleString("fr-FR")} FCFA
                    </Text>
                    <Text style={{ fontSize: 12, color: "#475569" }}>
                      {progress}% /{" "}
                      {Number(coop.goal_amount).toLocaleString("fr-FR")} FCFA
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: 50,
                      height: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          progress >= 100 ? COLORS.secondary : COLORS.primary,
                        height: "100%",
                        borderRadius: 50,
                        width: `${progress}%`,
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#475569" }}>
                    🗓️ {new Date(coop.deadline).toLocaleDateString("fr-FR")}
                  </Text>
                  <View
                    style={{
                      backgroundColor: `${COLORS.blockchain}15`,
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text
                      style={{
                        color: "#93C5FD",
                        fontSize: 10,
                        fontWeight: "600",
                      }}
                    >
                      ⛓️ On-chain
                    </Text>
                  </View>
                </View>
                {coop.status === "active" && (
                  <TouchableOpacity
                    style={{
                      marginTop: 12,
                      backgroundColor: `${COLORS.primary}15`,
                      borderRadius: 10,
                      padding: 12,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: `${COLORS.primary}30`,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      Rejoindre →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
