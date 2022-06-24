import React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import {
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem
} from "@react-navigation/drawer";
import { FontAwesome ,MaterialCommunityIcons} from "@expo/vector-icons";
import Colors from "../config/colors";
import AppContext from "../context/AppContext";

export default class CustomDrawer extends React.Component {
	static contextType = AppContext;
	constructor(props){
		super(props)
	}
	gotoLogout = () => this.props.navigation.navigate("Logout");
	
	render() {
		
		return (
			<View style={styles.container}>
				<DrawerContentScrollView {...this.props}>
					<View style={styles.drawerContent}>
						<View style={{ marginTop: -5, backgroundColor: Colors.primary }}>
							<View style={styles.userInfoSection}>
								<View style={styles.userImage}>
									{/* <Image
										source={require("../assets/user.png")}
										style={{ height: 70, width: 70, borderRadius: 70 / 2 }}
										resizeMode={"cover"}
									/> */}
									<FontAwesome
										name="user-circle-o"
										color={Colors.white}
										size={50}
									/>
								</View>
								<View style={{ width: "68%" }}>
									<Text style={styles.title}>{this.context.userData?.name ?? ''}</Text>
									<Text style={styles.caption}>{`Mobile: ${this.context.userData?.mobile ?? ''}`}</Text>
									<Text style={styles.caption}>{`Address: ${this.context.userData?.billing_address ?? ''}`}</Text>
								</View>
							</View>
						</View>
						<DrawerItemList {...this.props} />
					</View>

					<DrawerItem
						label={({ focused, color }) => (
							<Text style={{color: Colors.black, fontSize: 16 }}>{"Log Out"}</Text>
						)}
						icon={({ focused, color }) => (
							<MaterialCommunityIcons
									name="logout"
									size={25}
									color={Colors.black}
								/>
						)}
						onPress={this.gotoLogout}
					/>
				</DrawerContentScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		paddingHorizontal: 10,
		marginVertical: 20,
		flexDirection: "row",
	},
	userImage: {
		overflow: "hidden",
		height: 70,
		width: 70,
		// borderRadius: 70 / 2,
		// borderWidth: 2,
		// borderColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 10,
		color: "white",
	},
	caption: {
		fontSize: 12,
		fontWeight: "bold",
		marginTop: 10,
		color: "white",
	},
	preference: {
		flexDirection: "row",
		paddingVertical: 15,
		paddingLeft: 25,
		paddingRight: 35,
		justifyContent: "space-between",
	},
	bottomDrawerSection: {
		marginTop: 15,
		borderColor: "#f4f4f4",
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	logout: {
		paddingHorizontal: 25,
		paddingVertical: 20,
		flexDirection: "row",
		borderColor: "#f4f4f4",
		borderTopWidth: 1,
	},
});
