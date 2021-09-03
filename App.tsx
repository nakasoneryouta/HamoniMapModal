import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View ,Image, ListRenderItemInfo, NativeSyntheticEvent, NativeScrollEvent, TouchableOpacity} from 'react-native';
import { Modalize } from 'react-native-modalize';

export default function App() {

  const ITEM_SIZE = (Dimensions.get('window').width * 345) / 375;
  const ITEM_PADDING = (Dimensions.get('window').width * 15) / 375;
  const [progress, setProgress] = React.useState(0);
  const ref = React.useRef<FlatList>(null);

    const _renderItem = (item: ListRenderItemInfo<any>) => {
    return (
      <View style={styles.cardItemContainer}>
        
        <Modalize
          // ref={modalizeRef}
          modalHeight={(Dimensions.get('window').height * 650) / 812}
          handleStyle={styles.handleStyle}
          alwaysOpen={(Dimensions.get('window').height * 180) / 812}
          disableScrollIfPossible={true}
          handlePosition="outside"
          rootStyle={{backgroundColor: 'green'}}
          childrenStyle={{height:100,backgroundColor: 'yellow'}}
          overlayStyle={{backgroundColor: 'blue'}}
          modalStyle={styles.modalStyle}
          withOverlay={false}
        >
        </Modalize>
      </View>
    );
    };
  
    const _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.floor(
      (event.nativeEvent.contentOffset.x + (ITEM_SIZE / 2 - 1)) / ITEM_SIZE,
    );
    if (progress != index) {
      setProgress(index);
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress = {() => console.log("クリックされた")}>
        <Text style = {{color: 'black',fontSize: 50,marginTop: 600,position: 'absolute'}}>クリック</Text>
      </TouchableOpacity>

        <FlatList
        ref={ref}
        horizontal
        data={["data","data","data","data","data","data","data",]}
        contentContainerStyle={{
          paddingHorizontal: ITEM_PADDING,
        }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={_renderItem}
        scrollEventThrottle={1}
        snapToInterval={ITEM_SIZE}
        showsVerticalScrollIndicator={false}
        decelerationRate={0.6}
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => _onScroll(event)}
      />
    </View>
  );
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
