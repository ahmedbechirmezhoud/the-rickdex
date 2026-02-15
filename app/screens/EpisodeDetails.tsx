import { useMemo } from "react"
import { Image, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import Character from "@/components/Character"
import { Text } from "@/components/Text"
// import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { $styles } from "@/theme/styles"

// type Props = AppStackScreenProps<"EpisodeDetails">

const BG = "#F8F6FF"
const PURPLE = "#735C92"
const TEXT_DARK = "#2B2545"
const TEXT_MUTED = "#A6A6C7"

const GRADIENT_COLORS = [PURPLE, BG] as const
const GRADIENT_LOCATIONS = [0, 0.3602] as const
const LOGO = require("../../assets/images/RickAndMorty.png")

export default function EpisodeDetails() {
  //   const { episodeId } = route.params
  const insets = useSafeAreaInsets()

  const gradientStyle = useMemo(() => [styles.gradient, { height: insets.top + 24 }], [insets.top])

  return (
    <View style={[$styles.flex1, styles.container]}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={gradientStyle}
        accessible={false}
      />

      <Image source={LOGO} resizeMode="contain" style={styles.logo} />

      <View style={styles.episodeMeta}>
        <Text style={styles.episodeCode}>EP01</Text>
        <Text style={styles.episodeTitle}>Pilot</Text>
        <Text style={styles.episodeDate}>December 2, 2013</Text>
      </View>

      <View style={styles.entitiesHeader}>
        <Text style={styles.entitiesTitle}>ENTITIES IN THIS EPISODE</Text>
        <Text style={styles.entitiesSubtitle}>Data extracted from the Citadel database</Text>
      </View>

      <View style={styles.gridSection}>
        <View style={styles.gridRow}>
          <Character />
          <Character />
          <Character />
          <Character />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG,
  },

  entitiesHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 24,
    paddingHorizontal: 16,
    width: "100%",
  },

  entitiesSubtitle: {
    color: TEXT_MUTED,
    fontSize: 12,
  },

  entitiesTitle: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: "700",
  },
  episodeCode: {
    color: PURPLE,
    fontSize: 18,
    fontWeight: "700",
  },
  episodeDate: {
    color: TEXT_MUTED,
    fontSize: 16,
  },
  episodeMeta: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginVertical: 24,
    paddingHorizontal: 16,
    width: "100%",
  },

  episodeTitle: {
    color: TEXT_DARK,
    fontSize: 32,
    fontWeight: "700",
  },
  gradient: {
    width: "100%",
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    width: "100%",
  },

  gridSection: {
    flexDirection: "column",
    gap: 16,
    marginTop: 12,
    width: "100%",
  },
  logo: {
    alignSelf: "center",
    height: 44,
    marginBottom: 16,
    width: 145,
  },
})
