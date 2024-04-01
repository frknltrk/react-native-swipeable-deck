import React, { useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { SwipeableDeck } from '@frknltrk/react-native-swipeable-deck';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = ['text_1', 'text_2', 'text_3']; // Example data

  return (
    <View style={styles.container}>
      <SwipeableDeck
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        data={data}
        renderCard={(item) => (
          <View style={styles.card}>
            <Text>{item}</Text>
          </View>
        )}
        isSwipeLeftDisabled={false}
        isSwipeRightDisabled={false}
        isBackwardMoveDisabled={false}
        isReversed={false}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Swipe Left"
          onPress={() => setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === data.length - 1}
        />
        <Button
          title="Swipe Right"
          onPress={() => setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default App;
