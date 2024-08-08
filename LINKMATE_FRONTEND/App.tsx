import { View, Text } from 'react-native';
import React, { FunctionComponent } from 'react';
import { NativeBaseProvider} from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStackNav from './src/navigation/MainStackNav';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
const App: FunctionComponent = () => {
	let persistor = persistStore(store);
	return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NativeBaseProvider>
          <SafeAreaProvider>
            <MainStackNav />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </PersistGate>
    </Provider>
  )
};

export default App;