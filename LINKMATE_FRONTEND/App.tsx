import { View, Text } from 'react-native';
import React, { FunctionComponent, useEffect } from 'react';
 import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStackNav from './src/navigation/MainStackNav';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import WebSocketService from './src/utils/WebSocketService';
import { socketUrl } from './src/api/instance';
import { selectToken } from './src/redux/slices/authSlice';
const App: FunctionComponent = () => {
	let persistor = persistStore(store);
  
	return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<SafeAreaProvider>
						<MainStackNav />
					</SafeAreaProvider>
				</PersistGate>
			</Provider>
	);
};

export default App;