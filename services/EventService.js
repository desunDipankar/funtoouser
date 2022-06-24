import Configs,{ToFormData} from "../config/Configs";

export const GetEventsByGroup = async (requestObj) => {
	let url = Configs.BASE_URL + "user/event/get_events_by_group";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);

	return await response.json();
};

export const GetEventsBills = async (requestObj) => {
	let url = Configs.BASE_URL + "user/event/get_events_bills";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const GetEventDetail = async (id) => {
	let url = Configs.BASE_URL + "admin/event/get_event_detail?id="+id;
	let requestOptions = {
		method: "GET",
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const DownloadBill = async (id) => {
	let url = Configs.BASE_URL + "download/print_bill?id="+id;
	let response = await fetch(url);
	return await response.json();

};
