import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Modal,
	Dimensions,
	Alert,
	SafeAreaView,
	TouchableHighlight
} from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";
import { PlaceOrder } from "../services/OrderService";
import AppContext from "../context/AppContext";
import { getFormattedDate } from "../utils/Util";
import DateAndTimePicker2 from "../components/DateAndTimePicker2";
import Dropdown from "../components/DropDown";
import { EventTypes } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import GoogleAddressPickerModal from "../components/GoogleAddressPickerModal";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from "@expo/vector-icons";
import Tooltip from 'react-native-walkthrough-tooltip';


// import { TextInput } from 'react-native-paper';

export default class EventDetails extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			cartItems: this.props.route.params.cartItems,
			quantity: this.props.route.params.quantity,
			loaderVisible: false,
			event_name: '',
			alt_name: "",
			alt_mobile: "",
			event_date: '',
			event_start_time: '',
			event_end_time: '',
			setup_date: '',
			setup_start_time: '',
			setup_end_time: '',
			setup_by: '',
			event_type_id: '',
			event_type_options: [],
			event_type: "Single",
			event_type_name: "",
			no_guest: '',
			no_kids: '',
			venue: '',
			address: '',
			landmark: null,
			floor_name: null,
			google_location: '',
			isSuccessModalOpen: false,
			play_time: null,
			is_setup_on_ground_floor: 'Yes',
			is_service_lift_available: 'No',
			gst: this.props.route.params.gst,
			total_amount: this.props.route.params.final_price,
			transport: this.props.route.params.transport,
			discount: this.props.route.params.discount,
			sub_total: this.props.route.params.price,
			openPickLocationModal: false,
			formErrors: {},
			showAwesomeAlert: false,
			awesomeAlertTitle: 'Alert',
			awesomeAlertMessage: '',
			awesomeAlertConirmText: 'Ok',
			toolTipVisible1: false,
			toolTipVisible2: false,
			awesomeAlertOnConfirmPressed: () => { }
		};
	}

	componentDidMount() {
		this.state.cartItems?.forEach(element => {
			element.price = element.price;
			element.quantity = element.qty;
			element.total_amount = parseFloat(element.price) * parseInt(element.qty);
		});

		this.setState({ loaderVisible: true });
		EventTypes()
			.then((result) => {
				let event_type_options = [];
				if (result.is_success) {
					result.data.forEach((item) => {
						event_type_options.push({
							id: item.id,
							name: item.name,
							value: item.id
						});
					});
				}

				this.setState({
					event_type_options: event_type_options
				});

			})
			.catch(err => console.log(err))
			.finally(() => this.setState({ loaderVisible: false }));
	}



	onEventDateChange = (selectedDate) => {
		this.setState({
			event_date: selectedDate,
			setup_date: selectedDate,
		})
	}

	calculateSetUpByTime = () => {
		let eventDate = new Date(this.state.event_date);
		let eventStartTimeParts = this.state.event_start_time.split(':');
		eventDate.setHours(parseInt(eventStartTimeParts[0]) - 1, parseInt(eventStartTimeParts[1]));
		this.setState({
			setup_by: `${eventDate.getHours()}:${eventDate.getMinutes()}`
		});
	}

	onevent_start_timeChange = (selectedTime) => {

		console.log("selectedTime-->", selectedTime);
		this.setState({ event_start_time: selectedTime }, () => {
			this.calculateSetUpByTime();
		});
	}

	onevent_end_timeChange = (selectedTime) => {
		this.setState({ event_end_time: selectedTime }, () => {
			this.calculateTotalPlayTime();
		});
	}

	onSetupDateChange = (selectedDate) =>
		this.setState({
			// setup_date: selectedDate,
			event_date: selectedDate
		});

	onsetup_start_timeChange = (selectedTime) =>
		this.setState({ setup_start_time: selectedTime });

	onsetup_end_timeChange = (selectedTime) =>
		this.setState({ setup_end_time: selectedTime });

	calculateTotalPlayTime = () => {
		let timeOne = new Date(this.state.setup_date);
		let eventStartTimeParts = this.state.event_start_time.split(':');
		timeOne.setHours(parseInt(eventStartTimeParts[0]), parseInt(eventStartTimeParts[1]));

		let timeTwo = new Date(this.state.setup_date);
		let eventEndTimeParts = this.state.event_end_time.split(":");
		timeTwo.setHours(parseInt(eventEndTimeParts[0]), parseInt(eventEndTimeParts[1]));

		this.setState({
			play_time: Math.abs(timeTwo.getHours() - timeOne.getHours())
		});
	}

	gotoManageEnquiry = () => {
		this.setState(
			{
				isSuccessModalOpen: false,
			},
			() => {
				this.props.navigation.navigate("ManageEnquiry");
			}
		);
	};

	validateData = () => {

		let errors = {}

		if (this.state.event_date == '') {
			errors.event_date = "Please choose a date";
		}

		if (this.state.event_start_time == '') {
			errors.event_start_time = "Choose start time";
		}

		if (this.state.event_end_time == '') {
			errors.event_end_time = "Choose end time";
		}

		if (this.state.setup_date == '') {
			errors.setup_date = "Please choose a date";
		}

		if (this.state.setup_by == '') {
			errors.setup_by = "Please choose a time";
		}

		if (this.state.event_type_id == '') {
			errors.event_type_id = "Please choose an event type";
		}

		if (this.state.venue == '') {
			errors.venue = "Enter a venue name";
		}

		if (this.state.address == '') {
			errors.address = "Enter an address";
		}

		this.setState({
			formErrors: errors
		});

		if (Object.keys(errors).length != 0) {
			return false;
		}

		return true;
	}

	sendQuery = () => {
		let data = {
			customer_id: this.context.userData.id,
			subtotal: this.state.sub_total,
			total_tax: this.state.gst,
			additional: 0,
			transport: this.state.transport,
			discount: this.state.discount,
			grand_total: this.state.total_amount,
			alt_name: this.state.alt_name,
			alt_mobile: this.state.alt_mobile,
			line_items: JSON.stringify(this.state.cartItems),
			event_details: JSON.stringify({
				event_name: this.state.event_name,
				event_type_id: this.state.event_type_id,
				event_type_name: this.state.event_type_name,
				event_start_time: this.state.event_start_time,
				event_date: this.state.event_date,
				event_end_time: this.state.event_end_time,
				setup_date: getFormattedDate(this.state.setup_date),
				setup_start_time: this.state.setup_by,
				setup_end_time: this.state.setup_end_time,
				play_time: this.state.play_time,
				num_of_guest: this.state.no_guest,
				num_of_kids: this.state.no_kids,
				venue: this.state.venue,
				address: this.state.address,
				landmark: this.state.landmark,
				floor_name: this.state.floor_name,
				google_location: this.state.google_location
			})
		};
		this.setState({
			showAwesomeAlert: false,
			loaderVisible: true
		});
		PlaceOrder(data)
			.then((response) => {
				if (response.is_success) {
					this.setState({ isSuccessModalOpen: true })
				}
			})
			.catch((error) => Alert.alert("Error", error))
			.finally(() => this.setState({ loaderVisible: false }));
	}

	sendEnquiryBtnClick = () => {
		if (this.validateData()) {
			// check play time
			// if play time is grater than 4 hr then show alert
			if (parseInt(this.state.play_time) > 4) {
				this.setState({
					showAwesomeAlert: true,
					awesomeAlertMessage: `Pls note the charges are normally for 4 Hours of play time excluding setup and break down .. We see that your requirement is for ${this.state.play_time} hours pls discuss with us!`,
					awesomeAlertOnConfirmPressed: this.sendQuery
				});
			} else {
				this.sendQuery();
			}
		}
	};


	setMobile = (number) => {
		if (number?.length <= 10) {
			this.setState({ alt_mobile: number });
		}
	}

	render = () => {
		return (
			<SafeAreaView style={styles.container}>

				<OverlayLoader visible={this.state.loaderVisible} />

				<Header title="Event Details" />
				<View style={styles.form}>
					<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} ref='scroll'>
						{/* <View style={styles.topBtnContainer}>
              <TouchableOpacity style={[styles.topBtn,
              this.state.event_type == "Single" ? styles.activeTab : null]}
                onPress={() => this.setState({ event_type: "Single" })}>
                <Text style={
                  this.state.event_type === "Single"
                    ? styles.activeText
                    : styles.inActiveText
                }>
                  Single Day Event
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.topBtn,
              this.state.event_type == "Multiple" ? styles.activeTab : null]} >
                <Text style={
                  this.state.event_type === "Multiple"
                    ? styles.activeText
                    : styles.inActiveText
                }
                  onPress={() => this.setState({ event_type: "Multiple" })}
                >
                  Multiple Day Event
                </Text>
              </TouchableOpacity>
            </View> */}


						<View style={styles.rowContainer}>

							{/* <View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Event Name:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.event_name}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInput}
										onChangeText={(event_name) => this.setState({ event_name })}
									/>
								</View>
							</View> */}



							{/* <Text style={{ marginBottom: 3, color: Colors.grey }}>Basic Details</Text> */}
							<View style={styles.row}>

								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Event Date:</Text>
								</View>
								<View style={styles.rowRight}>
									<DateAndTimePicker2
										mode={"date"}
										value={this.state.event_date}
										onChange={this.onEventDateChange}
									/>

									{this.state.formErrors.event_date && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.event_date}</Text>
									)}

								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Event Time:</Text>
								</View>
								<View style={[styles.rowRight,  {justifyContent: 'space-between', width: '35%', alignItems: 'center'}]}>
									<View>
									{/* <Text style={{ fontSize: 10, color: Colors.black, alignSelf: 'center' }}>Event Start Time</Text> */}
									<DateAndTimePicker2
										mode={"time"}
										value={this.state.event_start_time}
										// placeholder="Start Time"
										onChange={this.onevent_start_timeChange}
									/>
									</View>
									<View right={10} >
									<Tooltip 
										animated={true}
										arrowSize={{ width: 16, height: 8 }}
										backgroundColor="rgba(0,0,0,0.5)"
										isVisible={this.state.toolTipVisible1}
										showChildInTooltip={false}
										content={<Text>Start Time</Text>}
										placement="bottom"
										onClose={() => this.setState({ toolTipVisible1: false })}
									>
										<TouchableOpacity onPress={() => this.setState({ toolTipVisible1: true })}>
											<Ionicons color={Colors.grey} size={12} name="information-circle" />
											{/* <Text>i</Text> */}
										</TouchableOpacity>

									</Tooltip>
									</View>

									{this.state.formErrors.event_start_time && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.event_start_time}</Text>
									)}
								</View>
								<View style={[styles.rowRight, {justifyContent: 'space-between', width: '35%', alignItems: 'center'}]}>
									<View>
									{/* <Text style={{ fontSize: 10, color: Colors.black, alignSelf: 'center' }}>Event End Time</Text> */}
									<DateAndTimePicker2
										mode={"time"}
										value={this.state.event_end_time}
										// placeholder="End Time"
										onChange={this.onevent_end_timeChange}
									/>
									</View>
									<View right={10}>
									<Tooltip
										animated={true}
										arrowSize={{ width: 16, height: 8 }}
										backgroundColor="rgba(0,0,0,0.5)"
										isVisible={this.state.toolTipVisible2}
										showChildInTooltip={false}
										content={<Text>End Time</Text>}
										placement="bottom"
										onClose={() => this.setState({ toolTipVisible2: false })}
									>
										<TouchableOpacity onPress={() => this.setState({ toolTipVisible2: true })}>
											<Ionicons color={Colors.grey} size={12} name="information-circle" />
											{/* <Text>i</Text> */}
										</TouchableOpacity>

									</Tooltip>
									</View>
									{this.state.formErrors.event_end_time && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.event_end_time}</Text>
									)}
								</View>
							</View>

							{/* <View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Setup Date:</Text>
								</View>
								<View style={styles.rowRight}>
									<DateAndTimePicker2
										mode={"date"}
										value={this.state.setup_date}
										onChange={this.onSetupDateChange}
									/>
									{this.state.formErrors.setup_date && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.setup_date}</Text>
                                    )}
								</View>
							</View> */}

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Setup:</Text>
								</View>
								<View style={[styles.rowRight, { width: '45%', marginLeft: 0 }]}>
									<DateAndTimePicker2
										mode={"date"}
										value={this.state.setup_date}
										onChange={this.onSetupDateChange}
									/>
									{this.state.formErrors.setup_date && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.setup_date}</Text>
									)}
								</View>
								<View style={[styles.rowRight, { width: '25%', marginLeft: 0 }]}>
									<DateAndTimePicker2
										mode={"time"}
										value={this.state.setup_by}
										onChange={(selectedTime) => this.setState({ setup_by: selectedTime })}
									/>
									{this.state.formErrors.setup_by && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.setup_by}</Text>
									)}
								</View>
							</View>

							{/* <View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Setup Time:</Text>
								</View>
								<View style={[styles.rowRight, { width: '35%' }]}>
									<DateAndTimePicker2
										mode={"time"}
										value={this.state.setup_start_time}
										onChange={this.onsetup_start_timeChange}
									/>
								</View>

								<View style={[styles.rowRight, { width: '35%', marginLeft: 1 }]}>
									<DateAndTimePicker2
										mode={"time"}
										value={this.state.setup_end_time}
										onChange={this.onsetup_end_timeChange}
									/>
								</View>
							</View> */}


							{/* 
							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}># of Kids:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.no_kids}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInput}
										onChangeText={(no_kids) => this.setState({ no_kids })}
									/>
								</View>
							</View> */}

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Event Type:</Text>
								</View>
								<View style={styles.rowRight}>
									<Dropdown

										value={this.state.event_type_name}
										onChange={(item) => this.setState({
											event_type_name: item.name,
											event_type_id: item.value
										})}
										items={this.state.event_type_options}
									/>
									{this.state.formErrors.event_type_id && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.event_type_id}</Text>
									)}
								</View>
							</View>

						</View>


						<View style={[styles.rowContainer, { marginTop: 0 }]}>
							{/* <Text style={{ marginBottom: 3, color: Colors.grey }}>Location Details</Text> */}
							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Venue:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.venue}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInput}
										onChangeText={(venue) => this.setState({ venue })}
									/>
									{this.state.formErrors.venue && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.venue}</Text>
									)}
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Address:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.address}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInputAddress}
										multiline={true}
										onChangeText={(address) => this.setState({ address })}
									/>
									{/* {this.state.formErrors.address && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.address}</Text>
                                    )} */}
								</View>
							</View>

							<View style={[styles.row, { marginBottom: 0.6 }]}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Google Location:</Text>
								</View>
								<View style={styles.rowRight}>

									<TouchableOpacity
										onPress={() => {
											this.setState({
												openPickLocationModal: true
											});
										}
										}

										style={{
											padding: 12,
										}}

									>
										<Text style={styles.location}>{(this.state.google_location == '') ? 'Select Address' : this.state.google_location}</Text>
									</TouchableOpacity>

								</View>
							</View>

							{
								this.state.google_location ?
									null :
									<View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Landmark:</Text>
										</View>
										<View style={styles.rowRight}>
											<TextInput
												value={this.state.landmark}
												autoCompleteType="off"
												autoCapitalize="words"
												style={styles.textInput}
												multiline={true}
												onChangeText={(landmark) => this.setState({ landmark })}
											/>
										</View>
									</View>
							}


							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Is the setup on the ground floor?:</Text>
								</View>
								<View style={styles.rowRight}>
									<Dropdown
										value={this.state.is_setup_on_ground_floor}
										onChange={(item) => this.setState({ is_setup_on_ground_floor: item.value })}
										items={[{ id: 1, name: 'Yes', value: 'Yes' }, { id: 2, name: 'No', value: 'No' }]}
									/>
								</View>
							</View>

							{
								(this.state.is_setup_on_ground_floor == 'No') ? (
									<>
										<View style={styles.row}>
											<View style={styles.rowLeft}>
												<Text style={styles.inputLable}>Which Floor is the setup?:</Text>
											</View>
											<View style={styles.rowRight}>
												<TextInput
													value={this.state.floor_name}
													autoCompleteType="off"
													autoCapitalize="words"
													style={styles.textInput}
													multiline={true}
													onChangeText={(floor_name) => this.setState({ floor_name })}
												/>
											</View>
										</View>

										<View style={styles.row}>
											<View style={styles.rowLeft}>
												<Text style={styles.inputLable}>Is service lift available?:</Text>
											</View>
											<View style={styles.rowRight}>
												<Dropdown
													value={this.state.is_service_lift_available}
													onChange={(item) => this.setState({ is_service_lift_available: item.value })}
													items={[{ id: 1, name: 'Yes', value: 'Yes' }, { id: 2, name: 'No', value: 'No' }]}
												/>
											</View>
										</View>
									</>
								) : null
							}

							{/* <View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Play Time:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.play_time}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInput}
										multiline={true}
										onChangeText={(play_time) => this.setState({ play_time })}
									/>
								</View>
							</View> */}

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}># of Guest:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.no_guest}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInput}
										onChangeText={(no_guest) => this.setState({ no_guest })}
									/>
									{/* {this.state.formErrors.no_guest && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.no_guest}</Text>
                                    )} */}
								</View>
							</View>
						</View>



						<View style={[styles.rowContainer, { marginTop: 2 }]}>

							<Text style={{ marginBottom: 2, color: Colors.grey }}>Alternate Contact</Text>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Name:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.alt_name}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInput}
										onChangeText={(alt_name) => this.setState({ alt_name })}
									/>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Mobile:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.alt_mobile}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInput}
										keyboardType="numeric"
										onChangeText={(alt_mobile) => this.setMobile(alt_mobile)}
									/>
								</View>
							</View>
						</View>

						<View style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: 5,
							padding: 10,
							// backgroundColor: Colors.textInputBg
						}}>
							<Text style={{ color: Colors.grey }}>Play Time: {this.state?.play_time ?? 0} Hours</Text>
						</View>
						<View style={{
							justifyContent: 'center',
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: 5,
						}}>

							<TouchableOpacity style={styles.submitBtn} onPress={this.sendEnquiryBtnClick}>
								<Text style={{ fontSize: 18, color: Colors.white }}>Send Enquiry</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.submitBtn, { backgroundColor: 'grey', marginLeft: 5 }]}
								onPress={() => this.props.navigation.goBack()}>
								<Text style={{ fontSize: 18, color: Colors.white }}>Back Order</Text>
							</TouchableOpacity>

						</View>

					</ScrollView>
				</View>

				<Modal
					animationType="fade"
					transparent={true}
					statusBarTranslucent={true}
					visible={this.state.isSuccessModalOpen}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalBody}>
							<Text style={styles.successTitle}>Thank you for your Query!</Text>
							<Text style={styles.successText}>
								Your Query Form will be reviewed shortly and a response / update
								will be made to your Query form. We appreciate your patience and
								let us know if there’s anything else we can help you with. (
								9060777555 )
							</Text>

							<TouchableOpacity
								onPress={this.gotoManageEnquiry}
								style={[styles.submitBtn, { height: 45 }]}
							>
								<Text style={{ fontSize: 18, color: Colors.white }}>
									Mange Enquiry
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>


				<GoogleAddressPickerModal
					openPickLocationModal={this.state.openPickLocationModal}
					onChooseAddress={(address) => {
						this.setState({
							google_location: address,
							openPickLocationModal: false
						});
					}}
				/>

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
						this.setState({ showAwesomeAlert: false })
					}}
					onConfirmPressed={() => this.state.awesomeAlertOnConfirmPressed()}
				/>

			</SafeAreaView>
		);
	};
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d9dfe0",
	},

	rowContainer: {
		borderColor: "#d2d1cd",
		borderWidth: 0,
		borderRadius: 10,
		paddingVertical: 5,
	},
	row: {
		marginTop: 0,
		flexDirection: 'row',
		marginBottom: 0.2
	},
	rowLeft: {
		width: '30%',
		backgroundColor: '#f9f9f9',
		paddingLeft: 5,
		justifyContent: 'center',
		marginTop: 0.2
		// paddingTop:1,
		// paddingBottom:1,
	},
	rowRight: {
		flexDirection: "row",
		width: '70%',
		marginLeft: 0,
		backgroundColor: '#f9f9f9',
		// marginTop: 0.2,
	},

	activeTab: {
		backgroundColor: Colors.primary,
	},

	activeText: {
		fontWeight: "bold",
		color: 'white',
	},
	inActiveText: {
		color: "silver",
		opacity: 0.8,
	},
	form: {
		flex: 1,
		paddingVertical: 5,
		paddingHorizontal: 5
		//borderRadius: 10,
	},
	topBtnContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginBottom: 30,
	},
	topBtn: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 25,
		borderRadius: 10
	},
	inputLable: {
		fontSize: 14,
		color: Colors.black,
		marginBottom: 0,
		opacity: 0.8,
	},
	textInput: {
		height: 32,
		fontSize: 14,
		width: "100%",
		borderWidth: 0,
		// borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		marginBottom: 0
	},

	textInputAddress: {
		height: 52,
		fontSize: 14,
		width: "100%",
		borderWidth: 0,
		// borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		marginBottom: 0,
		paddingRight: 10
	},
	submitBtn: {
		height: 42,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		// borderRadius: 4,
		padding: 10,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalBody: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.white,
		width: windowWidth - 30,
		minHeight: Math.floor(windowHeight / 4),
		// borderRadius: 5,
		elevation: 5,
		padding: 20,
	},
	successTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: Colors.black,
		marginBottom: 15,
	},
	successText: {
		fontSize: 15,
		color: Colors.black,
		opacity: 0.9,
		textAlign: "justify",
		marginBottom: 15,
	},
	formErrorsText: {
		fontSize: 12,
		color: Colors.danger
	},

	location: {
		color: Colors.grey,
		fontSize: 13

	},

	info: {
		color: Colors.grey,
		right: 20,
		top: 15,
	}
});
