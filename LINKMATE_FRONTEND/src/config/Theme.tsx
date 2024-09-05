import { useSelector } from 'react-redux';
interface ThemeColors {
	PRIMARY: string;
	LIGHT_PRIMARY: string;
	LIGHTER_PRIMARY: string;
	SKELETON: string;
	APP_PRIMARY: string;
	APP_SECONDARY: string;
	APP_PRIMARY_LIGHT: string;
	LIGHT_MAIN_BACKGROUND: string;
	BACKGROUND: string;
	DARK_BACKGROUND: string;
	MAIN_BACKGROUND: string;
	DARK_PRIMARY: string;
	TEXT: string;
	WHITE: string;
	SECONDARY: string;
	RED: string;
}
interface Theme {
	dark: boolean;
	colors: ThemeColors;
}

export const lightTheme: Theme = {
	dark: false,
	colors: {
		PRIMARY: '#1abaff',
		LIGHT_PRIMARY: '#80D9FF',
		LIGHTER_PRIMARY: '#bcebff',
		SECONDARY: '#00354d',
		SKELETON: '#e5f7ff',
		APP_PRIMARY: '#41392F',
		APP_SECONDARY: '#F7F1E7',
		APP_PRIMARY_LIGHT: '#7C7C7C',
		LIGHT_MAIN_BACKGROUND: '#e2e2e2',
		BACKGROUND: '#FFF',
		DARK_BACKGROUND: '#e7e7e7',
		MAIN_BACKGROUND: '#f6f6f6',
		TEXT: '#1B1212',
		DARK_PRIMARY: '#00121a',
		WHITE: '#FFF',
		RED: '#ff474c',
	},
};
export const darkTheme: Theme = {
	dark: true,
	colors: {
		PRIMARY: '#1abaff',
		LIGHT_PRIMARY: '#80D9FF',
		LIGHTER_PRIMARY: '#bcebff',
		SECONDARY: '#00354d',
		SKELETON: '#1abaff',
		LIGHT_MAIN_BACKGROUND: '#003247',
		APP_PRIMARY: '#A7A3A0',
		APP_SECONDARY: '#F7F1E7',
		APP_PRIMARY_LIGHT: '#bfbfbf',
		BACKGROUND: '#001924',
		DARK_BACKGROUND: '#003247',
		MAIN_BACKGROUND: '#000a0e',
		TEXT: '#E2DFD2',
		DARK_PRIMARY: '#00121a',
		WHITE: '#FFF',
		RED: '#ff474c',
	},
};

export const useCustomTheme = (): Theme => {
	const theme = useSelector((state) => state.theme.theme);
	return theme === 'dark' ? darkTheme : lightTheme;
};
