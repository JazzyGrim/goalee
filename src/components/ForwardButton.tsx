import { Pressable, useTheme } from 'native-base';
import React from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import ArrowRight from '../assets/icons/ArrowRight';

type Props = {
  onPress: (event: GestureResponderEvent) => void;
};

const ForwardButton: React.FC<Props> = ({ onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      w='64px'
      h='64px'
      mt={4}
      bgColor='#ffffff'
      borderRadius={'32px'}
      display='flex'
      justifyContent={'center'}
      alignItems='center'
      _pressed={{
        opacity: 0.7,
      }}
      onPress={onPress}
      style={styles.container}
    >
      <ArrowRight fill={colors.dark['50']} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
});

export default ForwardButton;
