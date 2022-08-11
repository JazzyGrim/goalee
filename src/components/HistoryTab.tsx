import { useTheme, Circle, Text, VStack, Center, Box } from 'native-base';
import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { useFirebase } from '../context/FirebaseContext';
import { ITimeLog } from '../models/types';
import Lottie from 'lottie-react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { formatLocalTime, isToday } from '../utils/date';

const { width } = Dimensions.get('window');

const HistoryTab: React.FC = () => {
  const { goal, logs } = useFirebase();
  const { colors } = useTheme();

  const missColor = colors.rose['600'];
  const partialHitColor = colors.amber['400'];
  const hitColor = colors.success['400'];

  const timePerDay = useMemo(() => {
    if (!logs) return [];

    return logs.reduce((times, log) => {
      const item = times.find(
        l =>
          l.date.toDate().toDateString() === log.date.toDate().toDateString(),
      );
      if (item === undefined) {
        times.push(log);
        return times;
      }

      item.amount = (parseInt(item.amount) + parseInt(log.amount)).toString();

      return times;
    }, [] as ITimeLog[]);
  }, [logs]);

  const timeLog = useMemo(() => {
    const tm: { [key: string]: string } = {};
    timePerDay.forEach(t => {
      tm[formatLocalTime(t.date.toDate())] = t.amount;
    });
    return tm;
  }, [timePerDay]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    if (!goal) return streak;

    const reversed = timePerDay.slice().reverse();

    for (let i = 0; i < reversed.length; i++) {
      const el: ITimeLog = reversed[i];
      if (
        new Date().setHours(0, 0, 0, 0) -
          el.date.toDate().setHours(0, 0, 0, 0) ===
          i * 86400000 &&
        parseInt(el.amount) >= goal.dayGoal
      )
        streak++;
      else break;
    }
    return streak;
  }, [timePerDay]);

  const renderStreak = () => {
    return currentStreak > 0 ? (
      <VStack w={width} mt={4} alignItems='center' justifyContent='center'>
        <Lottie
          source={require('../assets/animations/fire.json')}
          autoPlay
          autoSize
          loop
          resizeMode='cover'
          style={{ width: 100, height: 100 }}
        />
        <Text fontSize={'xl'} textAlign='center'>
          Great job!{'\n'}You're on a{' '}
          <Text bold color='rose.400'>
            {currentStreak} day
          </Text>{' '}
          streak!
        </Text>
      </VStack>
    ) : (
      <VStack w={width} mt={4} alignItems='center' justifyContent='center'>
        <Lottie
          source={require('../assets/animations/sad.json')}
          autoPlay
          autoSize
          loop
          resizeMode='cover'
          style={{ width: 100, height: 100 }}
        />
        <Text fontSize={'xl'} textAlign='center'>
          Goalee is sad...{'\n'}You're not working on your goals!
        </Text>
      </VStack>
    );
  };

  const calculateColor = (date: DateData) => {
    const color = colors.dark['400'];
    if (!date || !goal) return color;
    const dateObject = new Date(date.timestamp);

    if (
      dateObject.valueOf() > new Date().valueOf() ||
      dateObject.valueOf() < goal.startedAt.toDate().valueOf()
    )
      return color;

    const workAmount = timeLog[date.dateString];
    if (parseInt(workAmount) >= goal?.dayGoal) return hitColor;
    else if (parseInt(workAmount) > 0) return partialHitColor;
    else return missColor;
  };

  return (
    <Center w={width}>
      <Box w={width * 0.8} borderRadius={20} p={3} bgColor={colors.dark['50']}>
        <Calendar
          firstDay={1}
          hideDayNames={false}
          style={{
            width: '100%',
          }}
          dayComponent={({ date }) => {
            if (date && isToday(new Date(date.timestamp)))
              return (
                <Circle
                  w={4}
                  h={4}
                  borderWidth={1}
                  borderColor={colors.dark['800']}
                >
                  <Circle w={1} h={1} bgColor={colors.dark['800']}></Circle>
                </Circle>
              );

            return (
              <Circle
                w={2}
                h={2}
                my={1}
                bgColor={calculateColor(date as DateData)}
              ></Circle>
            );
          }}
          theme={{
            calendarBackground: colors.dark['50'],
            arrowColor: '#ffffff',
            monthTextColor: '#ffffff',
            // @ts-expect-error
            'stylesheet.calendar.header': {
              week: {
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            },
          }}
        />
      </Box>
      <Box w={width} h='100px'>
        {renderStreak()}
      </Box>
    </Center>
  );
};

export default HistoryTab;
