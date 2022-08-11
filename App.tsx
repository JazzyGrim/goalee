import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { FirebaseProvider } from './src/context/FirebaseContext';
import HomeScreen from './src/screens/Home';

const App = () => {
  return (
    <NativeBaseProvider>
      <FirebaseProvider>
        <HomeScreen />
      </FirebaseProvider>
    </NativeBaseProvider>
  );
};

export default App;
