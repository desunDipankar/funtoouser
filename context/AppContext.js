import React from "react";

export default React.createContext({
	userData: null,
	setUserData: (data) => {},
	unsetUserData: () => {},
	totalCartQuantity: 0,
	setTotalCartQuantity: (data) => {},
});