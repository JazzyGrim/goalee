import {
  Button,
  Center,
  Flex,
  HStack,
  Input,
  Pressable,
  useTheme,
} from 'native-base';
import React, { RefObject, useState } from 'react';
import { FlatList } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { ScreenIndex } from '../models/types';
import HomeIcon from '../assets/icons/Home';
import CalendarIcon from '../assets/icons/Calendar';
import PlusIcon from '../assets/icons/Plus';
import MinusIcon from '../assets/icons/Minus';
import firestore from '@react-native-firebase/firestore';
import config from '../../config';

type Props = {
  toggleLogModal: () => void;
  modalStyle: { top: number; opacity: number };
  borderStyle: { borderTopLeftRadius: number; borderTopRightRadius: number };
  flatListRef: RefObject<FlatList>;
  screenIndex: ScreenIndex;
  welcomeAnimation: SharedValue<number>;
};

const AnimatedCenter = Animated.createAnimatedComponent(Center);
const AnimatedHStack = Animated.createAnimatedComponent(HStack);

const Navigation: React.FC<Props> = ({
  toggleLogModal,
  modalStyle,
  borderStyle,
  flatListRef,
  screenIndex,
  welcomeAnimation,
}) => {
  const [amount, setAmount] = useState<string>('1');
  const { colors } = useTheme();

  const navigationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(welcomeAnimation.value, [0, 1], [50, 0]),
        },
      ],
      opacity: welcomeAnimation.value,
    };
  });

  const increase = (): void => {
    if (amount === '10000') return;
    setAmount(prev => (parseInt(prev) + 1).toString());
  };

  const decrease = (): void => {
    if (amount === '1') return;
    setAmount(prev => (parseInt(prev) - 1).toString());
  };

  const onChange = (text: string): void => {
    try {
      const num = parseInt(text);
      if (num < 1 || num > 10000) return;
      setAmount(text);
    } catch (e) {
      // Nothing for now
    }
  };

  const addTimeLog = async (): Promise<void> => {
    const documentReference = firestore()
      .collection('goals/' + config.GOAL_ID + '/logs')
      .doc();

    try {
      await firestore()
        .collection('goals/' + config.GOAL_ID + '/logs')
        .doc(documentReference.id)
        .set({
          amount,
          date: new Date(),
        });

      toggleLogModal();
    } catch (error) {
      console.error(error);
    }
  };

  const navigateList = (index: number): void => {
    flatListRef.current?.scrollToIndex({
      animated: true,
      index,
    });
  };

  const colorFill = (index: number): string =>
    index === screenIndex ? colors.lightBlue['500'] : '#ffffff';

  return (
    <AnimatedCenter h='120px' style={navigationStyle}>
      <AnimatedHStack
        zIndex={10}
        w='70%'
        h='60px'
        p={8}
        borderBottomLeftRadius={'24px'}
        borderBottomRightRadius={'24px'}
        justifyContent='space-between'
        alignItems='center'
        bgColor='dark.50'
        style={borderStyle}
      >
        <Pressable
          w='24px'
          _pressed={{ opacity: 0.7 }}
          onPress={() => navigateList(0)}
        >
          <HomeIcon fill={colorFill(0)} />
        </Pressable>
        <Pressable
          onPress={toggleLogModal}
          display='flex'
          justifyContent={'center'}
          alignItems='center'
          w='64px'
          h='64px'
          borderRadius={'32px'}
          bgColor='lightBlue.500'
          position={'absolute'}
          left='50%'
          bottom='2'
          borderWidth={8}
          borderColor='dark.50'
          _pressed={{ bgColor: 'lightBlue.600' }}
        >
          <PlusIcon fill='#ffffff' />
        </Pressable>
        <Pressable
          w='24px'
          _pressed={{ opacity: 0.7 }}
          onPress={() => navigateList(1)}
        >
          <CalendarIcon fill={colorFill(1)} />
        </Pressable>
      </AnimatedHStack>

      <AnimatedHStack
        zIndex={5}
        position='absolute'
        w='70%'
        h='80px'
        p={4}
        borderTopRightRadius='24px'
        borderTopLeftRadius='24px'
        justifyContent={'space-between'}
        alignItems='center'
        bgColor={'dark.50'}
        style={modalStyle}
      >
        <Flex
          alignItems='center'
          justifyContent={'space-between'}
          flexDirection='row'
          w='60%'
        >
          <Pressable
            w='24px'
            h='24px'
            _pressed={{ opacity: 0.7 }}
            onPress={decrease}
          >
            <MinusIcon fill='#ffffff' />
          </Pressable>
          <Input
            value={amount}
            onChangeText={onChange}
            keyboardType='numeric'
            w='64px'
            variant={'unstyled'}
            color='white'
            fontSize={'2xl'}
            fontWeight='bold'
            textAlign={'center'}
          />

          <Pressable
            w='24px'
            h='24px'
            _pressed={{ opacity: 0.7 }}
            onPress={increase}
          >
            <PlusIcon fill='#ffffff' />
          </Pressable>
        </Flex>
        <Button
          onPress={addTimeLog}
          w={'30%'}
          h='90%'
          variant='ghost'
          bgColor='white'
          borderRadius={10}
          _text={{ color: 'text.800', fontSize: 18 }}
        >
          Add
        </Button>
      </AnimatedHStack>
    </AnimatedCenter>
  );
};

export default Navigation;
