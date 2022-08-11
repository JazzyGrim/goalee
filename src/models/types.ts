import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface IContext {
  goal: IGoal | undefined;
  logs: ITimeLog[] | undefined;
  todaysLogs: ITimeLog[] | undefined;
  todaysProgress: number;
}

export interface IGoal {
  name: string;
  description: string;
  emoji: string;
  deadline: FirebaseFirestoreTypes.Timestamp;
  dayGoal: number;
  startedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface ITimeLog {
  amount: string;
  date: FirebaseFirestoreTypes.Timestamp;
}

export type ScreenIndex = 0 | 1;
