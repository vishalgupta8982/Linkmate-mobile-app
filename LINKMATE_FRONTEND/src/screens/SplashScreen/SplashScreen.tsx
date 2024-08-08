import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect} from 'react';
import { useCustomTheme } from '../../config/Theme';
import { fonts } from '../../config/Fonts';

export default function SplashScreen({ navigation }) {
	// const token = useSelector((state: RootState) => selectToken(state))
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	useEffect(() => {
		//   setTimeout(() => {
		//     // const initialRouteName = token ? "BottomNavigation" : "SignUpScreen"
		//     // navigation.replace(initialRouteName)
		//   }, 100000)
	}, []);
	return (
		<View style={[styles.mainCont, { backgroundColor: colors.BACKGROUND }]}>
			<View style={[styles.design]} />
			<View style={styles.contentCont}>
				<Text style={[styles.appName, { color: colors.TEXT }]}>
					Link
					<Text style={[styles.appName, { color: colors.PRIMARY }]}>mate</Text>
				</Text>
			</View>
			<View style={[styles.bottomDesign]} />
		</View>
	);
}
const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
		},
		design: {
			height: 200,
			width: 200,
			borderBottomRightRadius: 200,
			position: 'absolute',
			borderBottomWidth: 7,
			borderEndWidth: 7,
			backgroundColor: colors.PRIMARY,
			borderColor: colors.LIGHT_PRIMARY,
		},
		contentCont: {
			height: '95%',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
			alignContent: 'center',
		},
		appName: {
			fontSize: 30,
			letterSpacing: 4,
			fontFamily: fonts.Inter_Medium,
		},
		bottomDesign: {
			width: '50%',
			height: 5,
			alignSelf: 'center',
			backgroundColor: colors.PRIMARY,
		},
	});
