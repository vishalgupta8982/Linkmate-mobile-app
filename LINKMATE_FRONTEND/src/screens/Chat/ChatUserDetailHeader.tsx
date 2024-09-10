import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import {
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import { ChatUserDetailHeaderProps, userDetails } from '../../types/basicTypes';
import { NavigationProp } from '@react-navigation/native';
 
export default function ChatUserDetailHeader({
	data,
	navigation,
}: ChatUserDetailHeaderProps) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	return (
		<View>
			<TouchableOpacity
				activeOpacity={0.4}
				onPress={() =>
					navigation.navigate('viewUserProfile', {
						username: data.username,
					})
				}
			>
				<View style={styles.profileView}>
					<Image
						style={styles.chatProfile}
						source={{ uri: data.profilePicture }}
					/>
					<Text style={globalStyleSheet.smallHead}>
						{data.firstName + ' ' + data.lastName}
					</Text>
					<Text
						style={[
							globalStyleSheet.smallFontDescription,
							{ textAlign: 'center', lineHeight: 20 },
						]}
					>
						{data.headline}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}
const getStyles = (colors:any) =>
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
