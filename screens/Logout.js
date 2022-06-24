import React from "react";
import { removeUserData } from "../utils/Util";
import AppContext from "../context/AppContext";
import OverlayLoader from "../components/OverlayLoader";
import { UnSetDeviceToken } from "../services/CustomerService";

export default class Logout extends React.Component {
	static contextType = AppContext;
	componentDidMount = () => {
		UnSetDeviceToken({id:this.context.userData.id}).then(res => {
			removeUserData();
			this.context.unsetUserData();
		})
	};

	render() {
		return (
			<OverlayLoader />
		)
	}
}
