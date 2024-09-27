import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const SWIPE_OUT_DURATION = 250;

// Define Props Interface
interface SwipeableDeckProps<T> {
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
  data: T[];
  renderCard: (item: T) => React.ReactNode;
  swipeLeftDisabled?: boolean;
  swipeRightDisabled?: boolean;
  backwardMoveDisabled?: boolean;
  actionsReversed?: boolean;
}

const SwipeableDeck = <T,>({
  currentIndex,
  setCurrentIndex,
  data,
  renderCard,
  swipeLeftDisabled = false,
  swipeRightDisabled = false,
  backwardMoveDisabled = false,
  actionsReversed = false,
}: SwipeableDeckProps<T>) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const position = useRef(new Animated.ValueXY()).current;

  // Effect to scale the card when currentIndex changes
  useEffect(() => {
    scaleValue.setValue(0);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, scaleValue]);

  const [containerWidth, setContainerWidth] = useState(0);

  // Handle layout changes to get container width
  const handleLayout = (event: any) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: position.x,
          translationY: position.y,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX > containerWidth * 0.25 && !swipeRightDisabled) {
        !actionsReversed ? moveToPreviousCard() : moveToNextCard();
      } else if (translationX < -containerWidth * 0.25 && !swipeLeftDisabled) {
        !actionsReversed ? moveToNextCard() : moveToPreviousCard();
      } else {
        resetPosition(); // Call resetPosition when releasing without swiping enough
      }
    }
  };

  // Function to reset card position with animation
  const resetPosition = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  }, [position]);

  // Function to force card swipe and move to next or previous card
  const forceSwipe = useCallback(
    (direction: 'right' | 'left', func: () => void) => {
      const x = direction === 'right' ? containerWidth : -containerWidth;
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: true,
      }).start(() => {
        position.setValue({ x: 0, y: 0 });
        func();
      });
    },
    [containerWidth, position]
  );

  // Function to set clamped index
  const setClampedIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.min(Math.max(index, 0), data.length - 1);
      setCurrentIndex(clampedIndex);
    },
    [data.length, setCurrentIndex]
  );

  // Move to next card logic
  const moveToNextCard = useCallback(() => {
    if (currentIndex < data.length - 1) {
      !actionsReversed
        ? forceSwipe('left', () => setClampedIndex(currentIndex + 1))
        : forceSwipe('right', () => setClampedIndex(currentIndex + 1));
    } else {
      resetPosition();
    }
  }, [
    currentIndex,
    data.length,
    forceSwipe,
    actionsReversed,
    resetPosition,
    setClampedIndex,
  ]);

  // Move to previous card logic
  const moveToPreviousCard = useCallback(() => {
    if (!backwardMoveDisabled && currentIndex > 0) {
      !actionsReversed
        ? forceSwipe('right', () => setClampedIndex(currentIndex - 1))
        : forceSwipe('left', () => setClampedIndex(currentIndex - 1));
    } else {
      resetPosition();
    }
  }, [
    currentIndex,
    forceSwipe,
    backwardMoveDisabled,
    actionsReversed,
    resetPosition,
    setClampedIndex,
  ]);

  // Get styles for the current card
  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-containerWidth, 0, containerWidth],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    const scale = scaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return {
      transform: [{ rotate }, { scale }],
    };
  };

  // Renderer for individual cards
  const renderItem = ({ item, index }: { item: T; index: number }) => {
    if (index === currentIndex) {
      return (
        <Animated.View
          key={index}
          style={[styles.cardStyle, getCardStyle(), position.getLayout()]}
        >
          {renderCard(item)}
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.deckContainer} onLayout={handleLayout}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <FlatList
          style={styles.flatListStyle}
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContentContainerStyle}
          scrollEnabled={false}
        />
      </PanGestureHandler>
    </SafeAreaView>
  );
};

// Define styles
const styles = StyleSheet.create({
  deckContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  flatListStyle: {
    width: '100%',
    height: '100%',
    flexGrow: 0,
  },
  cardStyle: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
  },
});

export default SwipeableDeck;
