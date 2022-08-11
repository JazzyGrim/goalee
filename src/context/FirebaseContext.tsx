import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import config from '../../config';
import { IContext, IGoal, ITimeLog } from '../models/types';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

const defaultContext: IContext = {
  goal: undefined,
  logs: undefined,
  todaysLogs: undefined,
  todaysProgress: 0,
};

interface Props {
  children?: ReactNode;
}

const FirebaseContext = createContext<IContext>(defaultContext);

export const FirebaseProvider: React.FC<Props> = ({ children }) => {
  const [goal, setGoal] = useState<IGoal>();
  const [logs, setLogs] = useState<ITimeLog[]>();

  const todaysLogs = useMemo(() => {
    return logs
      ? logs.filter(
        log => log.date.toDate().toDateString() === new Date().toDateString(),
      )
      : undefined;
  }, [logs]);

  const todaysProgress = useMemo(() => {
    return todaysLogs
      ? todaysLogs.reduce((sum, log) => sum + parseInt(log.amount), 0)
      : 0;
  }, [logs]);

  const saveGoal = (data: IGoal) => {
    if (!data) return;

    setGoal(data);
  };

  const saveLogs = (
    data: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => {
    const newLogs: ITimeLog[] = [];

    data.forEach(doc => {
      newLogs.push({
        amount: doc.data().amount,
        date: doc.data().date,
      });
    });
    setLogs(newLogs);
  };

  useEffect(() => {
    firestore()
      .collection('goals')
      .doc(config.GOAL_ID)
      .onSnapshot(doc => saveGoal(doc.data() as IGoal));

    firestore()
      .collection('goals/' + config.GOAL_ID + '/logs')
      .orderBy('date', 'asc')
      .onSnapshot(saveLogs);

    (async () => {
      try {
        const goalDoc = await firestore()
          .collection('goals')
          .doc(config.GOAL_ID)
          .get();
        saveGoal(goalDoc.data() as IGoal);

        const logDocs = await firestore()
          .collection('goals/' + config.GOAL_ID + '/logs')
          .orderBy('date', 'asc')
          .get();

        saveLogs(logDocs);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{ goal, logs, todaysLogs, todaysProgress }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const { goal, logs, todaysLogs, todaysProgress } =
    useContext(FirebaseContext);

  return { goal, logs, todaysLogs, todaysProgress };
};
