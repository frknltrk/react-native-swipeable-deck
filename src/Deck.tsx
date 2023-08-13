import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Card from './Card';

interface DeckProps {
  data: string[];
}

const SwipeableDeck: React.FC<DeckProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onSwipeLeft = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex((prevIndex: number) => prevIndex + 1);
      console.log('Deck.onSwipeLeft works');
    } else {
      // Optional: Implement what happens when you reach the end of the deck
      // For example, you can reset the currentIndex to 0 to start over.
      setCurrentIndex(0);
    }
  };

  const onSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex: number) => prevIndex - 1);
      console.log('Deck.onSwipeRight works');
    } else {
      // Optional: Implement what happens when you reach the beginning of the deck
      // For example, you can disable swiping to the left or show a message.
    }
  };

  // avoid using Non-null assertion operator (!): line 36. find another way to overcome TS2322
  return (
    <View style={styles.deckContainer}>
      <Card
        key={currentIndex}
        text={data[currentIndex]!}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SwipeableDeck;
