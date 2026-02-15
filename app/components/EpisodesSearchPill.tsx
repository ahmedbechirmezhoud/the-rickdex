import { useCallback, useMemo, useRef, useState } from "react"
import {
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native"
import * as Haptics from "expo-haptics"
import { KeyboardStickyView } from "react-native-keyboard-controller"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { scheduleOnRN } from "react-native-worklets"

import SearchIcon from "@/components/LoopIcon"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"

type EpisodesSearchPillProps = {
  label?: string
  onPress?: () => void
  style?: ViewStyle

  value?: string
  onChangeText?: (text: string) => void
  onSubmit?: (text: string) => void
  placeholder?: string

  collapseOnBlur?: boolean
}

const BG = "#FFFFFF"
const BORDER = "#735C92"
const TEXT = "#2E2E4D"
const INPUT_TEXT = "#2B2545"
const SHADOW = "#000"
const TRANSPARENT = "transparent"

const EXPAND_MS = 280
const COLLAPSE_MS = 220

export default function EpisodesSearchPill({
  label = "Search… if you must.",
  onPress,
  style,

  value,
  onChangeText,
  onSubmit,
  placeholder = "Search episodes…",
  collapseOnBlur = true,
}: EpisodesSearchPillProps) {
  const insets = useSafeAreaInsets()
  const { width: screenWidth } = useWindowDimensions()

  const inputRef = useRef<any>(null)

  const [internalValue, setInternalValue] = useState("")
  const inputValue = value ?? internalValue

  const [isExpanded, setIsExpanded] = useState(false)

  const progress = useSharedValue(0) // 0 collapsed -> 1 expanded
  const collapsedWidth = useSharedValue(0)
  const containerWidth = useSharedValue(0)

  const floatingStyle = useMemo(
    () => [styles.floatingWrap, { bottom: insets.bottom + 16 }, style],
    [insets.bottom, style],
  )

  const maxWidthFallback = Math.max(0, screenWidth - 32)

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const expand = useCallback(() => {
    if (isExpanded) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    onPress?.()
    setIsExpanded(true)

    progress.value = withTiming(1, { duration: EXPAND_MS }, (finished) => {
      if (finished) scheduleOnRN(focusInput)
    })
  }, [focusInput, isExpanded, onPress, progress])

  const collapse = useCallback(() => {
    if (!collapseOnBlur) return
    progress.value = withTiming(0, { duration: COLLAPSE_MS }, (finished) => {
      if (finished) scheduleOnRN(setIsExpanded, false)
    })
  }, [collapseOnBlur, progress])

  const onContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      containerWidth.value = e.nativeEvent.layout.width
    },
    [containerWidth],
  )

  const onPillLayout = useCallback(
    (e: LayoutChangeEvent) => {
      // capture collapsed width only while collapsed
      if (!isExpanded) collapsedWidth.value = e.nativeEvent.layout.width
    },
    [collapsedWidth, isExpanded],
  )

  const pillAnimatedStyle = useAnimatedStyle(() => {
    const from = collapsedWidth.value > 0 ? collapsedWidth.value : 260
    const to = containerWidth.value > 0 ? containerWidth.value : maxWidthFallback

    const w = interpolate(progress.value, [0, 1], [from, to], Extrapolation.CLAMP)

    return {
      width: w,
      transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.02], Extrapolation.CLAMP) }],
    }
  }, [maxWidthFallback])

  const collapsedContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [0, -6], Extrapolation.CLAMP),
        },
      ],
    }
  })

  const inputWrapAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [6, 0], Extrapolation.CLAMP),
        },
      ],
    }
  })

  const handleChangeText = useCallback(
    (text: string) => {
      if (value === undefined) setInternalValue(text)
      onChangeText?.(text)
    },
    [onChangeText, value],
  )

  const handleSubmit = useCallback(() => {
    onSubmit?.(inputValue)
  }, [inputValue, onSubmit])

  return (
    <KeyboardStickyView>
      <View pointerEvents="box-none" style={floatingStyle} onLayout={onContainerLayout}>
        <Animated.View
          onLayout={onPillLayout}
          style={[styles.pill, pillAnimatedStyle]}
          accessible={!isExpanded}
          accessibilityRole={!isExpanded ? "button" : undefined}
          accessibilityLabel={!isExpanded ? label : undefined}
        >
          {/* Collapsed content (icon + label) */}
          <Animated.View
            style={[styles.collapsedContent, collapsedContentAnimatedStyle]}
            pointerEvents={isExpanded ? "none" : "auto"}
          >
            <SearchIcon color={TEXT} />
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </Animated.View>

          {/* Input overlay */}
          <Animated.View
            style={[styles.inputWrap, inputWrapAnimatedStyle]}
            pointerEvents={isExpanded ? "auto" : "none"}
          >
            <TextField
              ref={inputRef}
              value={inputValue}
              onChangeText={handleChangeText}
              placeholder={placeholder}
              placeholderTextColor="#7A7897"
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
              onBlur={collapse}
              editable={isExpanded}
              selectionColor={BORDER}
              clearButtonMode={Platform.OS === "ios" ? "while-editing" : "never"}
            />
          </Animated.View>

          {!isExpanded ? (
            <Pressable
              onPress={expand}
              style={StyleSheet.absoluteFill}
              accessibilityRole="button"
              accessibilityLabel={label}
            />
          ) : null}
        </Animated.View>
      </View>
    </KeyboardStickyView>
  )
}

const styles = StyleSheet.create({
  collapsedContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },

  floatingWrap: {
    alignItems: "center",
    justifyContent: "center",
    left: 16,
    position: "absolute",
    right: 16,
  },

  input: {
    backgroundColor: TRANSPARENT,
    borderRadius: 9999,
    color: INPUT_TEXT,

    fontSize: 16,
    height: 44,
    paddingHorizontal: 12,
  },

  inputWrap: {
    backgroundColor: TRANSPARENT,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",

    right: 0,
    top: 0,
  },

  label: {
    color: TEXT,
    fontSize: 16,
  },

  pill: {
    backgroundColor: BG,
    borderColor: BORDER,
    borderRadius: 9999,

    borderWidth: 2,
    elevation: 4,
    justifyContent: "center",

    overflow: "hidden",
    paddingHorizontal: 32,
    paddingVertical: 16,
    position: "relative",
    shadowColor: SHADOW,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
})
