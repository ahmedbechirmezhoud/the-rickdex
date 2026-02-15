import { useMemo } from "react"
import { ActivityIndicator, Image, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import ErrorState from "@/components/ErrorState"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useCharacterDetails } from "@/hooks/useCharacterDetails"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { $styles } from "@/theme/styles"

const BG = "#F8F6FF"
const PURPLE = "#735C92"
const TEXT_DARK = "#2B2545"
const TEXT_MUTED = "#A6A6C7"
const CARD_BG = "#FFFFFF"
const DIVIDER_BG = "#ECE8F6"

const GRADIENT_COLORS = [PURPLE, BG] as const
const GRADIENT_LOCATIONS = [0, 0.3602] as const
const LOGO = require("../../assets/images/RickAndMorty.png")

export default function CharacterDetailsScreen({ route }: AppStackScreenProps<"CharacterDetails">) {
  const insets = useSafeAreaInsets()
  const { characterId: characterIdParam } = route.params ?? {}

  const { character, isLoading, errorKind, reload } = useCharacterDetails(characterIdParam)

  const gradientStyle = useMemo(() => [styles.gradient, { height: insets.top + 24 }], [insets.top])

  return (
    <Screen preset="scroll" style={[$styles.flex1, styles.container]}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={gradientStyle}
        accessible={false}
      />

      <Image source={LOGO} resizeMode="contain" style={styles.logo} />

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator />
          <Text style={styles.stateText}>Fetching entity from the Citadel…</Text>
        </View>
      ) : errorKind ? (
        <View style={styles.centerState}>
          <ErrorState onPressRetry={reload} />
        </View>
      ) : (
        <>
          <View style={styles.hero}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: character?.image ?? "" }} style={styles.avatar} />
            </View>

            <Text style={styles.name} numberOfLines={2}>
              {character?.name ?? "—"}
            </Text>

            <Text style={styles.subline}>
              {(character?.status ?? "Unknown").toUpperCase()} •{" "}
              {(character?.species ?? "—").toUpperCase()}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ENTITY DETAILS</Text>
            <Text style={styles.sectionSubtitle}>
              {character?.id === 1 ? "Classified" : ""} information from the Citadel database
            </Text>

            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Gender</Text>
                <Text style={styles.value}>{character?.gender ?? "—"}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Species</Text>
                <Text style={styles.value}>{character?.species ?? "—"}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Origin</Text>
                <Text style={styles.value}>{character?.origin?.name ?? "—"}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>{character?.location?.name ?? "—"}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Type</Text>
                <Text style={styles.value}>{character?.type?.trim() ? character.type : "—"}</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Origin</Text>
                <Text style={styles.value}>{character?.origin?.name ?? "—"}</Text>
              </View>
            </View>
          </View>
        </>
      )}

      <SafeAreaView edges={["bottom"]} style={styles.bottomSpacer} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 9999,
    height: 140,
    width: 140,
  },

  avatarWrap: { position: "relative" },

  bottomSpacer: { paddingBottom: 16, width: "100%" },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    marginTop: 16,
    padding: 14,
    width: "100%",
  },

  centerState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 16,
  },

  container: { backgroundColor: BG },

  divider: { backgroundColor: DIVIDER_BG, height: 1, width: "100%" },

  gradient: { width: "100%" },

  hero: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    width: "100%",
  },

  label: { color: TEXT_MUTED, fontSize: 13, fontWeight: "600" },

  logo: { alignSelf: "center", height: 44, marginBottom: 16, width: 145 },

  name: {
    color: TEXT_DARK,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    marginTop: 14,
    textAlign: "center",
  },

  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
    width: "100%",
  },

  sectionSubtitle: { color: TEXT_MUTED, fontSize: 12, marginTop: 2, textAlign: "center" },

  sectionTitle: { color: TEXT_DARK, fontSize: 16, fontWeight: "700", textAlign: "center" },

  stateText: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  subline: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },

  value: { color: TEXT_DARK, flexShrink: 1, fontSize: 14, fontWeight: "700", textAlign: "right" },
})
