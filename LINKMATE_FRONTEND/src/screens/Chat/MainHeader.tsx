import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { selectChatUserDetailsById } from '../../redux/slices/ChatSlice';
import { useSelector } from 'react-redux';
import { globalStyles } from '../../StylesSheet';
import { RootState } from '../../redux/store';
export default function MainHeader({ navigation, userId }) {
    const theme = useCustomTheme();
    const { colors } = theme;
    const styles = getStyles(colors);
    const globalStyleSheet = globalStyles(colors);
    const recieverUserDetail = useSelector((state: RootState) =>
        selectChatUserDetailsById(state, userId)
    );
    return (
        <View>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.profile}
                    activeOpacity={0.4}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="arrowleft" size={22} color={colors.TEXT} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.profile}
                    activeOpacity={0.4}
                    onPress={() =>
                        navigation.navigate('viewUserProfile', {
                            username: recieverUserDetail.username,
                        })
                    }
                >
                    <Image
                        style={styles.img}
                        source={{ uri: recieverUserDetail.profilePicture }}
                    />
                    <View>
                        <Text style={globalStyleSheet.smallHead}>
                            {recieverUserDetail.firstName + ' ' + recieverUserDetail.lastName}
                        </Text>
                        <Text style={globalStyleSheet.smallestHead}>
                            @{recieverUserDetail.username}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const getStyles = (colors: any) =>
    StyleSheet.create({
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.BACKGROUND,
            padding: 10,
        },
        profile: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        img: {
            height: 50,
            width: 50,
            borderRadius: 25,
            borderWidth: 0.2,
            borderColor: colors.APP_PRIMARY,
            marginHorizontal: 10,
        },
    });
