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
export default function MyConnections({ navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [myConnection, setMyConnnection] = useState([]);
	const [loader, setLoader] = useState(false);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [removeConnectionId, setRemoveConnectionId] = useState();
	const fetchConnection = async () => {
		try {
			const response = await getMyConnections();
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
		setLoader(true);
		setAlertDialogVisible(false);
		try {
			const response = await removeConnection(removeConnectionId);
			if (response) {
				Toast.show('Connection removed', Toast.SHORT);
				fetchConnection();
			}
		} catch (err) {}
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
				<Feather name="send" size={20} color={colors.TEXT} />
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
