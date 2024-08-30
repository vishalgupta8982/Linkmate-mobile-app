import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectChatUserDetailsById } from '../../redux/slices/ChatSlice';
import { globalStyles } from '../../StylesSheet';
import {
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';

export default function ChatUserDetailHeader({ userId, navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const recieverUserDetail = useSelector((state: RootState) =>
		selectChatUserDetailsById(state, userId)
	);
	return (
		<View>
			<TouchableOpacity
				activeOpacity={0.4}
				onPress={() =>
					navigation.navigate('viewUserProfile', {
						username: recieverUserDetail.username,
					})
				}
			>
				<View style={styles.profileView}>
					<Image
						style={styles.chatProfile}
						source={{ uri: recieverUserDetail.profilePicture }}
					/>
					<Text style={globalStyleSheet.smallHead}>
						{recieverUserDetail.firstName + ' ' + recieverUserDetail.lastName}
					</Text>
					<Text
						style={[
							globalStyleSheet.smallFontDescription,
							{ textAlign: 'center', lineHeight: 20 },
						]}
					>
						{recieverUserDetail.headline}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}
const getStyles = (colors) =>
	StyleSheet.create({
		profileView: {
			borderBottomWidth: 0.3,
			borderColor: colors.APP_PRIMARY_LIGHT,
			alignItems: 'center',
			paddingVertical: 5,
			marginTop: responsiveHeight(25),
			paddingHorizontal: responsiveWidth(20),
			marginBottom: 20,
		},
		chatProfile: {
			height: 100,
			width: 100,
			borderRadius: 50,
			borderWidth: 0.2,
			borderColor: colors.APP_PRIMARY_LIGHT,
			marginBottom: 5,
		},
	});
