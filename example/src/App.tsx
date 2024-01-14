import React, { useRef } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { SwipeableDeck } from '@frknltrk/react-native-swipeable-deck';

const App: React.FC = () => {
  const swipeableDeckRef = useRef<{
    forceSwipeLeft: () => void;
    forceSwipeRight: () => void;
  }>(null);

  const swipeLeft = () => {
    swipeableDeckRef.current?.forceSwipeLeft();
  };

  const swipeRight = () => {
    swipeableDeckRef.current?.forceSwipeRight();
  };

  const data = [
    'text_1',
    'text_2',
    'text_3',
    // Add more custom content as needed
  ];

  return (
    <View style={styles.container}>
      <SwipeableDeck
        ref={swipeableDeckRef}
        data={data}
        renderCard={(item) => (
          <View style={styles.card}>
            <Text>{item}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row' }}>
        <Button title="Swipe Left" onPress={swipeLeft} />
        <Button title="Swipe Right" onPress={swipeRight} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'green',
  },
  card: {
    width: 300,
    height: 200,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginVertical: 10,
  },
});

export default App;
