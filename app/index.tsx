import { Entypo, Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const gnx = require('../assets/images/gnx.jpeg');
const icon_1 = require('../assets/images/1.png');
const icon_2 = require('../assets/images/2.png');
const icon_3 = require('../assets/images/3.png');

const PADDING_BOTTOM = 160;
const IMAGE_SIZE_LARGE = 300; // Increased size for better look
const IMAGE_SIZE_SMALL = 40;

const ANIMATION_CONFIGS_IOS = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

export default function Index() {
  const inset = useSafeAreaInsets();
  const [canPan, setCanPan] = useState(false);

  const bottomSheetPosition = useSharedValue(height);
  const bottomSheetIndex = useSharedValue(0);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [PADDING_BOTTOM, PADDING_BOTTOM, '100%'], []);

  // Sync state with index for interaction handling
  const handleSheetChanges = useCallback((index: number) => {
    setCanPan(index === 2);
  }, []);

  const expand = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(2);
  }, []);

  const collapse = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(bottomSheetIndex.value, [1, 2], [54, height], Extrapolation.CLAMP),
      marginHorizontal: interpolate(bottomSheetIndex.value, [1, 2], [12, 0], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(bottomSheetIndex.value, [1, 1.2], ['#FFFFFF', '#7C7D80']),
      // Fixed border radius transition
      borderRadius: interpolate(bottomSheetIndex.value, [1, 1.05, 2], [12, 38, 38], Extrapolation.CLAMP),
      boxShadow: bottomSheetIndex.value < 1.05 ? "0px 2px 20px rgba(0, 0 , 0, 0.15)" : "0px 2px 20px rgba(0, 0 , 0, 0)",
    };
  });

  const animatedImage = useAnimatedStyle(() => {
    const size = interpolate(bottomSheetIndex.value, [1, 2], [IMAGE_SIZE_SMALL, IMAGE_SIZE_LARGE], Extrapolation.CLAMP);
    const translateX = interpolate(
      bottomSheetIndex.value, 
      [1, 2], 
      [8, (width / 2) - (IMAGE_SIZE_LARGE / 2)], 
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      bottomSheetIndex.value, 
      [1, 2], 
      [8, inset.top + 60], 
      Extrapolation.CLAMP
    );

    return {
      width: size,
      height: size,
      borderRadius: interpolate(bottomSheetIndex.value, [1, 2], [8, 12], Extrapolation.CLAMP),
      transform: [{ translateX }, { translateY }]
    };
  });

  const animatedContent = useAnimatedStyle(() => ({
    // Content fades in later in the transition
    opacity: interpolate(bottomSheetIndex.value, [1.5, 1.9], [0, 1], Extrapolation.CLAMP),
  }));

  const animatedSmallContent = useAnimatedStyle(() => ({
    // Small bar content fades out quickly
    opacity: interpolate(bottomSheetIndex.value, [1, 1.1], [1, 0], Extrapolation.CLAMP),
  }));

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheetModal
        detached
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        animatedPosition={bottomSheetPosition}
        animatedIndex={bottomSheetIndex}
        animationConfigs={ANIMATION_CONFIGS_IOS}
        enableOverDrag={false}
        enableDynamicSizing={false}
        style={styles.sheetContainer}
        handleStyle={{ display: 'none' }}
        backgroundStyle={styles.sheetContainer}
        onChange={handleSheetChanges}
        enablePanDownToClose={false}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          <Animated.View style={[styles.contentContainer, animatedStyle]}>
            {/* FULL PLAYER UI */}
            <Animated.View 
              style={[StyleSheet.absoluteFill, styles.largeContentWrapper, { paddingTop: inset.top }, animatedContent]} 
              pointerEvents={canPan ? 'auto' : 'none'}
            >
              <Pressable onPress={collapse} style={styles.dragHandleWrapper}>
                <View style={styles.dragHandle} />
              </Pressable>
              
              <View style={styles.fullContentWrapper}>
                <View style={styles.songHeader}>
                    <View>
                        <Text style={styles.largeTitle}>luther</Text>
                        <Text style={styles.largeSubtitle}>Kendrick Lamar & SZA</Text>
                    </View>
                    <Ionicons name="ellipsis-horizontal-circle" size={28} color="white" style={{ opacity: 0.8 }} />
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar} />
                </View>
                <View style={styles.timeWrapper}>
                  <Text style={styles.timeText}>0:24</Text>
                  <Text style={styles.timeText}>-2:24</Text>
                </View>
                <View style={styles.controlWrapper}>
                  <Pressable>
                    <Entypo name="controller-fast-backward" size={40} color={'white'} />
                  </Pressable>
                  <Pressable>
                    <Entypo name="controller-play" size={54} color={'white'} />
                  </Pressable>
                  <Pressable>
                    <Entypo name="controller-fast-forward" size={40} color={'white'} />
                  </Pressable>
                </View>
                <View style={styles.volumeWrapper}>
                  <Ionicons name="volume-low" size={20} color={"#DFE0E4"} />
                  <View style={styles.volumeBarContainer}>
                    <View style={styles.volumeBar} />
                  </View>
                  <Ionicons name="volume-high" size={20} color={"#DFE0E4"} />
                </View>
                <View style={styles.bottomIconsWrapper}>
                  <Pressable>
                    <Image tintColor={'white'} source={icon_1} style={styles.icon} resizeMode="contain" />
                  </Pressable>
                  <Pressable>
                    <Image tintColor={'white'} source={icon_2} style={styles.icon} resizeMode="contain" />
                  </Pressable>
                  <Pressable>
                    <Image tintColor={'white'} source={icon_3} style={styles.icon} resizeMode="contain" />
                  </Pressable>
                </View>
              </View>
            </Animated.View>

            {/* SHARED IMAGE COMPONENT */}
            <Animated.Image source={gnx} style={[styles.collapsedImage, animatedImage]} resizeMethod="auto" resizeMode="cover" />

            {/* COLLAPSED BAR UI */}
            <Animated.View style={[styles.collapsedPressableWrapper, animatedSmallContent]} pointerEvents={canPan ? 'none' : 'auto'}>
              <Pressable onPress={expand} style={styles.collapsedPressable}>
                <View style={styles.collapsedContent}>
                  <Text style={styles.collapsedTitle}>luther</Text>
                  <View style={styles.collapsedButtons}>
                    <Pressable>
                      <Entypo name="controller-play" size={28} />
                    </Pressable>
                    <Pressable>
                      <Entypo name="controller-fast-forward" size={28} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </BottomSheetView>
      </BottomSheetModal>

      <View style={styles.navWrapper}>
        <View style={styles.navItem}>
          <Foundation size={28} color={'#FA233B'} name="home" />
          <Text style={styles.navTextActive}>Home</Text>
        </View>
        <View style={styles.navItemGap5}>
          <Ionicons size={24} color={'#8D8D8D'} name="grid" />
          <Text style={styles.navText}>Browse</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons size={28} color={'#8D8D8D'} name="radio" />
          <Text style={styles.navText}>Radio</Text>
        </View>
        <View style={styles.navItem}>
          <MaterialIcons size={28} color={'#8D8D8D'} name="library-music" />
          <Text style={styles.navText}>Library</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons size={28} color={'#8D8D8D'} name="search" />
          <Text style={styles.navText}>Search</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  sheetContainer: {
    backgroundColor: 'transparent'
  },
  bottomSheetView: {
    flex: 1
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: 'flex-start', // Fixed: prevent centering content in modal
    borderRadius: 12,
    flex: 1,
    overflow: 'hidden'
  },
  largeContentWrapper: {
    alignItems: 'center',
    overflow: 'hidden'
  },
  dragHandleWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 10
  },
  dragHandle: {
    width: 36,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 6
  },
  fullContentWrapper: {
    paddingTop: 380, // Space for the larger album art
    width: '100%',
    paddingHorizontal: 32,
    flex: 1
  },
  songHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  largeTitle: {
    color: "#FFF",
    fontWeight: '700',
    fontSize: 22
  },
  largeSubtitle: {
    color: "#FFF",
    opacity: 0.6,
    fontWeight: '400',
    fontSize: 20
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    backgroundColor: "rgba(255,255,255,0.2)",
    marginTop: 28
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: '35%',
    backgroundColor: "rgba(255,255,255,0.8)"
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timeText: {
    color: "#FFF",
    opacity: 0.5,
    fontSize: 12,
    marginTop: 8
  },
  controlWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 30
  },
  volumeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 16
  },
  volumeBarContainer: {
    height: 4,
    borderRadius: 2,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  volumeBar: {
    height: 4,
    borderRadius: 2,
    width: '60%',
    backgroundColor: "rgba(255,255,255,0.8)"
  },
  bottomIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 50
  },
  icon: {
    width: 22,
    height: 22,
    opacity: 0.8
  },
  collapsedPressableWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 54,
  },
  collapsedPressable: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  collapsedImage: {
    borderRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5
  },
  collapsedContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  collapsedTitle: {
    flex: 1,
    paddingLeft: 56,
    fontSize: 16,
    fontWeight: '400'
  },
  collapsedButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingRight: 12
  },
  navWrapper: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    left: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    height: 40
  },
  navItemGap5: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    height: 40
  },
  navText: {
    color: "#8D8D8D",
    fontSize: 10,
    fontWeight: '500'
  },
  navTextActive: {
    color: "#FA233B",
    fontSize: 10,
    fontWeight: '500'
  },
});
