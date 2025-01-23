import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { SwipeableDeck } from '@frknltrk/react-native-swipeable-deck';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled,
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      {
        opacity: pressed || disabled ? 0.5 : 1,
      },
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = [
    'text_1',
    'text_2',
    'text_3',
    'text_4',
    'text_5',
    'text_6',
    'text_7',
    'text_8',
    'text_9',
  ];

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
        swipeLeftDisabled={false}
        swipeRightDisabled={false}
        backwardMoveDisabled={false}
        actionsReversed={false}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Previous"
          onPress={() => setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
        />
        <CustomButton
          title="Next"
          onPress={() => setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === data.length - 1}
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
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
