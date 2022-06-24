import Configs,{ToFormData} from "../config/Configs";

export const UpdateProfile = async (requestObj) => {
	let url = Configs.BASE_URL + "user/Customer/update_profile";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	
	return await response.json();
};


export const SetDeviceToken = async (requestObj) => {
	let url = Configs.BASE_URL + "user/Customer/set_device_token";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const UnSetDeviceToken = async (requestObj) => {
	let url = Configs.BASE_URL + "user/Customer/unset_device_token";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};
