// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import {
// 	persistStore,
// 	persistReducer,
// 	FLUSH,
// 	PAUSE,
// 	PERSIST,
// 	PURGE,
// 	REGISTER,
// 	REHYDRATE,
// } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import themeReducer from './slices/ThemeSlice';
// import authReducer from './slices/authSlice';
// import userDetailsReducer from './slices/UserDetailsSlice'
// const persistConfig = {
// 	key: 'root',
// 	storage: AsyncStorage,
// 	whitelist: ['theme','auth','userDetails'],
// };

// const reducers = combineReducers({
// 	theme: themeReducer,
// 	auth: authReducer,
// 	userDetails: userDetailsReducer,
// });

// const persistedReducer = persistReducer(persistConfig, reducers);

// export const store = configureStore({
// 	reducer: persistedReducer,
// 	devTools: process.env.NODE_ENV !== 'production',
// 	middleware: (getDefaultMiddleware) =>
// 		getDefaultMiddleware({
// 			serializableCheck: {
// 				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
// 			},
// 		}),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
	persistStore,
	persistReducer,
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeReducer from './slices/ThemeSlice';
import authReducer from './slices/authSlice';
import userDetailsReducer from './slices/UserDetailsSlice';
import connectionRequestReducer from './slices/ConnectionRequestSlice';
import postsReducer from './slices/PostSlice';
import chatReducer from './slices/ChatSlice'
// Persist config
const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['theme', 'auth', 'userDetails'],
};

// Combine reducers
const rootReducer = combineReducers({
	theme: themeReducer,
	auth: authReducer,
	userDetails: userDetailsReducer,
	connectionRqst: connectionRequestReducer,
	posts: postsReducer,
	chats:chatReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
