import {
	View,
	Text,
	StyleSheet,
	Image,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { fonts } from '../../config/Fonts';
import { useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { RootState } from '../../redux/store';
import { height, width } from '../../config/Dimension';
import { AppButton } from '../../components/AppButton';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
export default function CreatePost({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [content, setContent] = useState('');
	const [filePath, setFilePath] = useState(null);
	const [fileType, setFileType] = useState(null);
	const chooseImage = () => {
		ImagePicker.openPicker({
			cropping: false,
			compressImageMaxWidth: 800,
			compressImageMaxHeight: 800,
		})
			.then((image) => {
				setFilePath(image);
				setFileType(image.mime.split('/')[0]);
			})
			.catch((e) => console.log(e));
	};
	const chooseDocument = async () => {
		try {
			const response = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles],
			});
			console.log(response);
			setFilePath(response);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				console.log('User cancelled the picker');
			} else {
				throw err;
			}
		}
	};
	return (
		<View style={styles.mainCont}>
			<View style={styles.header}>
				<View style={styles.headerFront}>
					<Image
						style={styles.img}
						source={{ uri: userData?.profilePicture }}
					/>
					<Text style={globalStyleSheet.smallHead}>Create post</Text>
				</View>
				<AppButton width={25} title="Post" />
			</View>
			<View style={styles.somethingBox}>
				<TextInput
					multiline={true}
					numberOfLines={16}
					selectionColor={colors.PRIMARY}
					style={styles.input}
					placeholderTextColor={colors.APP_PRIMARY_LIGHT}
					placeholder="Write something here..."
					onChangeText={setContent}
				/>
			</View>
			{filePath && fileType=="image" && (
				<View style={{ position: 'relative' }}>
					<Image source={{ uri: filePath?.path }} style={styles.selectImg} />
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() => setFilePath(null)}
						style={styles.close}
					>
						<AntDesign padding={3} name="close" color={colors.TEXT} size={18} />
					</TouchableOpacity>
				</View>
			)}
			{filePath && (
				<View style={{ marginTop: 20 }}>
					<Text>File Name: {filePath.name}</Text>
					<Text>Type: {filePath.type}</Text>
					<Text>URI: {filePath.uri}</Text>
				</View>
			)}
			<View style={styles.iconCont}>
				<TouchableOpacity activeOpacity={0.4} onPress={chooseImage}>
					<Feather
						name="image"
						marginRight={40}
						color={colors.PRIMARY}
						size={24}
					/>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.4} onPress={chooseDocument}>
					<MaterialCommunityIcon
						name="file-document-outline"
						color={colors.PRIMARY}
						size={24}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const getStyles = (colors: any) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		header: {
			backgroundColor: colors.BACKGROUND,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: 10,
		},
		headerFront: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		img: {
			height: 40,
			width: 40,
			borderRadius: 30,
			marginRight: 10,
		},
		somethingBox: {
			backgroundColor: colors.BACKGROUND,
			height: height / 4,
			width: width - 20,
			borderRadius: 20,
			alignSelf: 'center',
			marginTop: 10,
			padding: 10,
		},
		input: {
			fontSize: 16,
			color: colors.TEXT,
			fontFamily: fonts.Inter_Regular,
			alignSelf: 'flex-start',
			width: width - 50,
			textAlignVertical: 'top',
			lineHeight: 18,
		},
		iconCont: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 'auto',
			padding: 10,
			paddingHorizontal: 20,
			alignContent: 'flex-end',
			justifyContent: 'flex-end',
		},
		selectImg: {
			width: 150,
			height: 150,
			borderRadius: 10,
			margin: 10,
			marginTop: 40,
			objectFit: 'contain',
			backgroundColor: colors.BACKGORUND,
		},
		close: {
			position: 'absolute',
			left: '40%',
			marginTop: 20,
		},
	});
