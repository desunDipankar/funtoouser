import React from "react";
import { StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 100,
	},
});

const Ratings = (props) => {
	const arr = [1, 2, 3, 4, 5];
	let value = typeof props.value !== "undefined" ? parseInt(props.value) : 0;

	return (
		<View style={styles.container}>
			{arr.map((v, i) => (
				<FontAwesome
					key={i.toString()}
					name={value >= v ? "star" : "star-o"}
					color={value >= v ? Colors.gameBannerBg : Colors.textInputBorder}
					size={16}
				/>
			))}
		</View>
	);
};
export default Ratings;
