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
import Toast from 'react-native-simple-toast';
import DocumentPicker from 'react-native-document-picker';
import { createPost } from '../../api/apis';
import Loader from '../../components/Loader';
export default function CreatePost({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [content, setContent] = useState('');
	const [filePath, setFilePath] = useState(null);
	const [fileType, setFileType] = useState(null);
  const [loading,setLoading]=useState(false)
	const chooseImage = () => {
		ImagePicker.openPicker({
			cropping: false,
			compressImageMaxWidth: 800,
			compressImageMaxHeight: 800,
		})
			.then((image) => {
				setFileType("image");
				setFilePath(image);
			})
			.catch((e) => console.log(e));
	};
	const chooseDocument = async () => {
		try {
			const response = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles],
			});
			setFileType('document');
			setFilePath(response);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				console.log('User cancelled the picker');
			} else {
				throw err;
			}
		}
	};
  const handlePost=async()=>{
    setLoading(true)
    if(content.length<1){
      Toast.show('Write something to post or choose file', Toast.SHORT);
    }
    try{
      const response =await createPost(filePath,content,fileType);
       if(response){
		setContent('')
		setFilePath(null)
		setFileType(null)
        navigation.navigate("Home")
        Toast.show('Post uploaded successfully', Toast.SHORT);
       }
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  }
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
				<AppButton onPress={handlePost} width={25} title="Post" />
			</View>
			{loading && <Loader />}
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
			{filePath && fileType == 'image' && (
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
			{filePath && fileType == 'document' && (
				<View>
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() => setFilePath(null)}
						style={styles.close2}
					>
						<AntDesign name="close" color={colors.TEXT} size={18} />
					</TouchableOpacity>
					<View style={styles.pdf}>
						<AntDesign
							name="pdffile1"
							color={colors.TEXT}
							size={18}
							style={{ marginRight: 5 }}
						/>
						<Text numberOfLines={1} ellipsizeMode="tail">
							{filePath[0]?.name}
						</Text>
					</View>
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
		close2: {
			position: 'absolute',
			left: '88%',
			marginTop: 20,
		},
		pdf: {
			borderWidth: 1,
			borderColor: 'red',
			padding: 10,
			paddingHorizontal: 10,
			flexDirection: 'row',
			marginTop: 20,
			width: '80%',
			margin: 20,
		},
	});
