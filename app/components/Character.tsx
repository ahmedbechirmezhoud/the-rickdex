import { Image, Pressable, StyleSheet, View, type PressableProps } from "react-native"

import { Text } from "@/components/Text"
import { CharacterStatus } from "@/services/api/types"

const BG = "#F8F6FF"
const TEXT_DARK = "#2B2545"
const TEXT_MUTED = "#A6A6C7"

const STATUS_ALIVE = "#00D748"
const STATUS_DEAD = "#FF4D4D"
const STATUS_UNKNOWN = "#A6A6C7"

export interface CharacterCardData {
  id?: number | string
  name: string
  image: string
  status?: CharacterStatus
  ctaText?: string
}

type Props = PressableProps & {
  data: CharacterCardData
}

function getStatusColor(status?: CharacterStatus): string {
  switch (status) {
    case "Alive":
      return STATUS_ALIVE
    case "Dead":
      return STATUS_DEAD
    default:
      return STATUS_UNKNOWN
  }
}

export default function Character({ data, ...pressableProps }: Props) {
  const { name, image, status = "unknown", ctaText = "Access Classified File" } = data

  return (
    <Pressable style={styles.entityCard} {...pressableProps}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: image }} style={styles.avatar} />
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
      </View>

      <Text style={styles.entityName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.entityCta}>{ctaText}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 9999,
    height: 100,
    width: 100,
  },

  avatarWrap: {
    position: "relative",
  },

  entityCard: {
    alignItems: "center",
    flexDirection: "column",
    gap: 8,
    marginVertical: 8,
    width: "45%",
  },

  entityCta: {
    color: TEXT_MUTED,
    fontSize: 16,
  },

  entityName: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: "700",
  },

  statusDot: {
    alignItems: "center",
    borderColor: BG,
    borderRadius: 9999,
    borderWidth: 4,
    bottom: 0,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: 6,
    width: 20,
  },
})
