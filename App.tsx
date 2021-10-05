import * as React from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, PanResponder, Animated, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Map from './screens/Map/Map'
import SwipeUpViewArea from './screens/SwipeUpViewArea/SwipeUpViewArea'
// import BottomDrawer from './screens/BottomDrawer/BottomDrawer'

const ITEM_SIZE = (Dimensions.get('screen').width * 345) / 375;
const ITEM_SPACE = (Dimensions.get('screen').width * 15) / 375;
const modalHeight = Dimensions.get('screen').height

const data = ["sample","sample","sample","sample","sample","sample","sample",]

export default function App() {

  return (
      <View style={styles.container}>
          <SwipeUpViewArea
              alwaysOpen={300}
              modalHeight={modalHeight}
              data={["sample", "sample", "sample", "sample", "sample", "sample", "sample",]}>
              <TouchableOpacity>
                <Text style = {{fontSize: 50}}>クリックです</Text>
              </TouchableOpacity>
          </SwipeUpViewArea>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
  },
});
