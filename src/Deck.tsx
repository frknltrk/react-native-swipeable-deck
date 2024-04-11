import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  FlatList,
  type LayoutChangeEvent,
  SafeAreaView,
  type PanResponderGestureState,
} from 'react-native';

const SWIPE_OUT_DURATION = 250;

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
  useEffect(() => {
    // Reset scaleValue to 0 for the new card
    scaleValue.setValue(0);
    // Start the scale animation
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, scaleValue]);

  const [containerWidth, setContainerWidth] = useState(0);
  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const position = useMemo(() => new Animated.ValueXY(), []);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture: PanResponderGestureState) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture: PanResponderGestureState) => {
      if (gesture.dx > containerWidth * 0.25 && !swipeRightDisabled) {
        !actionsReversed ? moveToPreviousCard() : moveToNextCard();
      } else if (gesture.dx < -containerWidth * 0.25 && !swipeLeftDisabled) {
        !actionsReversed ? moveToNextCard() : moveToPreviousCard();
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  }, [position]);

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

  const moveToNextCard = useCallback(() => {
    if (currentIndex < data.length - 1) {
      !actionsReversed
        ? forceSwipe('left', () => setCurrentIndex(currentIndex + 1))
        : forceSwipe('right', () => setCurrentIndex(currentIndex + 1));
    } else {
      resetPosition();
    }
  }, [
    currentIndex,
    data.length,
    forceSwipe,
    actionsReversed,
    resetPosition,
    setCurrentIndex,
  ]);

  const moveToPreviousCard = useCallback(() => {
    if (!backwardMoveDisabled && currentIndex > 0) {
      !actionsReversed
        ? forceSwipe('right', () => setCurrentIndex(currentIndex - 1))
        : forceSwipe('left', () => setCurrentIndex(currentIndex - 1));
    } else {
      resetPosition();
    }
  }, [
    currentIndex,
    forceSwipe,
    backwardMoveDisabled,
    actionsReversed,
    resetPosition,
    setCurrentIndex,
  ]);

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
      ...position.getLayout(),
      transform: [{ rotate }, { scale }], // include the scale transform here
    };
  };

  const renderItem = ({ item, index }: { item: T; index: number }) => {
    if (currentIndex < 0 || currentIndex > data.length - 1) {
      const clampedCurrentIndex = Math.min(
        Math.max(currentIndex, 0),
        data.length - 1
      );
      setCurrentIndex(clampedCurrentIndex);
    }
    if (index === currentIndex) {
      return (
        <Animated.View key={index} style={[styles.cardStyle, getCardStyle()]}>
          {renderCard(item)}
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView
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
        scrollEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  deckContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'yellow',
  },
  flatListContentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  flatListStyle: {
    width: '100%',
    height: '100%',
    flexGrow: 0, // Don't grow the list
  },
  cardStyle: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    //backgroundColor: 'black',
  },
});

export default SwipeableDeck;
