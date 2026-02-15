import { useMemo } from "react"
import { ActivityIndicator, Image, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context"

import Character from "@/components/Character"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useEpisodeDetails } from "@/hooks/useEpisodeDetails"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { $styles } from "@/theme/styles"

const BG = "#F8F6FF"
const PURPLE = "#735C92"
const TEXT_DARK = "#2B2545"
const TEXT_MUTED = "#A6A6C7"

const GRADIENT_COLORS = [PURPLE, BG] as const
const GRADIENT_LOCATIONS = [0, 0.3602] as const
const LOGO = require("../../assets/images/RickAndMorty.png")

const MAX_CHARACTERS = 12

function formatEpisodeLabel(code: string): string {
  const match = /E(\d{2})/i.exec(code)
  return match ? `EP${match[1]}` : code
}

export default function EpisodeDetails({ route }: AppStackScreenProps<"EpisodeDetails">) {
  const insets = useSafeAreaInsets()
  const { episodeId: episodeIdParam } = route.params ?? {}

  const { episode, characters, isLoading, errorKind } = useEpisodeDetails(episodeIdParam, {
    maxCharacters: MAX_CHARACTERS,
  })

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
          <Text style={styles.stateText}>Fetching episode from the Citadel…</Text>
        </View>
      ) : errorKind ? (
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>Uh-oh.</Text>
          <Text style={styles.stateText}>Failed to load this episode ({errorKind}).</Text>
        </View>
      ) : (
        <>
          <View style={styles.episodeMeta}>
            <Text style={styles.episodeCode}>
              {episode?.episode ? formatEpisodeLabel(episode.episode) : "--"}
            </Text>
            <Text style={styles.episodeTitle}>{episode?.name ?? "—"}</Text>
            <Text style={styles.episodeDate}>{episode?.airDate ?? "—"}</Text>
          </View>

          <View style={styles.entitiesHeader}>
            <Text style={styles.entitiesTitle}>ENTITIES IN THIS EPISODE</Text>
            <Text style={styles.entitiesSubtitle}>Data extracted from the Citadel database</Text>
          </View>

          <View style={styles.gridSection}>
            <View style={styles.gridRow}>
              {characters.map((c) => (
                <Character
                  key={c.id}
                  data={{
                    name: c.name,
                    image: c.image,
                    status: c.status,
                    ctaText: c.id === 1 ? "Access Classified File" : "Access File",
                  }}
                  onPress={() => {}}
                />
              ))}
            </View>
          </View>
        </>
      )}
      <SafeAreaView edges={["bottom"]} style={styles.bottomSpacer} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  bottomSpacer: { paddingBottom: 16, width: "100%" },

  centerState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 16,
  },
  container: { backgroundColor: BG },
  entitiesHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 24,
    paddingHorizontal: 16,
    width: "100%",
  },

  entitiesSubtitle: { color: TEXT_MUTED, fontSize: 12 },
  entitiesTitle: { color: TEXT_DARK, fontSize: 16, fontWeight: "700" },
  episodeCode: { color: PURPLE, fontSize: 18, fontWeight: "700" },

  episodeDate: { color: TEXT_MUTED, fontSize: 16 },
  episodeMeta: {
    alignItems: "center",
    flexDirection: "column",
    gap: 8,
    justifyContent: "center",
    marginVertical: 24,
    paddingHorizontal: 16,
    width: "100%",
  },
  episodeTitle: {
    color: TEXT_DARK,
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    textAlign: "center",
  },
  gradient: { width: "100%" },

  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
  },

  gridSection: { flexDirection: "column", gap: 16, marginTop: 12, width: "100%" },

  logo: { alignSelf: "center", height: 44, marginBottom: 16, width: 145 },
  stateText: {
    color: TEXT_MUTED,
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },

  stateTitle: {
    color: TEXT_DARK,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
})
