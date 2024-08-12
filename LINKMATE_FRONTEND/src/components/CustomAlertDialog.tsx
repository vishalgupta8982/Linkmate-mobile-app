import React from 'react';
import { Button, AlertDialog, Center } from 'native-base';
import { fonts } from '../config/Fonts';
import { StyleSheet, Text } from 'react-native';
import { useCustomTheme } from '../config/Theme';
import { width } from '../config/Dimension';
 

const CustomAlertDialog = ({
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
	const cancelRef = React.useRef(null);
	return (
		<Center>
			<AlertDialog
				leastDestructiveRef={cancelRef}
				isOpen={isOpen}
				onClose={onClose}
			>
				<AlertDialog.Content style={styles.mainCont}>
					<AlertDialog.Header style={styles.bg} borderBottomWidth={0}>
						<Text style={styles.title}>{title}</Text>
					</AlertDialog.Header>
					<AlertDialog.Body style={styles.bg} borderBottomWidth={0}>
						<Text style={styles.message}>{message}</Text>
					</AlertDialog.Body>
					<AlertDialog.Footer style={styles.bg} borderTopWidth={0}>
						<Button.Group space={0}>
							<Button
								variant="unstyled"
								colorScheme="coolGray"
								onPress={onClose}
								ref={cancelRef}
								_text={{ fontSize: 'md', color: '#ff0000', fontWeight: '500' }}
							>
								Cancel
							</Button>
							<Button
								variant="unstyled"
								onPress={onConfirm}
								_text={{
									fontSize: 'md',
									color: colors.PRIMARY,
									fontWeight: '500',
								}}
							>
								{ButtonText}
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</Center>
	);
};

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			width: width - 60,
			borderRadius: 0,
		},
		title: {
			fontSize: 18,
			color: colors.TEXT,
			marginBottom: -10,
			fontWeight: '500',
		},
		message: {
			fontSize: 14,
			color: colors.LIGHT_TEXT,
			marginVertical: -15,
		},
		bg: {
			backgroundColor: colors.LIGHT_MAIN_BACKGROUND,
		},
	});

export default CustomAlertDialog;
