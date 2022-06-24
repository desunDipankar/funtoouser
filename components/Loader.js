import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Colors from "../config/colors";
import LottieView from 'lottie-react-native';


const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		color: Colors.textColor,
		opacity: 0.9,
		fontSize: 14,
		marginTop: 10,
	},
});

const Loader = () => (
	<View style={styles.container}>
		<LottieView style={{flex:1}} source={require('../assets/loader.json')} autoPlay loop />
	</View>
	 
);

export default Loader;
