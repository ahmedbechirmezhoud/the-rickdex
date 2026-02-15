import { Pressable, StyleSheet, View } from "react-native"
import LottieView from "lottie-react-native"

import { Text } from "./Text"

const COLORS = {
  textDark: "#2B2545",
  textMuted: "#A6A6C7",
  buttonBg: "#2E2E4D",
  buttonText: "#F8F6FF",
} as const

type ErrorStateProps = {
  onPressRetry?: () => void
}

export default function ErrorState({ onPressRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/Morty Cry Loader.json")}
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={styles.title}>Aw jeez… something broke.</Text>
      <Text style={styles.subtitle}>Data fetch failed. Retry before Rick finds out.</Text>

      <Pressable style={styles.button} onPress={onPressRetry}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: COLORS.buttonBg,
    borderRadius: 999,
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  lottie: {
    height: 200,
    width: 200,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    textAlign: "center",
  },
  title: {
    color: COLORS.textDark,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    marginTop: 24,
  },
})
