import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SwipeableDeck } from '@frknltrk/react-native-swipeable-cards';

const App: React.FC = () => {
  const data = [
    <View key="1" style={styles.card}>
      <Text>Card 1 Content</Text>
    </View>,
    <View key="2" style={styles.card}>
      <Text>Card 2 Content</Text>
    </View>,
    <View key="3" style={styles.card}>
      <Text>Card 3 Content</Text>
    </View>,
    // Add more custom content as needed
  ];

  return <SwipeableDeck data={data} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
