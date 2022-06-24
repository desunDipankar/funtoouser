import React from "react";
import { View, StyleSheet, ActivityIndicator, Modal } from "react-native";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	modalBody: {
		alignItems: "center",
	},
	loadingText: {
		lineHeight: 50,
		color: Colors.primary,
	},
});

const OverlayLoader = (props) => (
	<Modal animationType="fade" transparent={true} visible={props.visible}>
		<View style={styles.modalContainer}>
			<View style={styles.modalBody}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		</View>
	</Modal>
);

export default OverlayLoader;
