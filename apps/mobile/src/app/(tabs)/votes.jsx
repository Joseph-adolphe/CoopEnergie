import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
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

function VoteCard({ session, user, onVoted }) {
  const [voting, setVoting] = useState(false);
  const [myVote, setMyVote] = useState(null);

  const total = parseInt(session.total_votes || 0);
  const pour = parseInt(session.votes_pour || 0);
  const contre = parseInt(session.votes_contre || 0);
  const pctPour = total > 0 ? Math.round((pour / total) * 100) : 0;
  const pctContre = total > 0 ? Math.round((contre / total) * 100) : 0;
  const isActive =
    session.status === "active" && new Date(session.end_date) > new Date();

  const handleVote = async (vote) => {
    if (voting || myVote) return;
    Alert.alert(
      "Confirmer le vote",
      `Voter "${vote.toUpperCase()}" ? Ce vote sera enregistré sur la blockchain Celo de façon permanente.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer ⛓️",
          onPress: async () => {
            setVoting(true);
            try {
              const res = await fetch("/api/votes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  vote_session_id: session.id,
                  cooperative_id: session.cooperative_id,
                  user_id: user?.id,
                  vote_value: vote,
                }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Erreur");
              setMyVote(vote);
              onVoted && onVoted(session.id, vote, data.tx_hash);
              Alert.alert(
                "✅ Vote enregistré",
                `Votre vote "${vote}" a été enregistré sur Celo.\n\nTx: ${data.tx_hash?.substring(0, 20)}...`,
              );
            } catch (err) {
              Alert.alert("Erreur", err.message);
            } finally {
              setVoting(false);
            }
          },
        },
      ],
    );
  };

  const statusConfig = {
    active: { label: "🟢 En cours", color: COLORS.primary },
    closed: { label: "⚫ Clôturé", color: "#64748B" },
    validated: { label: "✅ Approuvé", color: COLORS.primary },
    rejected: { label: "❌ Rejeté", color: "#EF4444" },
  };
  const sc = statusConfig[session.status] || statusConfig.active;

  return (
    <View
      style={{
        backgroundColor: COLORS.darkCard,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
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
            {session.title}
          </Text>
          {session.supplier_name && (
            <Text style={{ fontSize: 12, color: "#64748B" }}>
              🏭 {session.supplier_name}
            </Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: `${sc.color}15`,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: sc.color, fontSize: 11, fontWeight: "700" }}>
            {sc.label}
          </Text>
        </View>
      </View>

      {/* Results */}
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#94A3B8", fontSize: 12, fontWeight: "600" }}>
            {total} votes
          </Text>
          <Text style={{ color: "#64748B", fontSize: 12 }}>
            Quorum : {session.quorum_percentage}%
          </Text>
        </View>
        {[
          {
            label: "✅ Pour",
            value: pour,
            pct: pctPour,
            color: COLORS.primary,
          },
          {
            label: "❌ Contre",
            value: contre,
            pct: pctContre,
            color: "#EF4444",
          },
          {
            label: "⚪ Abstention",
            value: parseInt(session.votes_abstention || 0),
            pct:
              total > 0
                ? Math.round(
                    (parseInt(session.votes_abstention || 0) / total) * 100,
                  )
                : 0,
            color: "#64748B",
          },
        ].map((r) => (
          <View key={r.label} style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text style={{ fontSize: 12, color: r.color, fontWeight: "700" }}>
                {r.label}
              </Text>
              <Text
                style={{ fontSize: 12, color: "#F1F5F9", fontWeight: "700" }}
              >
                {r.value} ({r.pct}%)
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 50,
                height: 7,
              }}
            >
              <View
                style={{
                  backgroundColor: r.color,
                  height: "100%",
                  borderRadius: 50,
                  width: `${r.pct}%`,
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Celo info */}
      {session.tx_hash && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: `${COLORS.blockchain}10`,
            borderRadius: 10,
            padding: 10,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: `${COLORS.blockchain}20`,
          }}
        >
          <Text style={{ fontSize: 14 }}>⛓️</Text>
          <Text
            style={{
              color: "#93C5FD",
              fontSize: 11,
              fontFamily: "monospace",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {session.tx_hash.substring(0, 30)}...
          </Text>
        </View>
      )}

      {/* Vote buttons */}
      {isActive && !myVote ? (
        <View>
          <Text
            style={{
              color: "#64748B",
              fontSize: 12,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Votre vote sera enregistré sur Celo
          </Text>
          {voting ? (
            <View style={{ alignItems: "center", padding: 16 }}>
              <ActivityIndicator color={COLORS.primary} />
              <Text
                style={{ color: COLORS.primary, fontSize: 13, marginTop: 8 }}
              >
                ⛓️ Enregistrement blockchain...
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => handleVote("pour")}
                style={{
                  flex: 1,
                  backgroundColor: `${COLORS.primary}15`,
                  borderRadius: 12,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "800",
                    fontSize: 14,
                  }}
                >
                  ✅ POUR
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleVote("contre")}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(239,68,68,0.1)",
                  borderRadius: 12,
                  padding: 14,
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "#EF4444",
                }}
              >
                <Text
                  style={{ color: "#FCA5A5", fontWeight: "800", fontSize: 14 }}
                >
                  ❌ CONTRE
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : myVote || !isActive ? (
        <View
          style={{
            backgroundColor: myVote
              ? `${COLORS.primary}10`
              : "rgba(255,255,255,0.04)",
            borderRadius: 10,
            padding: 12,
            borderWidth: 1,
            borderColor: `${myVote ? COLORS.primary : "rgba(255,255,255,0.08)"}40`,
          }}
        >
          <Text
            style={{
              color: myVote ? COLORS.primary : "#64748B",
              fontSize: 13,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {myVote
              ? `✅ Voté "${myVote}" — enregistré sur Celo`
              : "⏱️ Session terminée"}
          </Text>
        </View>
      ) : null}

      <Text
        style={{
          fontSize: 11,
          color: "#475569",
          marginTop: 10,
          textAlign: "center",
        }}
      >
        🗓️ Expire : {new Date(session.end_date).toLocaleString("fr-FR")}
      </Text>
    </View>
  );
}

export default function VotesScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("active");

  const load = async () => {
    try {
      const u = await AsyncStorage.getItem("ce_user");
      if (u) setUser(JSON.parse(u));
      const res = await fetch("/api/votes");
      const d = await res.json();
      setSessions(d.sessions || []);
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

  const activeVotes = sessions.filter((s) => s.status === "active");
  const closedVotes = sessions.filter((s) => s.status !== "active");
  const displayed = tab === "active" ? activeVotes : closedVotes;

  return (
    <View
      style={{ flex: 1, backgroundColor: COLORS.dark, paddingTop: insets.top }}
    >
      <StatusBar style="light" />
      <View
        style={{
          backgroundColor: COLORS.darkCard,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "900",
            color: "#F1F5F9",
            marginBottom: 4,
          }}
        >
          🗳️ Votes Celo
        </Text>
        <Text style={{ fontSize: 12, color: "#64748B", marginBottom: 14 }}>
          Votes décentralisés sur blockchain
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            ["active", `Actifs (${activeVotes.length})`],
            ["closed", `Historique (${closedVotes.length})`],
          ].map(([val, label]) => (
            <TouchableOpacity
              key={val}
              onPress={() => setTab(val)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor:
                  tab === val ? COLORS.primary : "rgba(255,255,255,0.1)",
                backgroundColor:
                  tab === val ? `${COLORS.primary}15` : "transparent",
              }}
            >
              <Text
                style={{
                  color: tab === val ? COLORS.primary : "#94A3B8",
                  fontWeight: "600",
                  fontSize: 12,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
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
        {/* Celo banner */}
        <View
          style={{
            backgroundColor: `${COLORS.blockchain}12`,
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: `${COLORS.blockchain}25`,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: 24 }}>⛓️</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#93C5FD", fontWeight: "700", fontSize: 13 }}>
              Votes immuables sur Celo
            </Text>
            <Text style={{ color: "#475569", fontSize: 11 }}>
              Chaque vote est transparent et vérifiable
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : displayed.length === 0 ? (
          <View style={{ alignItems: "center", padding: 40 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🗳️</Text>
            <Text style={{ color: "#64748B", fontSize: 14 }}>
              Aucun vote {tab === "active" ? "actif" : "dans l'historique"}
            </Text>
          </View>
        ) : (
          displayed.map((session) => (
            <VoteCard
              key={session.id}
              session={session}
              user={user}
              onVoted={(id, v) =>
                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === id
                      ? {
                          ...s,
                          total_votes: parseInt(s.total_votes || 0) + 1,
                          [`votes_${v}`]: parseInt(s[`votes_${v}`] || 0) + 1,
                        }
                      : s,
                  ),
                )
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
