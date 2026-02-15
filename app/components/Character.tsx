import { Image, Pressable, StyleSheet, View } from "react-native"

import { Text } from "@/components/Text"

const BG = "#F8F6FF"
const TEXT_DARK = "#2B2545"
const TEXT_MUTED = "#A6A6C7"
const STATUS_ALIVE = "#00D748"

export default function Character() {
  return (
    <Pressable style={styles.entityCard}>
      <View style={styles.avatarWrap}>
        <Image
          source={{ uri: "https://rickandmortyapi.com/api/character/avatar/1.jpeg" }}
          style={styles.avatar}
        />
        <View style={[styles.statusDot, styles.statusAlive]} />
      </View>

      <Text style={styles.entityName}>Rick Sanchez</Text>
      <Text style={styles.entityCta}>Access Classified File</Text>
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

  statusAlive: {
    backgroundColor: STATUS_ALIVE,
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
