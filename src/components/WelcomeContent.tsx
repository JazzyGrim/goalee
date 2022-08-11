import React from 'react';
import { Box, Text, Heading, VStack } from 'native-base';
import { Dimensions } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import ForwardButton from './ForwardButton';

type Props = {
  welcomeAnimation: SharedValue<number>;
  remainingDays: number;
};

const { width } = Dimensions.get('window');
const AnimatedBox = Animated.createAnimatedComponent(Box);

const WelcomeContent: React.FC<Props> = ({
  welcomeAnimation,
  remainingDays,
}) => {
  const itemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(welcomeAnimation.value, [0, 1], [0, -50]),
        },
      ],
      opacity: interpolate(welcomeAnimation.value, [0, 1], [1, 0]),
      zIndex: interpolate(welcomeAnimation.value, [0, 1], [5, -1]),
    };
  });

  return (
    <AnimatedBox
      display={'flex'}
      flexDirection='column'
      alignItems={'center'}
      position='absolute'
      left='0'
      bottom='0'
      px={'10%'}
      w={width}
      zIndex={10}
      style={itemStyle}
      safeAreaBottom
    >
      <Heading
        color='light.50'
        textAlign='center'
        fontSize='2xl'
        lineHeight={'lg'}
        mt={'20'}
      >
        Welcome back,{'\n'}
        <Text bold>Mateo</Text>
      </Heading>
      <VStack alignItems={'center'} mb={8}>
        {remainingDays > 0 ? (
          <Text fontSize={'lg'} textAlign='center' color='white'>
            You have <Text bold>{remainingDays}</Text> Days left until the
            deadline.
          </Text>
        ) : (
          <Text fontSize={'xl'} textAlign='center' color='white'>
            You have reached your goal!
          </Text>
        )}
      </VStack>
      <ForwardButton
        onPress={() => {
          welcomeAnimation.value = withTiming(1, { duration: 1000 });
        }}
      />
    </AnimatedBox>
  );
};

export default WelcomeContent;
