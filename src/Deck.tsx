import React, { useState } from 'react';
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  FlatList,
} from 'react-native';

const SWIPE_OUT_DURATION = 250;

interface SwipeableDeckProps {
  data: React.ReactNode[];
}

const SwipeableDeck: React.FC<SwipeableDeckProps> = ({ data }) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (event) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const position = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      // panResponder should only be responsible for the swipe threshold
      // move the currentIndex check ahead of the control flow
      // could be onSwipeLeft/Right
      if (gesture.dx > containerWidth * 0.25 && currentIndex > 0) {
        forceSwipe('right');
      } else if (
        gesture.dx < -containerWidth * 0.25 &&
        currentIndex < data.length - 1
      ) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? containerWidth : -containerWidth;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    direction === 'right' ? onSwipeRight() : onSwipeLeft();
    position.setValue({ x: 0, y: 0 });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-containerWidth, 0, containerWidth],
      outputRange: ['-60deg', '0deg', '60deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const onSwipeLeft = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const onSwipeRight = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: React.ReactNode;
    index: number;
  }) => {
    if (index === currentIndex) {
      return (
        <Animated.View key={index} style={[styles.cardStyle, getCardStyle()]}>
          {item}
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={styles.deckContainer}
      onLayout={handleLayout}
    >
      <FlatList
        style={styles.flatListStyle}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContentContainerStyle} // Center horizontally
      />
    </View>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    flex: 1,
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  flatListContentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  flatListStyle: {
    width: '50%',
    height: '50%',
    backgroundColor: 'red',
    flexGrow: 0, // Don't grow the list
  },
  cardStyle: {
    width: 'auto',
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    backgroundColor: 'black',
  },
});

export default SwipeableDeck;
