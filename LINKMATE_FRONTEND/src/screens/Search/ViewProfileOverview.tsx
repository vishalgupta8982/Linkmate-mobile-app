import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Modal,
	TextInput,
	Button,
} from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import Loader from '../../components/Loader';
import Toast from 'react-native-simple-toast';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { addSkill, deleteSkill } from '../../api/apis';
import CustomAlertDialog from '../../components/CustomAlertDialog';
import AppTextField from '../../components/AppTextField';
import { AppButton } from '../../components/AppButton';

export default function ViewProfileOverview({ navigation,userData }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const dispatch = useDispatch();
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);


 
	return (
		<View style={styles.mainCont}>
			{loader && <Loader />}
			{userData?.skills?.length > 0 && (
				<View style={styles.Cont}>
					<Text style={globalStyleSheet.smallHead}>Skills</Text>
					<View style={styles.adjustSize}>
						{userData?.skills &&
							userData.skills.map((item, index) => (
									<View style={styles.skill}>
										<Text style={styles.chip}>{item}</Text>
									</View>
							))}
					</View>
				</View>
			)}
			{userData?.about?.length > 0 && (
				<View style={styles.Cont}>
					<View style={styles.edit}>
						<Text style={globalStyleSheet.smallHead}>About</Text>
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
			color: colors.WHITE,
			fontSize: responsiveFontSize(1.8),
			fontFamily: fonts.Inter_Medium,
		},
		skill: {
			padding: 4,
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
		modalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		modalContainer: {
			backgroundColor: colors.MAIN_BACKGROUND,
			borderRadius: 10,
			padding: 20,
			elevation: 5,
			width: '100%',
		},
		modalTitle: {
			fontSize: responsiveFontSize(2.5),
			fontFamily: fonts.Inter_Medium,
			color: colors.TEXT,
		},
		input: {
			borderWidth: 1,
			borderColor: colors.BORDER,
			borderRadius: 5,
			padding: 10,
			marginBottom: 20,
			color: colors.TEXT,
		},
		addSkill: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: 10,
		},
	});
