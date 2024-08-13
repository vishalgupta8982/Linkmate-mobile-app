import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import Loader from '../../components/Loader';
export default function Overview({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	return (
		<View style={styles.mainCont}>
			{userData?.skills?.length > 0 && (
				<View style={styles.Cont}>
					<Text style={globalStyleSheet.smallHead}>Skills</Text>
					<View style={styles.adjustSize}>
						{userData?.skills &&
							userData.skills.map((item, index) => (
								<View style={styles.skill}>
									<Text style={styles.chip} key={index}>
										{item}
									</Text>
								</View>
							))}
						<View style={styles.plus}>
							<AntDesign name="plus" size={16} color={colors.TEXT} />
						</View>
					</View>
				</View>
			)}
			{userData?.about?.length > 0 && (
				<View style={styles.Cont}>
					<View style={styles.edit}>
						<Text style={globalStyleSheet.smallHead}>About</Text>
						<TouchableOpacity
							onPress={() => navigation.navigate('EditProfile')}
						>
							<Feather
								name="edit-2"
								marginRight={10}
								size={20}
								color={colors.PRIMARY}
							/>
						</TouchableOpacity>
					</View>
					<Text style={globalStyleSheet.description}>{userData?.about}</Text>
				</View>
			)}
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		adjustSize: {
			alignSelf: 'flex-start',
			flexDirection: 'row',
			flexWrap: 'wrap',
			marginBottom: 15,
		},
		chip: {
			color: colors.TEXT,
			textTransform: 'capitalize',
			fontSize: responsiveFontSize(2),
			fontFamily: fonts.Inter_Medium,
		},
		skill: {
			padding: 6,
			paddingHorizontal: 20,
			backgroundColor: colors.PRIMARY,
			borderRadius: 30,
			marginRight: 10,
			marginTop: 10,
		},
		about: {
			fontSize: responsiveFontSize(1.8),
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
			textAlign: 'auto',
		},
		plus: {
			width: 30,
			height: 30,
			backgroundColor: colors.PRIMARY,
			borderRadius: 15,
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: 10,
		},
		edit: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		Cont: {
			backgroundColor: colors.BACKGROUND,
			paddingHorizontal: 15,
			paddingVertical: 10,
			marginBottom: 7,
		},
	});
