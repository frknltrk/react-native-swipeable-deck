import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Animated,
  FlatList,
  type LayoutChangeEvent,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SWIPE_OUT_DURATION = 250;

interface SwipeableDeckProps<T> {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  data: T[];
  renderCard: (item: T) => React.ReactNode;
  onSwipeLeftGo?: 'PREV' | 'NEXT' | null;
  onSwipeRightGo?: 'PREV' | 'NEXT' | null;
  cardMarginHorizontalPercentage?: number;
}

const SwipeableDeck = <T,>({
  currentIndex,
  setCurrentIndex,
  data,
  renderCard,
  onSwipeLeftGo = null,
  onSwipeRightGo = null,
  cardMarginHorizontalPercentage = 0,
}: SwipeableDeckProps<T>) => {
  const position = useRef(new Animated.ValueXY()).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
    scaleValue.setValue(0);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, position, scaleValue]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const resetPosition = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  }, [position]);

  const moveToNextCard = useCallback(() => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return true;
    }
    return false;
  }, [currentIndex, data.length, setCurrentIndex]);

  const moveToPreviousCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return true;
    }
    return false;
  }, [currentIndex, setCurrentIndex]);

  const forceSwipe = useCallback(
    (direction: 'right' | 'left') => {
      let action = direction === 'right' ? onSwipeRightGo : onSwipeLeftGo;
      let isSwipeCompleted;
      if (action === 'NEXT') {
        isSwipeCompleted = moveToNextCard();
      } else if (action === 'PREV') {
        isSwipeCompleted = moveToPreviousCard();
      } else {
        isSwipeCompleted = false;
      }

      if (isSwipeCompleted) {
        const x = direction === 'right' ? containerWidth : -containerWidth;
        Animated.timing(position, {
          toValue: { x, y: 0 },
          duration: SWIPE_OUT_DURATION,
          useNativeDriver: true,
        }).start(() => {
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        resetPosition();
      }
    },
    [
      onSwipeRightGo,
      onSwipeLeftGo,
      moveToNextCard,
      moveToPreviousCard,
      containerWidth,
      position,
      resetPosition,
    ]
  );

  const gesture = Gesture.Pan()
    .onUpdate(({ translationX, translationY }) => {
      position.setValue({ x: translationX, y: translationY });
    })
    .onEnd(({ translationX }) => {
      if (translationX > containerWidth * 0.25) {
        forceSwipe('right');
      } else if (translationX < -containerWidth * 0.25) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    });

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-containerWidth, 0, containerWidth],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    const scale = scaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return { transform: [{ rotate }, { scale }] };
  };

  const renderItem = ({ item, index }: { item: T; index: number }) => {
    if (index === currentIndex) {
      return (
        <Animated.View
          key={index}
          style={[
            styles.card,
            getCardStyle(),
            position.getLayout(),
            { marginHorizontal: `${cardMarginHorizontalPercentage}%` },
          ]}
        >
          {renderCard(item)}
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} onLayout={handleLayout}>
      <GestureDetector gesture={gesture}>
        <FlatList
          style={styles.flatList}
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
      </GestureDetector>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    width: '100%',
    height: '100%',
    flexGrow: 0,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SwipeableDeck;
