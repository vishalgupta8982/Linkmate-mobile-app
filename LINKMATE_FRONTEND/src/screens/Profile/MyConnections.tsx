import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import React from 'react';
import Toast from 'react-native-simple-toast';
import { useCustomTheme } from '../../config/Theme';
import { getMyConnections, removeConnection } from '../../api/apis';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import StackHeader from '../../components/StackHeader';
import { globalStyles } from '../../StylesSheet';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import CustomAlertDialog from '../../components/CustomAlertDialog';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {  removeConnections } from '../../redux/slices/UserDetailsSlice';
export default function MyConnections({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const dispatch=useDispatch()
	const route=useRoute()
	const {userId}=route.params
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [myConnection, setMyConnnection] = useState([]);
	const [loader, setLoader] = useState(false);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [removeConnectionId, setRemoveConnectionId] = useState('');
	const fetchConnection = async () => {
		try {
			const response = await getMyConnections(userId);
			setMyConnnection(response);
		} catch (err) {
			console.error(err);
		} finally {
			setLoader(false);
		}
	};
	useEffect(() => {
		setLoader(true);
		fetchConnection();
	}, []);
	const handleRemoveConnection = async () => {
		setAlertDialogVisible(false);
		const previousConnections = [...myConnection];
		const updatedConnections = myConnection.filter(
			(conn) => conn.userId !== removeConnectionId
		);
		setMyConnnection(updatedConnections);
		try {
			const response = await removeConnection(removeConnectionId);
			if(response){
				dispatch(removeConnections({userId:removeConnectionId}))
			}
		} catch (err) {
			setMyConnnection(previousConnections);
			Toast.show('Something went wrong', Toast.SHORT);
		}
	};
	const renderItem = ({ item }) => (
		<TouchableOpacity
			activeOpacity={0.4}
			onPress={() =>
				navigation.navigate('viewUserProfile', {
					username: item.username,
				})
			}
		>
			<View style={styles.list}>
				<Image source={{ uri: item.profilePicture }} style={styles.img} />
				<View style={styles.nameCont}>
					<Text style={globalStyleSheet.smallerHead}>
						{item.firstName} {item.lastName}
					</Text>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={globalStyleSheet.description}
					>
						{item.headline}
					</Text>
				</View>
				{userData.userId == userId && (
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() => {
							setRemoveConnectionId(item.userId);
							setAlertDialogVisible(true);
						}}
					>
						<MaterialCommunityIcon
							name="dots-vertical"
							size={24}
							color={colors.TEXT}
							marginRight={10}
						/>
					</TouchableOpacity>
				)}
				<TouchableOpacity
					activeOpacity={0.4}
					onPress={() =>
						navigation.navigate('userChatDetail', { userDetails: item })
					}
				>
					<Feather name="send" size={20} color={colors.TEXT} />
				</TouchableOpacity>
			</View>
			<CustomAlertDialog
				isOpen={alertDialogVisible}
				onClose={() => {
					setRemoveConnectionId('');
					setAlertDialogVisible(false);
				}}
				title={'Remove connection?'}
				message={'Are you sure you want to remove connection?'}
				ButtonText={'Remove'}
				onConfirm={handleRemoveConnection}
			/>
		</TouchableOpacity>
	);
	return (
		<View style={styles.mainCont}>
			{loader && <Loader />}
			<StackHeader navigation={navigation} title="Connections" />
			<FlatList
				data={myConnection}
				renderItem={renderItem}
				keyExtractor={(item) => item.username}
			/>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		list: {
			backgroundColor: colors.BACKGROUND,
			paddingHorizontal: 15,
			paddingVertical: 5,
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 5,
			justifyContent: 'space-between',
		},
		img: {
			width: 60,
			height: 60,
			borderRadius: 30,
			marginRight: 10,
		},
		nameCont: {
			width: responsiveWidth(53),
			marginRight: 10,
		},
	});
