import { StyleSheet , View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";


type Tab = { id: string; label: string };
type TabVariant = 'default' | 'underline';

export function TabButtons({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
}: {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: TabVariant;
}) {

  if (variant === 'underline') {
    return (
      <View style={underlineStyles.root}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={underlineStyles.scrollContent}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={underlineStyles.tab}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[
                    underlineStyles.label,
                    isActive && underlineStyles.labelActive,
                  ]}
                >
                  {tab.label}
                </ThemedText>
                {isActive && <View style={underlineStyles.indicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={underlineStyles.borderBottom} />
      </View>
    );
  }

  // ── Variant default : pills avec fond coloré (style historique) ──
  return (
    <View style={defaultStyles.wrapper}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            defaultStyles.tab,
            activeTab === tab.id && defaultStyles.tabActive,
          ]}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.8}
        >
          <ThemedText
            style={[
              defaultStyles.label,
              activeTab === tab.id && defaultStyles.labelActive,
            ]}
          >
            {tab.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// styles variant default (identique à la page historique)
const defaultStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#1A8C3E',
    shadowColor: '#1A8C3E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { fontSize: 13, fontWeight: '500', color: '#666' },
  labelActive: { color: '#fff', fontWeight: '700' },
});

// styles variant underline
const underlineStyles = StyleSheet.create({
  root: { position: 'relative' },
  scrollContent: { paddingHorizontal: 20, gap: 0 },
  tab: {
    paddingHorizontal: 4,
    paddingVertical: 10,
    marginRight: 20,
    alignItems: 'center',
    position: 'relative',
  },
  label: { fontSize: 13, fontWeight: '500', color: '#9CA3AF' },
  labelActive: { color: '#1A8C3E', fontWeight: '700' },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1A8C3E',
    borderRadius: 2,
  },
  borderBottom: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: -1,
  },
});