import React, { useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { SwipeableDeck } from '@frknltrk/react-native-swipeable-deck';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = ['text_1', 'text_2', 'text_3']; // Example data

  const swipeLeft = () => {
    const newIndex = currentIndex + 1;
    if (newIndex < data.length) {
      setCurrentIndex(newIndex);
      return true;
    }
    return false;
  };

  const swipeRight = () => {
    const newIndex = currentIndex - 1;
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <SwipeableDeck
        currentIndex={currentIndex}
        onSwipeLeft={swipeLeft}
        onSwipeRight={swipeRight}
        data={data}
        renderCard={(item) => (
          <View style={styles.card}>
            <Text>{item}</Text>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Swipe Left"
          onPress={swipeLeft}
          disabled={currentIndex === data.length - 1}
        />
        <Button
          title="Swipe Right"
          onPress={swipeRight}
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
