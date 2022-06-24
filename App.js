import "react-native-gesture-handler";
import React from "react";
import GlobalState from "./context/GlobalState";
import AppLoading from "expo-app-loading";
import Navigation from "./navigation/Navigation";
import { getUserInfo } from "./services/APIServices";
import { Updates } from 'expo';
import { getCart } from "./services/APIServices";

import {
	readUserData,
	writeUserData,
	removeUserData,
} from "./utils/Util";


import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

// Notifications.scheduleNotificationAsync({
// 	content: {
// 	  title: "Time's up!",
// 	  body: 'Change sides!',
// 	},
// 	trigger: {
// 	  seconds: 60,
// 	},
//   });

export default class App extends React.Component {


	constructor(props) {
		super(props);
		this.notificationListener = React.createRef();
		this.responseListener = React.createRef();
	}

	state = {
		isReady: false,
		persistantData: null,
		cartDetails: 0
	};

	componentDidMount = () => {
		// CodePush.restartApp();

		this.loadPersistantData();

		this.notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				// console.log(notification);
			});

		this.responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				// console.log(response);
			});

	}


	componentWillUnmount = () => {
		Notifications.removeNotificationSubscription(
			this.notificationListener.current
		);
		Notifications.removeNotificationSubscription(this.responseListener.current);
	};



	loadPersistantData = () => {
		readUserData().then((data) => {
			console.log("user data -->",data)
			if (data !== null) {
				Promise.all([getUserInfo(data.mobile),getCart(data.id)])
					.then((response) => {
						
						let persistObj = null;
						if (response !== null) {
							persistObj = { ...data, ...response };
							writeUserData(persistObj);
						} else {
							removeUserData();
						}
						console.log("response from cart -->", response[1].data.length);
						this.setState({
							persistantData: persistObj,
							isReady: true,
							cartDetails: response[1].data.length,
						});
					})
					.catch((error) => console.log(error));
			} else {
				this.setState({
					persistantData: data,
					isReady: true,
				});
			}
		});
	};

	onFinish = () => null;



	// render = () => <Navigation />;

	render = () =>
		!this.state.isReady ? (
			<AppLoading
				startAsync={this.loadPersistantData}
				onFinish={this.onFinish}
				onError={console.log}
			/>
		) : (
			<GlobalState cartQuantity={this.state.cartDetails} persistantData={this.state.persistantData}>
				<Navigation />
			</GlobalState>
		);
}
