import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, PanResponder, Animated, ScrollView, FlatList } from 'react-native';

interface Props {
  alwaysOpen: number;
  modalHeight: number;
  data: any[];
}

const ITEM_SIZE = (Dimensions.get('window').width * 345) / 375;

const component: React.FC<Props> = ({ alwaysOpen ,modalHeight,data,children}) => {

	const {height, width} = Dimensions.get('window');
  const initialPosition = {x: 0, y: height - alwaysOpen}
	const position = new Animated.ValueXY(initialPosition);
  const [toTop, setToTop] = React.useState<boolean>()
  const flatListRef = React.useRef<FlatList>(null);
  const ITEM_PADDING = (Dimensions.get('window').width * 15) / 375;

	const parentResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e, gestureState) => {
        return false
      },
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) =>  {
        if (toTop) {
          return gestureState.dy > 6
        } else {
          return gestureState.dy < -6
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        let newy = gestureState.dy
        if (toTop && newy < 0 ) return
        if (toTop) {
          position.setValue({x: 0, y: newy});
        } else {
          position.setValue({x: 0, y: initialPosition.y + newy});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (toTop) {
          if (gestureState.dy > 50) {
            snapToBottom(initialPosition)
          } else {
            snapToTop()
          }
        } else {
          if (gestureState.dy < -90) {
            snapToTop()
          } else {
            snapToBottom(initialPosition)
          }
        }
      },
	});

	const snapToTop = () => {
		Animated.timing(position, {
		toValue: {x: 0, y: 0},
		duration: 300,
		useNativeDriver: false,
    }).start(() => {
      setToTop(true)
    });
		
	}
	
	const snapToBottom = (initialPosition: { x: number; y: number; }) => {
		Animated.timing(position, {
		toValue: initialPosition,
		duration: 150,
		useNativeDriver: false,
		}).start(() => { setToTop(false)});
	}

  const _renderItem = () => {
    return (
      <View style={styles.cardItemContainer}>
        <View style={styles.cardItem}>
          </View>
      </View>
    )
  }

	return (
    <View style={styles.container}>
        {children}
        <Animated.View style={[styles.draggable, { height },position.getLayout()]} {...parentResponder.panHandlers}>
        <FlatList
            ref={flatListRef}
            style={{flex: 1,backgroundColor: 'red'}}
            data={data}
              horizontal
              contentContainerStyle={{
              paddingHorizontal: ITEM_PADDING,
              }}
            pagingEnabled
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            decelerationRate={0.6}
            snapToInterval={ITEM_SIZE}
            renderItem={() => {
            return (_renderItem())
            }}
        />
        </Animated.View>
      </View>
	);
};

export default component;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%',
  },
  draggable: {
      position: 'absolute',
      right: 0,
      backgroundColor: 'skyblue',
      alignItems: 'center'
  },
  cardItemContainer: {
    flex: 1,
    width: ITEM_SIZE
  },
  cardItem: {
    width: ITEM_SIZE - 10,
    backgroundColor: 'blue',
    flex: 1
  }
});