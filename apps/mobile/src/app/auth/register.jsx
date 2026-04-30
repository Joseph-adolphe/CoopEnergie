import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Tous les champs sont requis");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'inscription");
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
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ color: COLORS.primary, fontSize: 15 }}>
              ← Retour
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 26,
              fontWeight: "900",
              color: "#F1F5F9",
              marginBottom: 4,
            }}
          >
            Créer un compte
          </Text>
          <Text style={{ fontSize: 13, color: "#64748B", marginBottom: 28 }}>
            Rejoignez la révolution solaire ☀️
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
              <Text style={{ color: "#FCA5A5", fontSize: 13 }}>⚠️ {error}</Text>
            </View>
          )}

          {/* Role selection */}
          <Text
            style={{
              color: "#94A3B8",
              fontSize: 12,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            JE SUIS UN(E)
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            {[
              { val: "user", label: "🏠 Membre", desc: "Rejoindre des coops" },
              {
                val: "fournisseur",
                label: "🏭 Fournisseur",
                desc: "Proposer des offres",
              },
            ].map((r) => (
              <TouchableOpacity
                key={r.val}
                onPress={() => setForm((f) => ({ ...f, role: r.val }))}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    form.role === r.val
                      ? COLORS.primary
                      : "rgba(255,255,255,0.08)",
                  backgroundColor:
                    form.role === r.val
                      ? `${COLORS.primary}10`
                      : "rgba(255,255,255,0.03)",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, marginBottom: 4 }}>
                  {r.label.split(" ")[0]}
                </Text>
                <Text
                  style={{
                    color: form.role === r.val ? COLORS.primary : "#94A3B8",
                    fontWeight: "700",
                    fontSize: 13,
                  }}
                >
                  {r.label.split(" ").slice(1).join(" ")}
                </Text>
                <Text style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>
                  {r.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {[
            {
              key: "name",
              label: "NOM COMPLET",
              placeholder:
                form.role === "fournisseur"
                  ? "Nom de l'entreprise"
                  : "Jean Mbarga",
              keyboard: "default",
            },
            {
              key: "email",
              label: "EMAIL",
              placeholder: "email@example.cm",
              keyboard: "email-address",
            },
            {
              key: "phone",
              label: "TÉLÉPHONE",
              placeholder: "+237 6XX XXX XXX",
              keyboard: "phone-pad",
            },
            {
              key: "password",
              label: "MOT DE PASSE",
              placeholder: "••••••••",
              keyboard: "default",
              secure: true,
            },
          ].map((f) => (
            <View key={f.key} style={{ marginBottom: 16 }}>
              <Text
                style={{
                  color: "#94A3B8",
                  fontSize: 11,
                  fontWeight: "700",
                  marginBottom: 8,
                }}
              >
                {f.label}
              </Text>
              <TextInput
                placeholder={f.placeholder}
                placeholderTextColor="#475569"
                value={form[f.key]}
                onChangeText={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                keyboardType={f.keyboard}
                secureTextEntry={f.secure}
                autoCapitalize="none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 14,
                  color: "#F1F5F9",
                  fontSize: 15,
                }}
              />
            </View>
          ))}

          <View
            style={{
              backgroundColor: `${COLORS.blockchain}12`,
              borderRadius: 10,
              padding: 12,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: `${COLORS.blockchain}25`,
            }}
          >
            <Text
              style={{ color: "#93C5FD", fontSize: 12, textAlign: "center" }}
            >
              ⛓️ Un wallet Celo sera créé automatiquement
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 14,
              padding: 16,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
              marginBottom: 16,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                Créer mon compte →
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            style={{ alignItems: "center", paddingBottom: insets.bottom + 20 }}
          >
            <Text style={{ color: "#64748B", fontSize: 13 }}>
              Déjà inscrit ?{" "}
              <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
                Se connecter
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
