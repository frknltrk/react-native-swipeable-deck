import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SwipeableDeck } from '@frknltrk/react-native-swipeable-cards';

const data = [
  <Text key="1">Card 1 Content</Text>,
  <Text key="2">Card 2</Text>,
  <View key="3">
    <Text>Custom View</Text>
    <Text>More Custom Content</Text>
  </View>,
  // Add more custom content as needed
];

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <SwipeableDeck card_contents={data} />
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
