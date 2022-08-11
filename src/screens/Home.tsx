import { Box, Flex, Text, StatusBar, useTheme, Spinner } from 'native-base';
import React, { useRef, useState } from 'react';
import { FlatList, ViewToken } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HistoryTab from '../components/HistoryTab';
import HomeTab from '../components/HomeTab';
import Navigation from '../components/Navigation';
import WelcomeContent from '../components/WelcomeContent';
import { useFirebase } from '../context/FirebaseContext';
import { ScreenIndex } from '../models/types';
import { convertDateToString } from '../utils/date';

const AnimatedBox = Animated.createAnimatedComponent(Box);

const secondsInADay = 1000 * 60 * 60 * 24;

const Home: React.FC = () => {
  const { goal, todaysProgress } = useFirebase();
  const { colors } = useTheme();
  const [screenIndex, setScreenIndex] = useState<ScreenIndex>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const modalAnimation = useSharedValue(0);
  const welcomeAnimation = useSharedValue(0);

  const flatListRef = useRef<FlatList>(null);

  const today = new Date();
  const deadline: Date = goal ? goal.deadline.toDate() : today;
  const remainingDays = Math.ceil(
    Math.abs(deadline.valueOf() - today.valueOf()) / secondsInADay,
  );

  const toggleModalOpen = (): void => {
    if (modalOpen) modalAnimation.value = withTiming(0);
    else modalAnimation.value = withTiming(1);
    setModalOpen(prev => !prev);
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        welcomeAnimation.value,
        [0, 1],
        [colors.dark['100'], colors.warning['100']],
        'RGB',
      ),
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderTopLeftRadius: interpolate(modalAnimation.value, [0, 1], [24, 0]),
      borderTopRightRadius: interpolate(modalAnimation.value, [0, 1], [24, 0]),
    };
  });

  const modalStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(modalAnimation.value, [0, 1], [0, -50]),
      opacity: interpolate(
        modalAnimation.value,
        [0.5, 1],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  // RN Does not provide this
  type ViewableTypes = {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  };
  const viewUpdateRef = useRef((data: ViewableTypes) => {
    const { viewableItems } = data;
    if (viewableItems && viewableItems.length == 1)
      setScreenIndex(viewableItems[0].index as ScreenIndex);
  });

  if (!goal) {
    return (
      <Box flex={1}>
        <Spinner></Spinner>
      </Box>
    );
  }

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <AnimatedBox flex={1} style={containerStyle}>
        <Flex
          safeAreaTop
          mx={'10%'}
          flexDirection='row'
          alignItems={'center'}
          justifyContent='space-between'
        >
          <Text fontSize={36}>{goal.emoji}</Text>
          <Text fontSize={18} color='text.500'>
            {convertDateToString(new Date())}
          </Text>
        </Flex>
        <FlatList
          ref={flatListRef}
          data={[{ key: '0' }, { key: '1' }]}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onViewableItemsChanged={viewUpdateRef.current}
          renderItem={({ item }) => {
            return item.key === '0' ? (
              <HomeTab
                welcomeAnimation={welcomeAnimation}
                goal={goal}
                todaysProgress={todaysProgress}
              />
            ) : (
              <HistoryTab />
            );
          }}
        />

        <Navigation
          toggleLogModal={toggleModalOpen}
          modalStyle={modalStyle}
          borderStyle={borderStyle}
          flatListRef={flatListRef}
          screenIndex={screenIndex}
          welcomeAnimation={welcomeAnimation}
        />

        <WelcomeContent
          welcomeAnimation={welcomeAnimation}
          remainingDays={remainingDays}
        />
      </AnimatedBox>
    </>
  );
};

export default Home;
