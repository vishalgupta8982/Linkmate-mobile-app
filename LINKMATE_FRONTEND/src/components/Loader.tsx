import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useCustomTheme } from '../config/Theme';
import { responsiveScreenHeight } from 'react-native-responsive-dimensions';


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
        alignSelf:'center',
        position:'absolute',
        top:responsiveScreenHeight(40),
        zIndex:1000
	},
});

export default Loader;
