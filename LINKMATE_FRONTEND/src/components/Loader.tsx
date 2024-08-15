import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useCustomTheme } from '../config/Theme';
import { responsiveHeight, responsiveScreenHeight, responsiveWidth } from 'react-native-responsive-dimensions';


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
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		height:responsiveHeight(100),
		width:responsiveWidth(100),
		justifyContent:'center'
	},
});

export default Loader;
