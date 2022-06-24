import Configs,{ToFormData} from "../config/Configs";

export const CategoryTagList = async (cat_id,tag_for) => {
	let url = Configs.BASE_URL + `user/Category/get_tag_list?cat_id=${cat_id}&tag_for=${tag_for}`;
	//console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const GetCategorys = async () => {
	let url = Configs.BASE_URL + "user/Category/get_categorys";
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};


export const GetSubCategorys = async (parent_id) => {
	let url = Configs.BASE_URL + `user/Category/get_sub_categorys?parent_id=${parent_id}`;
	let response = await fetch(url);
	return await response.json();
};