import Configs,{ToFormData} from "../config/Configs";

export const Wishlist = async (id) => {
	let url = Configs.BASE_URL + `admin/wishlist/get_wishlist_items?id=${id}`
	let response = await fetch(url);
	return await response.json();
};

export const WishlistCreate = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/create_wishlist";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	console.log("WishlistCreate",url, requestOptions);
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const WishlistUpdate = async (requestObj) => {
	let url = Configs.BASE_URL + "user/Wishlist/update";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const WishlistDelete = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/remove_wishlist_item";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};