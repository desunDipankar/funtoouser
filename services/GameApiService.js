import Configs,{ToFormData} from "../config/Configs";

export const SearchAllType = async (query) => {
	let url = Configs.BASE_URL + "user/game/search_all_type?query="+query;
	let response = await fetch(url);
	
	return await response.json();
};

export const GameListByTag= async (tag_id, sortBy,cat_id) => {
	let url = Configs.BASE_URL + "user/game/game_list_by_tag?tag_id="+tag_id+"&cat_id="+`${cat_id}`+"&sort_by="+`${sortBy}`;
	let response = await fetch(url);
	return await response.json();
};

export const GameListByTagId = async (tag_id) => {
	let url = Configs.BASE_URL + "user/game/game_list_by_tag?tag_id="+tag_id;
	console.log( "URL",url);
	let response = await fetch(url);

	return await  response.json();
};