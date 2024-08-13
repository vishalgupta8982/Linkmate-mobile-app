import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import moment from 'moment';
import { deleteExperience } from '../../api/apis';
import Toast from 'react-native-simple-toast';
export default function Experience({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
  const handleDltExp=async(id:string)=>{
    try{
      const response=await deleteExperience(id);
      console.log(response)
      if(response){
        Toast.show('Deleted successfully', Toast.SHORT);
      }
    }catch(err){
      console.error(err)
    }
  }
	return (
		<View style={styles.mainCont}>
			{userData?.experiences?.length > 0 && (
				<View>
					<View style={styles.cont}>
						<Text style={globalStyleSheet.smallHead}>Add Experience</Text>
						<View style={styles.plus}>
							<AntDesign name="plus" size={16} color={colors.TEXT} />
						</View>
					</View>
					{userData?.experiences.map((item) => (
						<View style={styles.experienceCard}>
							<View style={styles.position}>
								<Text style={globalStyleSheet.smallerHead}>
									{item.position}
								</Text>
								<View style={styles.icon}>
									<Feather
										name="edit-2"
										marginRight={10}
										size={16}
										padding={5}
										color={colors.PRIMARY}
									/>
									<TouchableWithoutFeedback
										onPress={() => handleDltExp(item.experienceId)}
									>
										<MaterialCommunityIcon
											name="delete-outline"
											marginRight={10}
											size={20}
											padding={5}
											color={colors.RED}
										/>
									</TouchableWithoutFeedback>
								</View>
							</View>
							<Text style={globalStyleSheet.smallestHead}>{item.company}</Text>
							<Text style={globalStyleSheet.smallestHead}>
								{moment(item.startDate, 'YYYY-MM-DD').format('MMM YYYY')} -{' '}
								{moment(item.endDate, 'YYYY-MM-DD').format('MMM YYYY')}
								{' • '}
								{moment(item.endDate, 'YYYY-MM-DD').diff(
									moment(item.startDate, 'YYYY-MM-DD'),
									'months'
								)}{' '}
								months
							</Text>
							<Text style={globalStyleSheet.description}>
								{item.description}
							</Text>
						</View>
					))}
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
		plus: {
			width: 30,
			height: 30,
			backgroundColor: colors.PRIMARY,
			borderRadius: 15,
			alignItems: 'center',
			justifyContent: 'center',
		},
		edit: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		cont: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			backgroundColor: colors.BACKGROUND,
			paddingHorizontal: 15,
			paddingVertical: 10,
			marginBottom: 7,
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
