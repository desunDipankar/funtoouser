import React, { useContext } from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	Dimensions,
	SafeAreaView
} from "react-native";
import Constants from "expo-constants";
import Colors from "../config/colors";
import { isEmail } from "../utils/Util";
import AppContext from "../context/AppContext";
import { writeUserData } from "../utils/Util";
import { updateUserDetails } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
// import { roundToNearestPixel } from "react-native/Libraries/Utilities/PixelRatio";

export default class UpdateAccount extends React.Component {
	static contextType = AppContext;
	// static context = useContext(AppContext);

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			email: "",
			nameValidationFailed: false,
			emailValidationFailed: false,
			isLoading: false,
			cust_code: this.props.route.params?.cust_code,
			id: this.props.route.params?.id,
		};
	}
	// componentDidMount() {
	// 	console.log('hi',this.context);
	// }

	submitData = () => {

         
		const { navigation, route } = this.props;

		this.setState(
			{
				nameValidationFailed: false,
				emailValidationFailed: false,
				cust_code: this.state.cust_code,
				// isLoading:true

			},
			() => {
				let { name, email } = this.state;
				if (name.trim().length === 0) {
					this.setState({ nameValidationFailed: true });
					return false;
				} else if (email.trim().length === 0 || !isEmail(email)) {
					this.setState({ emailValidationFailed: true });
					return false;
				} else {
					let obj = {
						name: name,
						email: email,
						mobile: route.params.mobile,
					};
					updateUserDetails(obj)
						.then((response) => {
							console.log(response)
							writeUserData(response.data);
							this.context.setUserData(response.data);
							this.setState({
								isLoading: false,
								id: this.state.id
							}),
								navigation.navigate("Home",
									{
										cust_code: this.state.cust_code,
										id: this.state.id
									}
								);
						})
						.catch((error) => {
							console.log(error)
						}
						);
				}
			
			}
		);
	};

	render = () => {
		// let { isLoading } =  this.state
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
				{
					this.state.isLoading == true ? (
						<OverlayLoader visible={this.state.isLoading}/>
					) : (
						<View style={styles.container}>
						<View style={styles.titleContainer}>
							<Text style={styles.tiltleText}>
								Please update your contact details
								</Text>
							
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Name:</Text>
							<TextInput
								value={this.state.name}
								placeholder="Enter Your Name"
								autoCompleteType="off"
								autoCapitalize="words"
								style={[
									styles.textInput,
									this.state.nameValidationFailed ? styles.inputError : null,
								]}
								onChangeText={(name) => this.setState({ name })}
							/>
						</View>
							{
							
					   }
						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Email ID:</Text>
							<TextInput
								value={this.state.email}
								placeholder="Enter Your Email"
								autoCompleteType="off"
								autoCapitalize="none"
								keyboardType="email-address"
								style={[
									styles.textInput,
									this.state.emailValidationFailed ? styles.inputError : null,
								]}
								onChangeText={(email) => this.setState({ email })}
							/>
						</View>
		
						<TouchableOpacity
							activeOpacity={0.7}
							style={[styles.button, { elevation: 1 }]}
							onPress={this.submitData}
		
						>
							<Text style={styles.buttonText}>SUBMIT</Text>
						</TouchableOpacity>
						</View>
					)
				}
				
			</SafeAreaView>
		);
	};
}

const windowheight = Dimensions.get("screen").height;
const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		height: windowheight,
		backgroundColor: Colors.white,
		paddingHorizontal: 15,
		paddingTop: Constants.statusBarHeight,
	},
	titleContainer: {
		flex: 0.3,
		alignItems: "center",
		justifyContent: "center",
		// borderWidth: 1,
	},
	tiltleText: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.black,
		letterSpacing: 0.5,
		opacity: 0.9,
	},
	subText: {
		fontSize: 12,
		color: Colors.black,
		marginBottom: 10,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 30,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.black,
		marginBottom: 10,
		opacity: 0.8,
	},
	textInput: {
		padding: 9,
		fontSize: 14,
		width: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
	button: {
		width: "100%",
		marginTop: 10,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: Colors.primary,
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	buttonText: {
		fontSize: 18,
		textAlign: "center",
		color: Colors.white,
	},
	inputError: {
		borderWidth: 1,
		borderColor: Colors.danger,
	},
});
