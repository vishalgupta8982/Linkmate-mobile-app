import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useCustomTheme } from '../config/Theme';
import { width } from '../config/Dimension';
import { TouchableWithoutFeedback } from 'react-native';

const CustomAlertDialog = ({
	isOpen,
	onClose,
	title,
	message,
	onConfirm,
	ButtonText,
}: {
	isOpen:boolean;
	onClose:any;
	title:string;
	message:string;
	onConfirm:any;
	ButtonText:string;
}) => {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);

	return (
		<Modal
			visible={isOpen}
			transparent={true}
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.mainCont}>
					<View style={styles.header}>
						<Text style={styles.title}>{title}</Text>
					</View>
					<View style={styles.body}>
						<Text style={styles.message}>{message}</Text>
					</View>
					<View style={styles.footer}>
						<TouchableOpacity activeOpacity={0.4} onPress={onClose}>
							<Text style={[styles.buttonText, { color: '#ff0000' }]}>
								Cancel
							</Text>
						</TouchableOpacity>
						<TouchableOpacity activeOpacity={0.4} onPress={onConfirm}>
							<Text style={[styles.buttonText, { color: colors.PRIMARY }]}>
								{ButtonText}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const getStyles = (colors:any) =>
	StyleSheet.create({
		overlay: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
		},
		mainCont: {
			width: width - 60,
			borderRadius: 10,
			backgroundColor: colors.BACKGROUND,
			padding: 20,
		},
		header: {
			marginBottom: 10,
		},
		title: {
			fontSize: 18,
			color: colors.TEXT,
			fontWeight: '500',
		},
		body: {
			marginBottom: 20,
		},
		message: {
			fontSize: 14,
			color: colors.TEXT,
		},
		footer: {
			flexDirection: 'row',
			justifyContent: 'flex-end',
			marginTop: 10,
		},
		buttonText: {
			fontSize: 16,
			fontWeight: '500',
			marginHorizontal: 10,
			padding: 2,
		},
	});

export default CustomAlertDialog;
