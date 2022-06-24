import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import moment from "moment";
import { Text, View } from "react-native";
import Colors from "../config/colors";

const FUNTOO_DEVICE_STORAGE_KEY = "@funtoo_user";

export const getFormattedDate = (dateStr, formatType = "YYYY-MM-DD") => {
	var d = new Date(dateStr);

	//prepare day
	let day = d.getDate();
	day = day < 10 ? "0" + day : day;

	//prepare month
	let month = d.getMonth() + 1;
	month = month < 10 ? "0" + month : month;

	//prepare year
	let year = d.getFullYear();

	let date = undefined;
	switch (formatType) {
		case "DD/MM/YYYY":
			date = day + "/" + month + "/" + year;
			break;
		default:
			date = year + "-" + month + "-" + day;
	}

	return date;
};

export const isMobile = (no) => {
	let regx = /^\d{10}$/;
	return regx.test(no);
};

// export const isEmail = (email) => {
// 	let regx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
// 	return regx.test(email);
// };
export const isEmail = (email) => {
	let regx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regx.test(email);
};
export const isNumeric = (n) => {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

export const readUserData = async () => {
	try {
		let rawData = await AsyncStorage.getItem(FUNTOO_DEVICE_STORAGE_KEY);
		return rawData !== null ? JSON.parse(rawData) : null;
	} catch (e) {
		throw new Error("failed to retrieve data from storage");
	}
};

export const writeUserData = async (value) => {
	try {
		await AsyncStorage.setItem(
			FUNTOO_DEVICE_STORAGE_KEY,
			JSON.stringify(value)
		);
	} catch (e) {
		throw new Error("failed to write data in storage");
	}
};

export const removeUserData = async () => {
	try {
		await AsyncStorage.removeItem(FUNTOO_DEVICE_STORAGE_KEY);
	} catch (e) {
		throw new Error("failed to remove data from storage");
	}
};


export const getDeviceToken = async () => {
	let token = null;

	if (Constants.isDevice) {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}

		if (finalStatus === "granted") {
			token = await Notifications.getExpoPushTokenAsync();
		} else {
			console.log("Failed to get push token for push notification!");
		}
	} else {
		console.log("Must use physical device for Push Notifications");
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	return token;
};

export const showDateAsClientWant = (date) => {
	let m = moment(date);
	return (
		<View>
			<Text style={{ color: Colors.black, fontSize: 13, opacity: 0.8, marginBottom: 3}}>{`${m.format("Do")} ${m.format("MMM")} ${m.format("YY")}`}  </Text>
			<Text style={{ fontSize: 10, alignSelf: 'center', opacity: 0.8, color: Colors.black}}>{` (${m.format("ddd")}) `}</Text>
		</View>
	)
	// return m.format("D/MMM/YY (ddd)");
}

export const showDayAsClientWant = (date) => {
	let m = moment(date);
	return (
		<Text style={{color: Colors.black, fontSize: 14, opacity: 0.8}}>{`${m.format("Do")} `}{`${m.format("MMM")} ${m.format("YY")}`}<Text style={{fontSize: 10}}>{` (${m.format("ddd")}) `}</Text>  </Text>
	)
	// return m.format("D/MMM/YY (ddd)");
}

export const showFormattedDateAsclient = (date) => {
	console.log(date.getDate(), date.getMonth())
}


export const showDate = (date) => {
	let m = moment(date);

	return m.format("Do - MMM - YY");
}

export const showTimeAsClientWant = (time) => {
	if (!time) {
		return "";
	}
	return moment(time, "HH:mm").format("HH:mm A");
}
