import Configs,{ToFormData} from "../config/Configs";

export const WishlistCategory = async (customer_id) => {
	let url = Configs.BASE_URL + `admin/wishlist/get_wishlists?customer_id=${customer_id}`;
	let response = await fetch(url);
	return await response.json();
};

export const WishlistCategoryCreate = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/create_wishlist";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	console.log(url, requestOptions)
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const WishlistCategoryUpdate = async (requestObj) => {
	let url = Configs.BASE_URL + "user/WishlistCategory/update";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const WishlistCategoryDelete = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/delete_wishlist";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};