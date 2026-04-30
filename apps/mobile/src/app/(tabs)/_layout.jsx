import { Tabs } from "expo-router";
import { Home, Leaf, CreditCard, Vote, User } from "lucide-react-native";

const COLORS = {
  primary: "#2ED732",
  secondary: "#FFD700",
  dark: "#0F172A",
  darkCard: "#1E293B",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.darkCard,
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.08)",
          paddingTop: 4,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#64748B",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="cooperatives"
        options={{
          title: "Coopératives",
          tabBarIcon: ({ color, size }) => <Leaf color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="cotisations"
        options={{
          title: "Cotisations",
          tabBarIcon: ({ color, size }) => (
            <CreditCard color={color} size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="votes"
        options={{
          title: "Votes",
          tabBarIcon: ({ color, size }) => <Vote color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
