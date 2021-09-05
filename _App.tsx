import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View ,Image, ListRenderItemInfo, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity, ScrollView} from 'react-native';
import { Modalize } from 'react-native-modalize';

export default function App() {

  const ITEM_SIZE = (Dimensions.get('window').width * 345) / 375;
  const ITEM_PADDING = (Dimensions.get('window').width * 15) / 375;
  const [progress, setProgress] = React.useState(0);
  const ref = React.useRef<FlatList>(null);

  return(
    <View style={{...styles.container, position: "relative"}}
      onStartShouldSetResponderCapture={()=>true}
    >
      <View style={{
        position: "absolute",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        backgroundColor: "gold"
      }} onTouchStart={()=>console.log("Success", Date.now())}></View>
      <ScrollView 
        horizontal={true} 
        style={{backgroundColor: "#FF3"}}
        onTouchStart={()=>console.log("OnTouchScrollView", Date.now())}
        pointerEvents="box-none"
        >
          <View style={{width: 300, height: 300, backgroundColor: "green", marginTop: 300}} pointerEvents="none" /> 
        {/* <Modal></Modal> */}

      </ScrollView>
    </View>
  )
}


const Modal: React.FC = () => {
  return(
    <View style={{width: 300, height: 300, backgroundColor: "green", marginTop: 300}}>

    </View>
  )
}


const ITEM_SIZE = (Dimensions.get('window').width * 345) / 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  }
});
