export default {
	// BASE_URL: isProduction
	// 	? "https://ehostingguru.com/stage/entrance/api/"
	// 	: "http://192.168.1.116/entrance/api/",

	BASE_URL: "http://ehostingguru.com/stage/funtoo/api/",
	SUCCESS_TYPE: "success",
	FAILURE_TYPE: "failure",
	TIMER_VALUE: 60,
	PHONE_NUMBER_COUNTRY_CODE: "+91",
	GENDERS: ["Male", "Female", "Others"],
	STATUS_ONBOARDING: "onboarding",
	STATUS_APPROVED: "approved",
	STATUS_BANNED: "banned",
	UPLOAD_PATH: "https://ehostingguru.com/stage/funtoo/uploads/",
	IMAGE_URL: "https://ehostingguru.com/stage/funtoo/uploads/images/",
	SLIDER_URL: "https://ehostingguru.com/stage/funtoo/uploads/slider/",
	NEW_COLLECTION_URL: "https://ehostingguru.com/stage/funtoo/uploads/game/",
	CATEGORY_IMAGE_URL: "https://ehostingguru.com/stage/funtoo/uploads/category/",
	SUB_CATEGORY_IMAGE_URL: "https://ehostingguru.com/stage/funtoo/uploads/game/",
	GAME_GALLERY_IMAGE_URL: "https://ehostingguru.com/stage/funtoo/uploads/gameimage/",
	GAME_PARTS_URL: "https://ehostingguru.com/stage/funtoo/uploads/game_parts/",
	GOOGLE_PLACE_API_KEY: 'AIzaSyAHG9wJDJThFRp7aZdG9O2LMRvSRXjjois'
};


export const ToFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};

export function BuildSeachParams(obj) {
	let searchParams = new URLSearchParams(obj);

	return searchParams.toString();
}