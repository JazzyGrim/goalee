import React from 'react';
import {
  useTheme,
  Text,
  Heading,
  Circle,
  VStack,
  Box,
  Spinner,
} from 'native-base';
import { Dimensions } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { IGoal } from '../models/types';
import CircularProgress from 'react-native-circular-progress-indicator';
import { convertDateToString } from '../utils/date';

type Props = {
  goal: IGoal | undefined;
  todaysProgress: number;
  welcomeAnimation: SharedValue<number>;
};

const { width } = Dimensions.get('window');

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedHeading = Animated.createAnimatedComponent(Heading);

const HomeTab: React.FC<Props> = ({
  goal,
  todaysProgress,
  welcomeAnimation,
}) => {
  const { colors } = useTheme();

  if (!goal) {
    return (
      <Box w={width} h='100%'>
        <Spinner></Spinner>
      </Box>
    );
  }

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(welcomeAnimation.value, [0, 1], [1.3, 1]),
        },
      ],
    };
  });

  const itemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(welcomeAnimation.value, [0, 1], [20, 0]),
        },
      ],
      opacity: welcomeAnimation.value,
    };
  });

  const { dayGoal, deadline, name, description } = goal;

  return (
    <VStack alignItems={'center'} justifyContent='center' w={width}>
      <Animated.View
        style={circleStyle}
        onTouchEnd={() =>
          (welcomeAnimation.value = withTiming(1, { duration: 1000 }))
        }
      >
        <Circle
          p={2}
          borderRadius={width / 2}
          borderWidth={3}
          borderColor={'blue.400'}
        >
          <CircularProgress
            value={todaysProgress > dayGoal ? dayGoal : todaysProgress}
            progressFormatter={() => {
              'worklet';
              return todaysProgress;
            }}
            radius={width / 3}
            duration={1000}
            circleBackgroundColor={colors.dark['50']}
            activeStrokeColor={colors.lightBlue['500']}
            activeStrokeSecondaryColor={colors.blue['700']}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            inActiveStrokeColor={colors.dark['50']}
            maxValue={dayGoal}
            title={`🏆 Goal ${dayGoal} hours`}
            titleColor={'white'}
            titleStyle={{
              fontWeight: 'bold',
              color: colors.text['400'],
              fontSize: 18,
            }}
          />
        </Circle>
      </Animated.View>
      <AnimatedText mt={8} color='text.500' style={itemStyle}>
        Deadline set at {convertDateToString(deadline.toDate())}
      </AnimatedText>
      <AnimatedHeading mt={1} style={itemStyle}>
        {name}
      </AnimatedHeading>
      <AnimatedText
        mt={1}
        color='text.800'
        px='10%'
        textAlign={'center'}
        style={itemStyle}
      >
        {description}
      </AnimatedText>
    </VStack>
  );
};

export default HomeTab;
