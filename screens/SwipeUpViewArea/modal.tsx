import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, PanResponder, Animated, ScrollView ,TouchableOpacity, FlatList} from 'react-native';

interface Props {
  alwaysOpen: number;
  modalHeight: number;
}

const component: React.FC<Props> = ({ alwaysOpen ,modalHeight}) => {

	const {height, width} = Dimensions.get('window');
  const initialPosition = {x: 0, y: 0}
  const position = new Animated.ValueXY(initialPosition);
  const flatListRef = React.useRef<FlatList>(null);
  const [isTop, setToTop] = React.useState(false)

  const parentResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e, gestureState) => {
        return false
      },
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) =>  {
        //下にスワイプの制御
        if (isTop) {
          return gestureState.dy > 6
        }
        //上にスワイプ
        else {
          return gestureState.dy < -6
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (evt, gestureState) => {
        //newy=スワイプしている距離
        let newy = gestureState.dy

        //modalが下にいかない処理
        if (isTop && newy < 0 ) return
        if (isTop) {
          position.setValue({x: 0, y: newy});
        } else {
          position.setValue({x: 0, y: initialPosition.y + newy});
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (isTop) {
          if (gestureState.dy > 50) {
            snapToBottom(initialPosition)
          } else {
            snapToTop()
          }
        } else {
          if (gestureState.dy < -50) {
            snapToTop()
          } else {
            snapToBottom(initialPosition)
          }
        }
    },
  });

  const snapToTop = () => {
		Animated.timing(position, {
		toValue: {x: 0, y: -modalHeight + alwaysOpen},
		duration: alwaysOpen,
		useNativeDriver: false,
    }).start(() => {
      //finish animation
      setToTop(true)
    });
	}
	
  const snapToBottom = (initialPosition: { x: number; y: number; }) => {
		Animated.timing(position, {
		toValue: 0,
		duration: 150,
		useNativeDriver: false,
    }).start(() => {
      //finish animation
      setToTop(false)
    });
  }
  
  const _renderItem = () => {
    return (
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.draggable, { height },position.getLayout()]} {...parentResponder.panHandlers}>
          <Text style={styles.dragHandle}>=</Text>
          <View style={styles.scroll}>
            <Text>こんにちはです</Text>
          </View>
        </Animated.View>
      </View>
    )
  }

	return (
        <FlatList
            ref={flatListRef}
            style={{ overflow: 'visible', height: alwaysOpen ,position: 'absolute',bottom: 0,backgroundColor:'red',}}
            data={["sample","sample","sample","sample","sample","sample","sample",]}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            decelerationRate={0.6}
            snapToInterval={(Dimensions.get('screen').width * 375) / 375}
            renderItem={() => {
            return (_renderItem())
            }}
        />
	);
};

export default component;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  draggable: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'skyblue',
    alignItems: 'center'
  },
  dragHandle: {
    fontSize: 22,
    color: '#707070',
    height: 60
  },
  scroll: {
    paddingLeft: 10,
    paddingRight: 10
  }
});