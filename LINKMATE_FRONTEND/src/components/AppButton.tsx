import React from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { fonts } from '../config/Fonts';
import { useCustomTheme } from '../config/Theme';
import { responsiveWidth } from 'react-native-responsive-dimensions';


export const AppButton = ({
	onPress,
	title,
	loading,
	disabled,
	icon,
}: {
	onPress: () => void;
	title: string;
	loading: boolean;
	disabled: boolean;
	icon?: any; 
}) => {
    const theme = useCustomTheme();
		const { colors } = theme;
		const styles = getStyles(colors);
	return (
		<TouchableOpacity
			onPress={onPress}
			style={styles.appButtonContainer}
		>
			{icon && <View style={styles.icon}>{icon}</View>}
			<Text style={styles.appButtonText}>{title}</Text>
			{loading && (
				<ActivityIndicator  size="large" color="white" />
			)}
		</TouchableOpacity>
	);
};
const getStyles = (colors) =>StyleSheet.create({
	appButtonContainer: {
		backgroundColor: colors.PRIMARY,
		borderRadius: 5,
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginHorizontal: 5,
        width:responsiveWidth(90),
        alignSelf:'center',
        marginTop:10
	},
	appButtonText: {
		fontSize: 16,
		color: colors.WHITE,
		fontFamily: fonts.Inter_Medium,
		alignSelf: 'center',
		textTransform: 'uppercase',
	},

	icon:{
		marginRight:5
	}
});
