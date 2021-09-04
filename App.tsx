import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, StyleSheet, Text, View , TouchableOpacity, Animated, useWindowDimensions, Button} from 'react-native';
import { GestureEvent, PanGestureHandler, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


  const SPRING_CONFIG = {
          damping: 80,
          overshootClamping: true,
          restDisplacementThreshold: 0.1,
          restSpeedThreshold: 0.1,
          stiffness: 500,
  }

export default () => {

  const dimentions = useWindowDimensions();

  const top = useSharedValue(
    dimentions.height
  )

  const style = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value,SPRING_CONFIG),

    };
  });

  const gestureHander = useAnimatedGestureHandler({
    onActive:(event,context) => {
      top.value = event.translationY;
    },
  })

  const onPress = () => {
    console.log("クリックされました")
    top.value = withSpring(
      dimentions.height / 2,
      SPRING_CONFIG,
    );
  }




  return (
    <View style={styles.container}>

      {/* <TouchableOpacity onPress={() => onPress()}><Text style={{ fontSize: 50 }}>クリック</Text></TouchableOpacity> */}

      <Button title="クリック" onPress={() => onPress()}/>

      <PanGestureHandler onGestureEvent={gestureHander}>
        <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: dimentions.height,
            backgroundColor: 'gray',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style
        ]}
      >
        </Animated.View>
       </PanGestureHandler>
    </View>
  );
}


const ITEM_SIZE = (Dimensions.get('window').width * 345) / 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardItemContainer: {
    width: ITEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
      handleStyle: {
      backgroundColor: 'red',
      height: 4,
  },
  modalStyle: {
    width: ITEM_SIZE - 10,
    height: ITEM_SIZE - 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  bottomUpSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'gray',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
