import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SwipeableDeck } from '@frknltrk/react-native-swipeable-cards';

const data = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <SwipeableDeck data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
