import { useCallback, useMemo } from "react"
import { ActivityIndicator, Image, StyleSheet, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "@react-navigation/native"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import EpisodeCard from "@/components/EpisodeCard"
import { Text } from "@/components/Text"
import { useEpisodesList } from "@/hooks/useEpisodesList"
import { AppStackScreenProps } from "@/navigators/navigationTypes"
import { $styles } from "@/theme/styles"
import { buildRows, Row } from "@/utils/episodes"

const BG = "#F8F6FF"
const GRADIENT_COLORS = ["#735C92", BG] as const
const GRADIENT_LOCATIONS = [0, 0.3602] as const
const LOGO = require("../../assets/images/RickAndMorty.png")

export default function EpisodesScreen() {
  const insets = useSafeAreaInsets()

  const { episodes, isLoading, isLoadingMore, hasNextPage, loadMore, errorKind, reload } =
    useEpisodesList()

  const { rows, stickyHeaderIndices } = useMemo(() => buildRows(episodes), [episodes])

  const gradientStyle = useMemo(() => [styles.gradient, { height: insets.top + 24 }], [insets.top])

  const contentContainerStyle = useMemo(
    () => ({ paddingBottom: insets.bottom + 16 }),
    [insets.bottom],
  )

  const keyExtractor = useCallback((item: Row) => {
    return item.type === "header" ? `header-${item.season}` : `ep-${item.episode.id}`
  }, [])

  const getItemType = useCallback((item: Row) => item.type, [])

  const navigation = useNavigation<AppStackScreenProps<"EpisodeDetails">["navigation"]>()

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Row>) => {
    if (item.type === "header") {
      return (
        <View style={styles.header}>
          <Text text={item.title} preset="subheading" />
        </View>
      )
    }

    return (
      <View style={styles.episodeRow}>
        <EpisodeCard
          episode={{
            name: item.episode.name,
            episode: item.episode.episode,
            airDate: item.episode.airDate,
          }}
          onPress={() =>
            navigation.navigate("EpisodeDetails", { episodeId: item.episode.id.toString() })
          }
        />
      </View>
    )
  }, [])

  // ✅ FlashList infinite scroll callback
  const onEndReached = useCallback(() => {
    if (!hasNextPage || isLoading || isLoadingMore) return
    loadMore()
  }, [hasNextPage, isLoading, isLoadingMore, loadMore])

  const ListFooterComponent = useMemo(() => {
    if (!isLoadingMore) return null
    return (
      <View style={styles.footer}>
        <ActivityIndicator color="#735C92" />
      </View>
    )
  }, [isLoadingMore])

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

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#735C92" size="large" />
        </View>
      ) : errorKind ? (
        <View style={styles.error}>
          <Text preset="default" text={`Couldn’t load episodes (${errorKind}).`} />
        </View>
      ) : (
        <FlashList
          data={rows}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          stickyHeaderIndices={stickyHeaderIndices}
          estimatedItemSize={92}
          onRefresh={reload}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.6}
          ListFooterComponent={ListFooterComponent}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: BG,
  },
  episodeRow: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  error: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  footer: {
    paddingVertical: 16,
  },
  gradient: {
    width: "100%",
  },
  header: {
    backgroundColor: BG,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  logo: {
    alignSelf: "center",
    height: 44,
    marginBottom: 16,
    width: 145,
  },
})
