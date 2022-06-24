import Configs,{ToFormData, BuildSeachParams} from "../config/Configs";

export const PlaceOrder = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/order/create";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	
	return await response.json();
};

export const UpdateOrder = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/order/update";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	
	return await response.json();
};

export const GetSingleOrderEnquiry = async (queryParams) => {
    let url = `${Configs.BASE_URL}admin/order/get_order?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderEnquiry = async (queryParams) => {
    let url = `${Configs.BASE_URL}admin/order/get_orders?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}