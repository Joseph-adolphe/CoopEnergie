import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  tertiary: "#FF8C00",
  blockchain: "#1E40AF",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

const DEMO_ACCOUNTS = [
  { role: "Superadmin", email: "admin@coopenergy.cm" },
  { role: "Utilisateur", email: "jean@example.cm" },
  { role: "Fournisseur", email: "contact@solarcam.cm" },
];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email et mot de passe requis");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Identifiants invalides");
      await AsyncStorage.setItem("ce_token", data.token);
      await AsyncStorage.setItem("ce_user", JSON.stringify(data.user));
      router.replace("/(tabs)");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.dark,
          paddingTop: insets.top,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 36 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                backgroundColor: "#1E293B",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                borderWidth: 1,
                borderColor: `${COLORS.primary}40`,
              }}
            >
              <Text style={{ fontSize: 34 }}>⚡</Text>
            </View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "900",
                color: COLORS.primary,
                letterSpacing: -0.5,
              }}
            >
              CoopEnergie
            </Text>
            <Text style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
              Plateforme solaire sur Celo
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              backgroundColor: COLORS.darkCard,
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "800",
                color: "#F1F5F9",
                marginBottom: 4,
              }}
            >
              Bienvenue !
            </Text>
            <Text style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>
              Connectez-vous à votre compte
            </Text>

            {error && (
              <View
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "rgba(239,68,68,0.3)",
                }}
              >
                <Text style={{ color: "#FCA5A5", fontSize: 13 }}>
                  ⚠️ {error}
                </Text>
              </View>
            )}

            <Text
              style={{
                color: "#94A3B8",
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              EMAIL
            </Text>
            <TextInput
              placeholder="votre@email.cm"
              placeholderTextColor="#475569"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 14,
                color: "#F1F5F9",
                fontSize: 15,
                marginBottom: 16,
              }}
            />

            <Text
              style={{
                color: "#94A3B8",
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              MOT DE PASSE
            </Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#475569"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 14,
                color: "#F1F5F9",
                fontSize: 15,
                marginBottom: 24,
              }}
            />

            <TouchableOpacity
              onPress={handleLogin}
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
                <Text
                  style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}
                >
                  Se connecter →
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/auth/register")}
              style={{ marginTop: 16, alignItems: "center" }}
            >
              <Text style={{ color: "#64748B", fontSize: 13 }}>
                Pas de compte ?{" "}
                <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
                  S'inscrire
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo accounts */}
          <View
            style={{
              marginTop: 20,
              backgroundColor: `${COLORS.primary}08`,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: `${COLORS.primary}20`,
            }}
          >
            <Text
              style={{
                color: "#64748B",
                fontSize: 11,
                fontWeight: "700",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Comptes de démo
            </Text>
            {DEMO_ACCOUNTS.map((acc) => (
              <TouchableOpacity
                key={acc.role}
                onPress={() => {
                  setEmail(acc.email);
                  setPassword("demo123");
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(255,255,255,0.05)",
                }}
              >
                <Text style={{ color: "#94A3B8", fontSize: 13 }}>
                  {acc.role}
                </Text>
                <View
                  style={{
                    backgroundColor: `${COLORS.primary}20`,
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
                    Utiliser
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Celo badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 14 }}>⛓️</Text>
            <Text style={{ color: "#1E40AF", fontSize: 12, fontWeight: "600" }}>
              Sécurisé par la Blockchain Celo
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
