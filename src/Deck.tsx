import React, { useCallback, useMemo, useState } from 'react';
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
  onSwipeLeft: () => boolean;
  onSwipeRight: () => boolean;
  data: T[];
  renderCard: (item: T) => React.ReactNode;
}

const SwipeableDeck = <T,>({
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  data,
  renderCard,
}: SwipeableDeckProps<T>) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
    console.log(containerWidth);
  };

  const position = useMemo(() => new Animated.ValueXY(), []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture: PanResponderGestureState) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture: PanResponderGestureState) => {
      // panResponder should only be responsible for the swipe threshold
      // move the currentIndex check ahead of the control flow
      // could be onSwipeLeft/Right
      const swipeOutDistance = containerWidth * 0.25;
      const swipedRight = gesture.dx > swipeOutDistance;
      const swipedLeft = gesture.dx < -swipeOutDistance;

      if (swipedRight) {
        const changed = onSwipeRight();
        if (!changed) {
          resetPosition();
        } else {
          forceSwipe('right');
        }
      } else if (swipedLeft) {
        const changed = onSwipeLeft();
        if (!changed) {
          resetPosition();
        } else {
          forceSwipe('left');
        }
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = useCallback(() => {
    console.log(position);
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  }, [position]);

  const forceSwipe = useCallback(
    (direction: 'right' | 'left') => {
      const x = direction === 'right' ? containerWidth : -containerWidth;
      Animated.timing(position, {
        toValue: { x, y: 0 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      }).start(() => {
        position.setValue({ x: 0, y: 0 });
      });
    },
    [containerWidth, position]
  );

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

  const renderItem = ({ item, index }: { item: T; index: number }) => {
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
