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
	FlatList
} from "react-native";
import Colors from "../config/colors";
import ProgressiveImage from "../components/ProgressiveImage";
import Header from "../components/Header";
import { GetSingleOrderEnquiry, UpdateOrder } from "../services/OrderService";
import AppContext from "../context/AppContext";
import { getFormattedDate } from "../utils/Util";
import DateAndTimePicker2 from "../components/DateAndTimePicker2";
import Dropdown from "../components/DropDown";
import { EventTypes } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import GoogleAddressPickerModal from "../components/GoogleAddressPickerModal";
import AwesomeAlert from 'react-native-awesome-alerts';
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default class UpdateEnquiry extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			order_id: this.props.route.params.order_id,
			loaderVisible: false,
			orderDetails: {},
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
			quantity: this.props.route.params.quantity,
			openPickLocationModal: false,
			formErrors: {},
			showAwesomeAlert: false,
			awesomeAlertTitle: 'Alert',
			awesomeAlertMessage: '',
			awesomeAlertConirmText: 'Ok',
			quantity: 0,
			awesomeAlertOnConfirmPressed: () => { }
		};
	}

	componentDidMount() {
		this.setState({ loaderVisible: true });
		Promise.all([GetSingleOrderEnquiry({ id: this.state.order_id }), EventTypes()])

			.then((result) => {
				console.log("single order -->", result[1]);
				let orderData = result[0];
				let eventTypes = result[1];

				let newState = {}
				if (orderData.is_success) {
					this.setState({
						orderDetails: orderData.data,
					});
					let eventData = orderData.data.event_data;
					newState.event_name = eventData.event_name;
					newState.event_date = new Date(eventData.event_date);
					newState.event_start_time = eventData.event_start_time;
					newState.event_end_time = eventData.event_end_time;
					newState.setup_date = new Date(eventData.setup_date);
					newState.setup_by = eventData.setup_start_time;
					newState.no_guest = eventData.num_of_guest;
					newState.no_kids = eventData.num_of_kids;
					newState.event_type_id = eventData.event_type_id;
					newState.event_type_name = eventData.event_type_name;
					newState.venue = eventData.venue;
					newState.address = eventData.address;
					newState.landmark = eventData.landmark;
					newState.google_location = eventData.google_location;
					newState.play_time = eventData.play_time;
					newState.alt_name = orderData.data.alt_name;
					newState.alt_mobile = orderData.data.alt_mobile;
				}

				if (eventTypes.is_success) {
					let event_type_options = [];
					if (eventTypes.is_success) {
						eventTypes.data.forEach((item) => {
							event_type_options.push({
								id: item.id,
								name: item.name,
								value: item.id
							});
						});
					}
					newState.event_type_options = event_type_options;
				}
				this.setState(newState);
			})
			.catch(err => console.log(err))
			.finally(() => this.setState({ loaderVisible: false }));
	}

	onEventDateChange = (selectedDate) => {
		this.setState({
			event_date: selectedDate,
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
		this.setState({ event_start_time: selectedTime }, () => {
			this.calculateSetUpByTime();
		});
	}

	onevent_end_timeChange = (selectedTime) =>
		this.setState({ event_end_time: selectedTime }, () => {
			this.calculateTotalPlayTime();
		});

	onSetupDateChange = (selectedDate) =>
		this.setState({
			setup_date: selectedDate,
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
			errors.event_date = "Please choose an date";
		}

		if (this.state.event_start_time == '') {
			errors.event_start_time = "Choose start time";
		}

		if (this.state.event_end_time == '') {
			errors.event_end_time = "Choose end time";
		}

		if (this.state.setup_date == '') {
			errors.setup_date = "Please choose an date";
		}

		if (this.state.setup_by == '') {
			errors.setup_by = "Please choose an time";
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
			id: this.state.order_id,
			alt_name: this.state.alt_name,
			alt_mobile: this.state.alt_mobile,
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
		UpdateOrder(data)
			.then((response) => {
				console.log("response after update -->", response.data );
				if (response.is_success) {
					this.setState({ isSuccessModalOpen: true })
				}
			})
			.catch((error) => Alert.alert("Error", error))
			.finally(() => this.setState({ loaderVisible: false }));
	}

	updateEnquiryBtnClick = () => {
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

		console.log("order details -->", this.state.orderDetails);
		let lineItems = this.state.orderDetails?.line_items;
		return (
			<SafeAreaView style={styles.container}>

				<OverlayLoader visible={this.state.loaderVisible} />

				<Header title="Update Order" />
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

							<Text style={{ marginBottom: 3, color: Colors.grey }}>Basic Details</Text>
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
								<View style={[styles.rowRight, { width: '35%' }]}>
									{/* <Text style={{ fontSize: 10, color: Colors.black, alignSelf: 'center' }}>Event Start Time</Text> */}
									<DateAndTimePicker2
										mode={"time"}
										value={this.state.event_start_time}
										onChange={this.onevent_start_timeChange}
									/>
									{this.state.formErrors.event_start_time && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.event_start_time}</Text>
									)}
								</View>
								<View style={[styles.rowRight, { width: '35%', marginLeft: 1 }]}>
									{/* <Text style={{ fontSize: 10, color: Colors.black, alignSelf: 'center' }}>Event End Time</Text> */}
									<DateAndTimePicker2
										mode={"time"}
										value={this.state.event_end_time}
										onChange={this.onevent_end_timeChange}
									/>
									{this.state.formErrors.event_end_time && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.event_end_time}</Text>
									)}
								</View>
							</View>

							<View style={styles.row}>
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
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Setup By:</Text>
								</View>
								<View style={styles.rowRight}>
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



							{/* <View style={styles.row}>
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
								</View>
							</View>

						</View>

						<View style={[styles.rowContainer, { marginTop: 0 }]}>

							<Text style={{ marginBottom: 2, color: Colors.grey }}>Location Details</Text>

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
										style={styles.textInput}
										multiline={true}
										onChangeText={(address) => this.setState({ address })}
									/>
									{this.state.formErrors.address && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.address}</Text>
									)}
								</View>
							</View>

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

							<View style={styles.row}>
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
											padding: 12
										}}

									>
										<Text style={{ fontSize: 12 }}>{(this.state.google_location == '') ? 'Select Address' : this.state.google_location}</Text>
									</TouchableOpacity>

								</View>
							</View>

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
									{this.state.formErrors.no_guest && (
										<Text style={styles.formErrorsText}>{this.state.formErrors.no_guest}</Text>
									)}
								</View>
							</View>


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
						</View>

						<View style={styles.rowContaner}>

							<View style={{ marginBottom: 10 }}>
								<Text style={{ fontWeight: 'bold', fontSize: 16 }}>Games</Text>
							</View>

							{
								lineItems?.map(item => {
									console.log("items in item -->",item)
									let data=[];
									for(let i=1; i<=item.game.stock_quantity; i++){
										data.push({id: item.id, value: item.game.stock_quantity, name: i.toString()});
									}
									return (
										<>
											<View key={item.id} style={[styles.listRow]}>
												<View style={{ flexDirection: 'row' }}>
													<View style={{ width: "20%" }}>
														<ProgressiveImage
															source={{ uri: item.game.image_url }}
															style={{ height: 57, width: "100%" }}
															resizeMode="cover"
														/>
													</View>
													<View style={{ width: "50%", paddingLeft: 10 }}>
														<Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
															{item.game.name}
														</Text>
														{/* <Text style={styles.subText}>{item.quantity} Quantity * {item.price}</Text> */}
													</View>
													<Dropdown style={styles.dropdown}

														items={data}

														value={item.quantity}
														// defaultValue={1}
														placeholder="Qty "

														onChange={(selecitetedItem) => {
															this.setState({ quantity: selecitetedItem.value })
															
														}}

													/>
													{/* <Ionicons name="chevron-down-outline" size={15} color={Colors.grey} style={styles.down} /> */}
												</View>
											</View>

										</>
									)
								})
							}



						</View>

						<View style={[styles.rowContainer, { marginTop: 0 }]}>

							<TouchableOpacity style={styles.submitBtn} onPress={this.updateEnquiryBtnClick}>
								<Text style={{ fontSize: 18, color: Colors.white }}>Update Order</Text>
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
		padding: 10,

	},
	row: {
		marginTop: 0,
		flexDirection: 'row',
		marginTop: 0.2
	},
	rowLeft: {
		width: '30%',
		backgroundColor: '#f9f9f9',
		paddingLeft: 10,
		justifyContent: 'center',
		marginBottom: 0.2
		// paddingTop:1,
		// paddingBottom:1,
	},
	rowRight: {
		width: '70%',
		marginLeft: 0,
		backgroundColor: '#f9f9f9',
		marginBottom: 0.2
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
		padding: 8,
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
		height: 38,
		fontSize: 12,
		width: "100%",
		borderWidth: 0,
		// borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
	submitBtn: {
		height: 50,
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
		color: Colors.grey
	},

	card: {
		flexDirection: "row",
		width: "94%",
		height: 75,
		paddingHorizontal: 8,
		paddingVertical: 10,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: Colors.white,
		marginBottom: 10,
	},

	listRow: {
		borderBottomColor: "#eee",
		borderBottomWidth: 0,
		paddingHorizontal: 5,
		paddingVertical: 5,
	},

	titleText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.black,
		marginBottom: 2,
	},

	rowContaner: {
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		margin: 10,

	},

	dropdown: {
		borderWidth: 0,
		borderColor: Colors.grey,
		height: 30,
		width: 35,
		zIndex: 1000
	},

});