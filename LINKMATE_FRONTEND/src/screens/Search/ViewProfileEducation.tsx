import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
	ScrollView,
} from 'react-native';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import moment from 'moment';
import Loader from '../../components/Loader';
export default function ViewProfileEducation({ navigation, userData }) {
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);

	return (
		<View style={styles.mainCont}>
			{loader && <Loader />}
			{userData?.educations.map((item) => (
				<View style={styles.experienceCard} key={item.educationId}>
					<View style={styles.position}>
						<Text style={globalStyleSheet.smallerHead}>{item.institution}</Text>
					</View>
					<Text style={globalStyleSheet.smallestHead}>
						{item.degree},{item.field}
					</Text>
					<Text style={globalStyleSheet.smallestHead}>
						{moment(item.startDate, 'YYYY-MM-DD').format('MMM YYYY')} -{' '}
						{moment(item.endDate, 'YYYY-MM-DD').format('MMM YYYY')}
					</Text>
					<Text style={globalStyleSheet.description}>{item.description}</Text>
				</View>
			))}
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		experienceCard: {
			backgroundColor: colors.BACKGROUND,
			paddingHorizontal: 15,
			paddingVertical: 10,
			marginBottom: 7,
		},
		position: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		icon: {
			flexDirection: 'row',
			alignItems: 'center',
		},
	});
