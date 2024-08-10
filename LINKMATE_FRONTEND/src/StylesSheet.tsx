import { StyleSheet } from 'react-native';
import { fonts } from './config/Fonts';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';

export const globalStyles = (colors) =>
	StyleSheet.create({
		link: {
			letterSpacing: 4,
			fontFamily: fonts.Inter_Medium,
			color: colors.TEXT,
		},
		mate: {
			letterSpacing: 4,
			fontFamily: fonts.Inter_Medium,
			color: colors.PRIMARY,
		},
		head: {
			fontFamily: fonts.Inter_Medium,
			color: colors.TEXT,
            fontSize:responsiveFontSize(4),
            marginBottom:responsiveHeight(2)
		},
		 
	});
