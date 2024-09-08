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
import chatReducer from './slices/ChatSlice';
import countReducer from './slices/CountNotificationMessage';

// Persist config
const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['theme', 'auth', 'userDetails'],
};

// Combine reducers
const appReducer = combineReducers({
	theme: themeReducer,
	auth: authReducer,
	userDetails: userDetailsReducer,
	connectionRqst: connectionRequestReducer,
	posts: postsReducer,
	chats: chatReducer,
	count: countReducer,
});

// Root reducer that resets state on logout
const rootReducer = (state, action) => {
	if (action.type === 'RESET') {
		state = undefined;
	}
	return appReducer(state, action);
};

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
