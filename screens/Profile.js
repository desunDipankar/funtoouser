import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Alert
} from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";
import AppContext from "../context/AppContext";
import { UpdateProfile } from "../services/CustomerService";
import { writeUserData, isEmail } from "../utils/Util";
import OverlayLoader from "../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';


export default class Profile extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			billingName: "",
			gstin: "",
			emailID: "",
			billingAddress: "",

			emailValidationFailed: false,
			loaderVisible: false,
			formErrors: {},
			showAwesomeAlert: false,
			awesomeAlertTitle: 'Alert',
			awesomeAlertMessage: '',
			awesomeAlertConirmText: 'Ok',
			awesomeAlertOnConfirmPressed: () => {  }
		};
	}

	componentDidMount = () => {
		this.setState({
			billingName: this.context.userData.name,
			emailID: this.context.userData.email,
			billingAddress: this.context.userData.billing_address,
			gstin: this.context.userData.gstin
		})
	}

	validateData = () => {

		let errors = {};

		if(this.state.emailID == '') {
			errors.emailID = "Please enter an email";
		}

		if (!isEmail(this.state.emailID)) {
			errors.emailID = "Please enter a valid email";
		}

		if(this.state.billingName == '') {
			errors.billingName = "Please enter a billing name";
		}

		if(this.state.billingAddress == '') {
			errors.billingAddress = "Please enter a billing address";
		}

		this.setState({
			formErrors: errors
		});

		if(Object.keys(errors).length != 0) {
			return false;
		}

		return true;
	}

	onSubmitBtnPress = () => {
		if(this.validateData()) {
			let obj = {
				id: this.context.userData?.id,
				name: this.state.billingName,
				email: this.state.emailID,
				mobile: this.context.userData.mobile,
				cust_code: this.context.userData.cust_code,
				gstin: this.state.gstin,
				billing_address: this.state.billingAddress
			};

			this.setState({
				loaderVisible: true
			});
			UpdateProfile(obj)
			.then((response) => {
				if (response.is_success) {
					writeUserData(response.data);
					this.context.setUserData(response.data);

					this.setState({
						showAwesomeAlert: true,
						awesomeAlertTitle: 'Success',
						awesomeAlertMessage: 'Profile updated successfully',
						awesomeAlertOnConfirmPressed: () => { this.setState({showAwesomeAlert: false}) } 
					});
				}
			})
			.catch( error => console.log(error))
			.finally( () => this.setState({loaderVisible: false}) );
		}
	}

	render = () => {

		return (
			<SafeAreaView style={styles.container}>

				<OverlayLoader visible={this.state.loaderVisible} />

				<Header title="My Account" />
				<View style={styles.form}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<Text style={styles.heading}>{"Welcome !  " + this.state.billingName}</Text>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Billing Name:</Text>
							<TextInput
								value={this.state.billingName}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(billingName) => this.setState({ billingName })}
							/>
							{this.state.formErrors.billingName && (
								<Text style={styles.formErrorsText}>{this.state.formErrors.billingName}</Text>
							)}
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>GSTIN:</Text>
							<TextInput
								value={this.state.gstin}
								autoCompleteType="off"
								autoCapitalize="characters"
								style={styles.textInput}
								onChangeText={(gstin) => this.setState({ gstin })}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Email ID:</Text>
							<TextInput
								value={this.state.emailID}
								autoCompleteType="off"
								autoCapitalize="none"
								keyboardType="email-address"
								style={[styles.textInput, this.state.emailValidationFailed ? styles.inputError : null,]}
								onChangeText={(emailID) => this.setState({ emailID })}
							/>
							{this.state.formErrors.emailID && (
								<Text style={styles.formErrorsText}>{this.state.formErrors.emailID}</Text>
							)}
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Billing Address:</Text>
							<TextInput
								multiline={true}
								numberOfLines={5}
								autoCompleteType="off"
								autoCapitalize="words"
								style={[styles.textInput, { textAlignVertical: "top" }]}
								value={this.state.billingAddress}
								onChangeText={(billingAddress) =>
									this.setState({ billingAddress })
								}
							/>
							{this.state.formErrors.billingAddress && (
								<Text style={styles.formErrorsText}>{this.state.formErrors.billingAddress}</Text>
							)}
						</View>


					</ScrollView>
					<TouchableOpacity
						style={styles.submitBtn}
						onPress={this.onSubmitBtnPress}
					>
						<Text style={{ fontSize: 18, color: Colors.white }

						}>SUBMIT</Text>
					</TouchableOpacity>
				</View>

				<AwesomeAlert
					show={this.state.showAwesomeAlert}
					showProgress={false}
					title={this.state.awesomeAlertTitle}
					message={this.state.awesomeAlertMessage}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showConfirmButton={true}
					confirmText={this.state.awesomeAlertConirmText}
					confirmButtonColor={Colors.primary}
					onCancelPressed={() => {
						this.setState({showAwesomeAlert: false})
					}}
					onConfirmPressed={() => this.state.awesomeAlertOnConfirmPressed()  }
				/>

			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	form: {
		flex: 1,
		padding: 8,
	},
	heading: {
		fontSize: 16,
		color: Colors.black,
		fontWeight: "bold",
		marginVertical: 30,
		alignSelf: "center",
	},
	inputContainer: {
		width: "100%",
		marginBottom: 25,
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
	submitBtn: {
		marginTop: 15,
		height: 45,
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
	inputError: {
		borderWidth: 1,
		borderColor: Colors.danger,
	},
	formErrorsText: {
		fontSize: 12,
		color: Colors.danger 
	}
});
