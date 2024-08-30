import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useCustomTheme } from '../config/Theme';
import {
	responsiveHeight,
	responsiveScreenHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';

const Loader = () => {
	const theme = useCustomTheme();
	return (
		<View style={styles.loaderContainer}>
			<ActivityIndicator size={32} color={theme.colors.PRIMARY} />
		</View>
	);
};

const styles = StyleSheet.create({
	loaderContainer: {
		flex: 1,
		position: 'absolute',
		zIndex: 1000,
		justifyContent: 'center',
		left: '45%',
		top: '48%',
	},
});

export default Loader;
