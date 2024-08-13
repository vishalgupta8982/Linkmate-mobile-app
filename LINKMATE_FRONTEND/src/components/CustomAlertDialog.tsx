import React from 'react';
import { Modal, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useCustomTheme } from '../config/Theme';
import { width } from '../config/Dimension';
import { TouchableWithoutFeedback } from 'react-native';

const CustomModalDialog = ({
	isOpen,
	onClose,
	title,
	message,
	onConfirm,
	ButtonText,
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
						<TouchableWithoutFeedback onPress={onClose}>
							<Text style={[styles.buttonText, { color: '#ff0000' }]}>
								Cancel
							</Text>
						</TouchableWithoutFeedback>
						<TouchableWithoutFeedback onPress={onConfirm}>
							<Text style={[styles.buttonText, { color: colors.PRIMARY }]}>
								{ButtonText}
							</Text>
						</TouchableWithoutFeedback>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const getStyles = (colors) =>
	StyleSheet.create({
		overlay: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
		},
		mainCont: {
			width: width - 60,
			borderRadius: 10,
			backgroundColor: colors.LIGHT_MAIN_BACKGROUND,
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
			color: colors.LIGHT_TEXT,
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
		},
	});

export default CustomModalDialog;
