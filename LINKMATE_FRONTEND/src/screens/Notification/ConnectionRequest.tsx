import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
} from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import StackHeader from '../../components/StackHeader';
import {
	acceptConnectionRequest,
	getAllConnectionRequest,
	rejectConnectionRequest,
} from '../../api/apis';
import { useState, useEffect } from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { globalStyles } from '../../StylesSheet';
import WebSocketService from '../../utils/WebSocketService';
import { selectToken } from '../../redux/slices/authSlice';
import { RootState, store } from '../../redux/store';
import { socketUrl } from '../../api/instance';
import { useDispatch, useSelector } from 'react-redux';
import {  addConnectionRequests, clearConnectionRequests } from '../../redux/slices/ConnectionRequestSlice';
export default function ConnectionRequest({ navigation }) {
	const request = useSelector(
		(state: RootState) => state.connectionRqst.connectionRequests
	);
	useEffect(()=>{
		setConnectionRequest(request)
	},[request])
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const token = selectToken(store.getState());
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [connectionRequest, setConnectionRequest] = useState(request);

	const fetchConnectionRequest = async () => {
		try {
			const response = await getAllConnectionRequest();
			if(response)
				 dispatch(response.length>0?addConnectionRequests(response):clearConnectionRequests());
		} catch (err) {
			console.error(err);
		}
	};

	const handleAcceptRequest = async (senderId: string) => {
		console.log(senderId);
		try {
			const response = await acceptConnectionRequest(senderId);
			if (response) {
				Toast.show('Request accepted', Toast.SHORT);
				fetchConnectionRequest();
			}
		} catch (err) {
			console.error(err);
		}
	};
	const handleRejectRequest = async (senderId: string) => {
		console.log(senderId);
		try {
			const response = await rejectConnectionRequest(senderId);
			if (response) {
				Toast.show('Request cancelled', Toast.SHORT);
				fetchConnectionRequest();
			}
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		fetchConnectionRequest();
	}, []);

	return (
		<ScrollView style={styles.mainCont}>
			{connectionRequest &&
				connectionRequest.map((item) => (
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
								onPress={() => handleRejectRequest(item.userId)}
							>
								<AntDesign
									name="closecircleo"
									size={20}
									color={colors.RED}
									marginRight={5}
									padding={5}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.4}
								onPress={() => handleAcceptRequest(item.userId)}
							>
								<AntDesign
									name="checkcircleo"
									size={20}
									padding={5}
									color={colors.PRIMARY}
									marginRight={5}
								/>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				))}
		</ScrollView>
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
		},
		img: {
			width: 60,
			height: 60,
			borderRadius: 30,
			marginRight: 10,
		},
		nameCont: {
			width: responsiveWidth(48),
			marginRight: 'auto',
		},
	});
