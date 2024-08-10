import React from 'react';
import { Toast } from 'native-base';
import CustomToast from './CustomToast';

const ShowToast = (message: String, success: Boolean) => {
	Toast.show({
		duration: 3000,
		placement: 'bottom',
		render: () => <CustomToast message={message} success={success} />,
	});
};

export default ShowToast;
