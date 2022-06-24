import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView } from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";

export default class Chat extends React.Component {
	render = () => (
		<SafeAreaView style={styles.container}>
			<Header title="Chat" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
});
