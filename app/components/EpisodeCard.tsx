import { memo } from "react"
import { Pressable, View } from "react-native"

import { EpisodeUi } from "@/services/api/types"
import { getEpLabel } from "@/utils/episodes"

import { Text } from "./Text"

function cardStyle({ pressed }: { pressed: boolean }) {
  return [styles.card, pressed ? styles.cardPressed : undefined]
}

function EpisodeCard({ episode, onPress }: { episode: Partial<EpisodeUi>; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={cardStyle} onPress={() => onPress?.()}>
      <Text text={getEpLabel(episode.episode)} style={styles.epCode} />

      <View style={styles.cardBody}>
        <Text text={episode.name} style={styles.epName} />
        <Text text={episode.airDate} style={styles.epDate} />
      </View>
    </Pressable>
  )
}

const styles = {
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2B2545",
    borderRadius: 16,
    borderColor: "#735C92",
    borderWidth: 1,
    marginBottom: 12,
  },
  cardPressed: {
    backgroundColor: "#2E2E4D",
  },
  epCode: {
    color: "#735C92",
    fontWeight: "bold" as const,
    marginRight: 16,
    fontSize: 32,
  },
  cardBody: {
    flexDirection: "column" as const,
    flex: 1,
  },
  epName: {
    color: "#F8F6FF",
    fontSize: 18,
    fontWeight: "bold" as const,
    lineHeight: 28,
  },
  epDate: {
    color: "#A6A6C7",
    fontSize: 12,
    marginTop: 4,
  },
}

export default memo(EpisodeCard)
