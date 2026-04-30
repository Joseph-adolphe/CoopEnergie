import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "react-native-async-storage";
import { useRouter } from "expo-router";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

function StatCard({ icon, label, value, color }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.darkCard,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.07)",
        minWidth: 140,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 8 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "800",
          color: color || COLORS.primary,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const u = await AsyncStorage.getItem("ce_user");
      if (!u) {
        router.replace("/auth/login");
        return;
      }
      const parsed = JSON.parse(u);
      setUser(parsed);
      const res = await fetch(
        `/api/dashboard/stats?role=user&user_id=${parsed.id}`,
      );
      const d = await res.json();
      setData(d);
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

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: COLORS.dark, paddingTop: insets.top }}
    >
      <StatusBar style="light" />
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
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
                ⛓️ Celo Mainnet
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: `${COLORS.blockchain}20`,
              borderRadius: 8,
              padding: 8,
              borderWidth: 1,
              borderColor: `${COLORS.blockchain}30`,
            }}
          >
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 80,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View
          style={{
            backgroundColor: `${COLORS.primary}08`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: `${COLORS.primary}20`,
          }}
        >
          <Text style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>
            Bonjour 👋
          </Text>
          <Text style={{ fontSize: 22, fontWeight: "900", color: "#F1F5F9" }}>
            {user?.name?.split(" ")[0] || "Utilisateur"} !
          </Text>
          {user?.wallet_address && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
                backgroundColor: `${COLORS.blockchain}15`,
                borderRadius: 8,
                padding: 8,
                borderWidth: 1,
                borderColor: `${COLORS.blockchain}25`,
              }}
            >
              <Text style={{ fontSize: 12 }}>⛓️</Text>
              <Text
                style={{
                  color: "#93C5FD",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              >
                {user.wallet_address.substring(0, 22)}...
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <StatCard
            icon="🌿"
            label="Mes coops"
            value={data?.myCoops?.length || 0}
            color={COLORS.primary}
          />
          <StatCard
            icon="💰"
            label="Total cotisé"
            value={`${(Number(data?.totalContrib?.total || 0) / 1000).toFixed(0)}k FCFA`}
            color={COLORS.secondary}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <StatCard
            icon="🗳️"
            label="Votes actifs"
            value={
              data?.myVotes?.filter((v) => v.status === "active").length || 0
            }
            color={COLORS.tertiary}
          />
          <StatCard
            icon="⛓️"
            label="Transactions"
            value={data?.recentTx?.length || 0}
            color={COLORS.blockchain}
          />
        </View>

        {/* My coops */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#F1F5F9" }}>
              🌿 Mes coopératives
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/cooperatives")}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Voir tout →
              </Text>
            </TouchableOpacity>
          </View>
          {!data?.myCoops || data.myCoops.length === 0 ? (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/cooperatives")}
              style={{
                backgroundColor: COLORS.darkCard,
                borderRadius: 14,
                padding: 20,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
                borderStyle: "dashed",
              }}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>🌿</Text>
              <Text style={{ color: "#64748B", fontSize: 13 }}>
                Rejoindre une coopérative
              </Text>
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: "700",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                Parcourir →
              </Text>
            </TouchableOpacity>
          ) : (
            data.myCoops.map((coop) => {
              const progress = Math.min(
                Math.round((coop.current_amount / coop.goal_amount) * 100),
                100,
              );
              return (
                <View
                  key={coop.id}
                  style={{
                    backgroundColor: COLORS.darkCard,
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 14,
                      color: "#E2E8F0",
                      marginBottom: 4,
                    }}
                  >
                    {coop.name}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#64748B", marginBottom: 10 }}
                  >
                    Ma contribution:{" "}
                    {Number(coop.total_contributed || 0).toLocaleString(
                      "fr-FR",
                    )}{" "}
                    FCFA
                  </Text>
                  <View
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: 50,
                      height: 8,
                      marginBottom: 6,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.primary,
                        height: "100%",
                        borderRadius: 50,
                        width: `${progress}%`,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
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
                      {progress}% de l'objectif
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Active votes */}
        {data?.myVotes?.filter((v) => v.status === "active").length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#F1F5F9",
                marginBottom: 14,
              }}
            >
              🗳️ Votes en attente
            </Text>
            {data.myVotes
              .filter((v) => v.status === "active")
              .slice(0, 2)
              .map((vote) => (
                <TouchableOpacity
                  key={vote.id}
                  onPress={() => router.push("/(tabs)/votes")}
                  style={{
                    backgroundColor: `${COLORS.tertiary}10`,
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: `${COLORS.tertiary}30`,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 14,
                      color: "#F1F5F9",
                      marginBottom: 4,
                    }}
                  >
                    {vote.title}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#64748B" }}>
                      Vote requis
                    </Text>
                    <View
                      style={{
                        backgroundColor: `${COLORS.tertiary}20`,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.tertiary,
                          fontSize: 12,
                          fontWeight: "700",
                        }}
                      >
                        Voter →
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        )}

        {/* Quick actions */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "800",
            color: "#F1F5F9",
            marginBottom: 14,
          }}
        >
          ⚡ Actions rapides
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cotisations")}
            style={{
              flex: 1,
              backgroundColor: `${COLORS.primary}15`,
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: `${COLORS.primary}30`,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 6 }}>💳</Text>
            <Text
              style={{ color: COLORS.primary, fontWeight: "700", fontSize: 12 }}
            >
              Cotiser
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/votes")}
            style={{
              flex: 1,
              backgroundColor: `${COLORS.tertiary}15`,
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: `${COLORS.tertiary}30`,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 6 }}>🗳️</Text>
            <Text
              style={{
                color: COLORS.tertiary,
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              Voter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cooperatives")}
            style={{
              flex: 1,
              backgroundColor: `${COLORS.blockchain}15`,
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: `${COLORS.blockchain}30`,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 6 }}>🌿</Text>
            <Text style={{ color: "#93C5FD", fontWeight: "700", fontSize: 12 }}>
              Coops
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
