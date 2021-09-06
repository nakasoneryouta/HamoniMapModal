import React from 'react';
import { View, Text, Animated, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Dimensions ,FlatList} from 'react-native';
import PanController from './screens/PanController/PanController';
import {
  Animated as AnimatedMap,
  AnimatedRegion,
  Marker,
} from 'react-native-maps';


type MARKER = {
  id: number, amount: number, coordinate: {
  latitude: number,longitude: number,
  }
}

const ITEM_SIZE = (Dimensions.get('screen').width * 345) / 375;
const ASPECT_RATIO = Dimensions.get('window').width / Dimensions.get('window').height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ITEM_SPACING = 10;
const ITEM_PREVIEW = 10;
const ITEM_WIDTH = Dimensions.get('screen').width - 2 * ITEM_SPACING - 2 * ITEM_PREVIEW;
const SNAP_WIDTH = ITEM_WIDTH + ITEM_SPACING;
const ITEM_PREVIEW_HEIGHT = 150;
const SCALE_END = Dimensions.get('screen').width / ITEM_WIDTH;
const BREAKPOINT1 = 246;
const BREAKPOINT2 = 350;
const ONE = new Animated.Value(1);

const component: React.FC = () => {

  const [panX] = React.useState(new Animated.Value(0))
  const [panY] = React.useState(new Animated.Value(0))
  const [canMoveHorizontal, setCanMoveHorizontal] = React.useState(false)
  const flatListRef = React.useRef<FlatList>(null);
  const [region] = React.useState(new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),)
  const [index, setIndex] = React.useState()


    const markers: MARKER[] = [
      {
        id: 0,
        amount: 99,
        coordinate: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
        },
      },
      {
        id: 1,
        amount: 199,
        coordinate: {
          latitude: LATITUDE + 0.004,
          longitude: LONGITUDE - 0.004,
        },
      },
      {
        id: 2,
        amount: 285,
        coordinate: {
          latitude: LATITUDE - 0.004,
          longitude: LONGITUDE - 0.004,
        },
      },
    ];

    const scrollY = panY.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scrollX = panX.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    });

    const scale = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [1, 1.6],
      extrapolate: 'clamp',
    });

    const translateY = scrollY.interpolate({
      inputRange: [0, BREAKPOINT1],
      outputRange: [0, -100],
      extrapolate: 'clamp',
    });


  const getMarkerState = (panX, panY, scrollY, i) => {
      const xLeft = -SNAP_WIDTH * i + SNAP_WIDTH / 2;
      const xRight = -SNAP_WIDTH * i - SNAP_WIDTH / 2;
      const xPos = -SNAP_WIDTH * i;

      const isIndex = panX.interpolate({
        inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
        outputRange: [0, 1, 1, 0],
        extrapolate: 'clamp',
      });

      const isNotIndex = panX.interpolate({
        inputRange: [xRight - 1, xRight, xLeft, xLeft + 1],
        outputRange: [1, 0, 0, 1],
        extrapolate: 'clamp',
      });

      const center = panX.interpolate({
        inputRange: [xPos - 10, xPos, xPos + 10],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      });

      const selected = panX.interpolate({
        inputRange: [xRight, xPos, xLeft],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      });

      const translateY = Animated.multiply(isIndex, panY);

      const translateX = panX;

      const anim = Animated.multiply(
        isIndex,
        scrollY.interpolate({
          inputRange: [0, BREAKPOINT1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      );

      const scale = Animated.add(
        ONE,
        Animated.multiply(
          isIndex,
          scrollY.interpolate({
            inputRange: [BREAKPOINT1, BREAKPOINT2],
            outputRange: [0, SCALE_END - 1],
            extrapolate: 'clamp',
          })
        )
      );

      // [0 => 1]
      let opacity = scrollY.interpolate({
        inputRange: [BREAKPOINT1, BREAKPOINT2],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });

      // if i === index: [0 => 0]
      // if i !== index: [0 => 1]
      opacity = Animated.multiply(isNotIndex, opacity);

      // if i === index: [1 => 1]
      // if i !== index: [1 => 0]
      opacity = opacity.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      });

      let markerOpacity = scrollY.interpolate({
        inputRange: [0, BREAKPOINT1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });

      markerOpacity = Animated.multiply(isNotIndex, markerOpacity).interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      });

      const markerScale = selected.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
      });

      return {
        translateY,
        translateX,
        scale,
        opacity,
        anim,
        center,
        selected,
        markerOpacity,
        markerScale,
      };
  }

  const onPanYChange = ({ value }) => {
    // const {
    //   canMoveHorizontal,
    //   region,
    //   scrollY,
    //   scrollX,
    //   markers,
    //   index,
    // } = this.state;
    const shouldBeMovable = Math.abs(value) < 2;
    if (shouldBeMovable !== canMoveHorizontal) {
      setCanMoveHorizontal(shouldBeMovable)
      if (!shouldBeMovable) {
        const { coordinate } = markers[index];
        region.stopAnimation();
        region
          .timing({
            latitude: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [
                coordinate.latitude,
                coordinate.latitude - LATITUDE_DELTA * 0.5 * 0.375,
              ],
              extrapolate: 'clamp',
            }),
            latitudeDelta: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [LATITUDE_DELTA, LATITUDE_DELTA * 0.5],
              extrapolate: 'clamp',
            }),
            longitudeDelta: scrollY.interpolate({
              inputRange: [0, BREAKPOINT1],
              outputRange: [LONGITUDE_DELTA, LONGITUDE_DELTA * 0.5],
              extrapolate: 'clamp',
            }),
            duration: 0,
          })
          .start();
      } else {
        region.stopAnimation();
        region
          .timing({
            latitude: scrollX.interpolate({
              inputRange: markers.map((m, i) => i * SNAP_WIDTH),
              outputRange: markers.map(m => m.coordinate.latitude),
            }),
            longitude: scrollX.interpolate({
              inputRange: markers.map((m, i) => i * SNAP_WIDTH),
              outputRange: markers.map(m => m.coordinate.longitude),
            }),
            duration: 0,
          })
          .start();
      }
    }
  };

  const onStartShouldSetPanResponder = (event: any) => {
    // we only want to move the view if they are starting the gesture on top
    // of the view, so this calculates that and returns true if so. If we return
    // false, the gesture should get passed to the map view appropriately.
    const { pageY } =event.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = Dimensions.get('screen').height - pageY;

    return topOfTap < topOfMainWindow;
  };

    const  onMoveShouldSetPanResponder = (event: any) => {
    const { pageY } = event.nativeEvent;
    const topOfMainWindow = ITEM_PREVIEW_HEIGHT + panY.__getValue();
    const topOfTap = Dimensions.get('screen').height - pageY;

    return topOfTap < topOfMainWindow;
  };

  const animations = markers.map((m, i) =>
    getMarkerState(panX, panY, scrollY, i)
  );

  const onPanXChange = ({ value }) => {
    const newIndex = Math.floor((-1 * value + SNAP_WIDTH / 2) / SNAP_WIDTH);
    if (index !== newIndex) {
      setIndex(index)
    }
  };

  React.useEffect(() => {
    // const { region, panX, panY, scrollX, markers } = this.state;

    panX.addListener(onPanXChange);
    panY.addListener(onPanYChange);

    region.stopAnimation();
    region
      .timing({
        latitude: scrollX.interpolate({
          inputRange: markers.map((m, i) => i * SNAP_WIDTH),
          outputRange: markers.map(m => m.coordinate.latitude),
        }),
        longitude: scrollX.interpolate({
          inputRange: markers.map((m, i) => i * SNAP_WIDTH),
          outputRange: markers.map(m => m.coordinate.longitude),
        }),
        duration: 0,
      })
      .start();
  }, [])

  
  // const _renderItem = () => {
  //   return (
  //     <PanController
  //         style={styles.container}
  //         vertical
  //         xMode="snap"
  //         snapSpacingX={SNAP_WIDTH}
  //         yBounds={[-1 * Dimensions.get('screen').height, 0]}
  //         xBounds={[-Dimensions.get('screen').width * (markers.length - 1), 0]}
  //         panY={panY}
  //         panX={panX}
  //         onStartShouldSetPanResponder={onStartShouldSetPanResponder}
  //         onMoveShouldSetPanResponder={onMoveShouldSetPanResponder}
  //       >
  //         <View style={styles.itemContainer}>
  //           {markers.map((marker, i) => {
  //             const { translateY, translateX, scale, opacity } = animations[i];

  //             return (
  //               <Animated.View
  //                 key={marker.id}
  //                 style={[
  //                   styles.item,
  //                   {
  //                     opacity,
  //                     transform: [{ translateY }, { translateX }, { scale }],
  //                   },
  //                 ]}
  //               />
  //             );
  //           })}
  //         </View>
  //       </PanController>
  //   )
  // }

	return (
    <View style={styles.container}>
      <PanController
          style={styles.container}
          vertical
          xMode="snap"
          snapSpacingX={SNAP_WIDTH}
          yBounds={[-1 * Dimensions.get('screen').height, 0]}
          xBounds={[-Dimensions.get('screen').width * (markers.length - 1), 0]}
          panY={panY}
          panX={panX}
          onStartShouldSetPanResponder={onStartShouldSetPanResponder}
          onMoveShouldSetPanResponder={onMoveShouldSetPanResponder}
        >
          <View style={styles.itemContainer}>
            {markers.map((marker, i) => {
              const { translateY, translateX, scale, opacity } = animations[i];

              return (
                <Animated.View
                  key={marker.id}
                  style={[
                    styles.item,
                    {
                      opacity,
                      transform: [{ translateY }, { translateX }, { scale }],
                    },
                  ]}
                />
              );
            })}
          </View>
        </PanController>

      </View>
	);
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  itemContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    paddingHorizontal: ITEM_SPACING / 2 + ITEM_PREVIEW,
    position: 'absolute',
    paddingTop: Dimensions.get('screen').height - ITEM_PREVIEW_HEIGHT - 64,
  },
  map: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
  item: {
    width: ITEM_WIDTH,
    height: Dimensions.get('screen').height + 2 * ITEM_PREVIEW_HEIGHT,
    backgroundColor: 'red',
    marginHorizontal: ITEM_SPACING / 2,
    overflow: 'hidden',
    borderRadius: 3,
    borderColor: '#000',
  },
});

export default component;