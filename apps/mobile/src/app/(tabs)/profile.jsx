import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("ce_user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  const roleConfig = {
    user: { label: "Membre", icon: "👤", color: COLORS.primary },
    fournisseur: { label: "Fournisseur", icon: "🏭", color: COLORS.secondary },
    superadmin: { label: "Super Admin", icon: "👑", color: COLORS.tertiary },
  };
  const rc = roleConfig[user?.role] || roleConfig.user;

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("ce_token");
          await AsyncStorage.removeItem("ce_user");
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: "🌿",
      label: "Mes coopératives",
      onPress: () => router.push("/(tabs)/cooperatives"),
    },
    {
      icon: "💳",
      label: "Mes cotisations",
      onPress: () => router.push("/(tabs)/cotisations"),
    },
    {
      icon: "🗳️",
      label: "Mes votes",
      onPress: () => router.push("/(tabs)/votes"),
    },
    { icon: "📋", label: "Rapports financiers", onPress: () => {} },
    { icon: "🔔", label: "Notifications", onPress: () => {} },
    { icon: "🔒", label: "Sécurité & Confidentialité", onPress: () => {} },
    { icon: "❓", label: "Aide & Support", onPress: () => {} },
  ];

  return (
    <View
      style={{ flex: 1, backgroundColor: COLORS.dark, paddingTop: insets.top }}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View
          style={{
            backgroundColor: COLORS.darkCard,
            padding: 24,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.06)",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#F1F5F9",
              marginBottom: 20,
            }}
          >
            👤 Mon Profil
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: `${rc.color}20`,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: `${rc.color}50`,
              }}
            >
              <Text style={{ fontSize: 32 }}>{rc.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "800", color: "#F1F5F9" }}
              >
                {user?.name || "Chargement..."}
              </Text>
              <Text style={{ fontSize: 13, color: "#64748B" }}>
                {user?.email}
              </Text>
              <View
                style={{
                  backgroundColor: `${rc.color}20`,
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  alignSelf: "flex-start",
                  marginTop: 6,
                }}
              >
                <Text
                  style={{ color: rc.color, fontSize: 12, fontWeight: "700" }}
                >
                  {rc.label}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Wallet Celo */}
        {user?.wallet_address && (
          <View
            style={{
              margin: 16,
              backgroundColor: `${COLORS.blockchain}12`,
              borderRadius: 14,
              padding: 18,
              borderWidth: 1,
              borderColor: `${COLORS.blockchain}25`,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 22 }}>⛓️</Text>
              <View>
                <Text
                  style={{ color: "#93C5FD", fontWeight: "800", fontSize: 15 }}
                >
                  Wallet Celo
                </Text>
                <Text style={{ color: "#475569", fontSize: 11 }}>
                  Blockchain Mainnet
                </Text>
              </View>
              <View
                style={{
                  marginLeft: "auto",
                  backgroundColor: `${COLORS.primary}20`,
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
                  ✅ Actif
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <Text style={{ color: "#64748B", fontSize: 11, marginBottom: 4 }}>
                Adresse du wallet
              </Text>
              <Text
                style={{
                  color: "#93C5FD",
                  fontSize: 12,
                  fontFamily: "monospace",
                }}
              >
                {user.wallet_address}
              </Text>
            </View>
          </View>
        )}

        {/* Stats */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginHorizontal: 16,
            marginBottom: 20,
          }}
        >
          {[
            { icon: "🌿", label: "Coops", value: "—" },
            { icon: "💰", label: "Cotisé", value: "—" },
            { icon: "🗳️", label: "Votes", value: "—" },
          ].map((s) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                backgroundColor: COLORS.darkCard,
                borderRadius: 12,
                padding: 14,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: COLORS.primary,
                }}
              >
                {s.value}
              </Text>
              <Text style={{ fontSize: 11, color: "#64748B" }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu items */}
        <View
          style={{
            marginHorizontal: 16,
            backgroundColor: COLORS.darkCard,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.07)",
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                padding: 16,
                borderBottomWidth: i < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "rgba(255,255,255,0.05)",
              }}
            >
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text
                style={{
                  flex: 1,
                  color: "#E2E8F0",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {item.label}
              </Text>
              <Text style={{ color: "#475569", fontSize: 16 }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* App info */}
        <View
          style={{
            marginHorizontal: 16,
            backgroundColor: COLORS.darkCard,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.07)",
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "#1E2A3A",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>⚡</Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: COLORS.primary,
                }}
              >
                CoopEnergie
              </Text>
              <Text style={{ fontSize: 11, color: "#475569" }}>
                Version 1.0.0 — Celo Mainnet
              </Text>
            </View>
          </View>
          <Text style={{ color: "#475569", fontSize: 12 }}>
            Plateforme de coopératives d'achat groupé d'équipements solaires au
            Cameroun, propulsée par la blockchain Celo.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginHorizontal: 16,
            backgroundColor: "rgba(239,68,68,0.08)",
            borderRadius: 14,
            padding: 16,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(239,68,68,0.2)",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#FCA5A5", fontWeight: "700", fontSize: 15 }}>
            🚪 Déconnexion
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
