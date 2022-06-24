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
	SafeAreaView
} from "react-native";
import Colors from "../config/colors";
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
import ProgressiveImage from "../components/ProgressiveImage";
import { showDateAsClientWant, showDayAsClientWant } from "../utils/Util";
import colors from "../config/colors";

export default class UpdateEnquiry extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			order_id: this.props.route.params.order_id,
			loaderVisible: false,
			event_name: '',
			alt_name: "",
			alt_mobile: "",
			event_date: '',
			event_date_end: '',
			event_date_start:'',
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
			awesomeAlertOnConfirmPressed: () => { },
			orderDetails:{},
		};
	}
   
	componentDidMount() {
		// this.calculateTotalPlayTime()
		console.log(this.state.order_id)
		// get order item
		GetSingleOrderEnquiry({
			id: this.state.order_id,
		})
			.then((result) => {
				console.log("Order Details *****", result)
				if (result.is_success) {
					this.setState({
						orderDetails: result.data,
					});
				}
			})
			.catch((err) => console.log(err))
		this.setState({ loaderVisible: true });
		Promise.all([GetSingleOrderEnquiry({ id: this.state.order_id }), EventTypes()])
			.then((result) => {

				let orderData = result[0];
				let eventTypes = result[1];

				let newState = {}
				if (orderData.is_success) {
					let eventData = orderData.data.event_data;
					console.log('eventdata>>>>>'  , eventData)
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
			.finally(() => this.setState({ loaderVisible: false }, () => {
				
				this.calculateTotalPlayTime()
					// console.log('date>>>>>>>>>>>>>>>>' +this.state.event_date)
			}));
	}

	onEventDateChange = (selectedDate) => {
		this.setState({
			event_date: selectedDate,
		})
	}
	onEventDateChangeEnd = (selectedDate) => {
		this.setState({
			event_date_end: selectedDate,
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

	onsetup_start_timeChange = (selectedTime) => {
		this.setState({ setup_start_time: selectedTime });
	}
	onsetup_end_timeChange = (selectedTime) => {
		this.setState({ setup_end_time: selectedTime });
	}
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
				console.log(response);
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
		let lineItems = this.state.orderDetails?.line_items;
		console.log(lineItems)

		return (
			<SafeAreaView style={styles.container}>

				<OverlayLoader visible={this.state.loaderVisible} />

				<Header title="Update Enquiry" />
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
						
						<View style={[styles.rowContainer, { marginBottom: 0 }]}>
							<View style={styles.row}>
								<View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
									<Text style={styles.inputLable}>Event Start:</Text>
								</View>
								<View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
									<View style={{ width: "55%" }}>
										<DateAndTimePicker2
											mode={"date"}
											value={this.state.event_date}
											onChange={this.onEventDateChange}
										/>
									</View>
									<View style={styles.divider}></View>
									<View style={{ width: "45%", borderTopRightRadius: 5, }}>
										<DateAndTimePicker2
											mode={"time"}
											value={this.state.event_start_time}
											onChange={this.onevent_start_timeChange}
										/>
									</View>
								</View>
							</View>

							<View style={styles.row}>
								<View style={[styles.rowLeft]}>
									<Text style={styles.inputLable}>Event End:</Text>
								</View>
								<View style={[styles.rowRight]}>
									<View style={{ width: "55%" }}>
										<DateAndTimePicker2
											mode={"date"}
											value={this.state.event_date}
											onChange={this.onEventDateChange}
										/>
									</View>
									<View style={styles.divider}></View>
									<View style={{ width: "45%" }}>
										<DateAndTimePicker2
											mode={"time"}
											value={this.state.event_end_time}
											onChange={this.onevent_end_timeChange}
										/>
									</View>
								</View>
							</View>

							<View style={styles.row}>
								<View style={[styles.rowLeft]}>
									<Text style={styles.inputLable}>Setup:</Text>
								</View>
								<View style={[styles.rowRight]}>
									<View style={{ width: "55%" }}>
										<DateAndTimePicker2
											mode={"date"}
											value={this.state.setup_date}
											onChange={this.onSetupDateChange}
										/>
									</View>
									<View style={styles.divider}></View>
									<View style={{ width: "45%" }}>
										<DateAndTimePicker2
											mode={"time"}
											value={this.state.setup_by}
											onChange={(selectedTime) => this.setState({ setup_by: selectedTime })}
										/>
									</View>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}>Playtime:</Text>
								</View>
								<View style={[styles.rowRight, {paddingLeft: 10, paddingTop: 10}]}>
								<Text style={{ color: Colors.grey }}>{this.state?.play_time ?? 0}</Text>
								</View>
							</View>


							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.inputLable}># of Guests:</Text>
								</View>
								<View style={[styles.rowRight, {paddingLeft: 10, paddingTop: 2}]}>
								<TextInput
										value={this.state.no_guest}
										autoCompleteType="off"
										autoCapitalize="words"
										style={styles.textInput}
										onChangeText={(no_guest) => this.setState({ no_guest })}
									/>
								</View>
							</View>

							<View style={[styles.row, {borderBottomColor: Colors.white}]}>
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

						<View style={[styles.rowContainer, {marginBottom: 0}]}>

									<View style={styles.row}>
										<View style={[styles.rowLeft, {borderBottomWidth: 0.2}]}>
											<Text style={styles.inputLable}>Venue:</Text>
										</View>
										<View style={styles.rowRight}>
										<TextInput
										value={this.state.venue}
										autoCompleteType="off"
										autoCapitalize="words"
										style={[styles.textInput , {marginLeft:10}]}
										onChangeText={(venue) => this.setState({ venue })}
									/>
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
										</View>
									</View>

									<View style={[styles.row, {borderBottomColor: Colors.white}]}>
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
											paddingTop: 12
										}}

									>
										<Text style={{ fontSize: 14  , color:colors.grey}}>{(this.state.google_location == '') ? 'Select Address' : this.state.google_location}</Text>
									
									</TouchableOpacity>
										</View>
							         </View>
							
								</View>

								<View style={[styles.rowContainer, {marginBottom: 0}]}>

									<View style={styles.row}>
										<View style={[styles.rowLeft, {borderBottomWidth: 0.2}]}>
											<Text style={styles.inputLable}>Alt Name:</Text>
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
											<Text style={styles.inputLable}>Alt Mobile:</Text>
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
                                    <View style={[styles.rowContainer, {marginBottom: 0}]}>

									 <View style={{ marginBottom: 10 }}>
										<Text style={{ fontSize: 16 }}>Games</Text>
									 </View>

									 {
										lineItems?.map(item => {
											return (
												<>
													<View key={item.id} style={[styles.listRow]}>
														<View style={{ flexDirection: 'row' }}>
															<View style={{ width: "20%", borderWidth: 1, borderColor: '#dfdfdf' }}>
																<ProgressiveImage
																	key={item.id}
																	source={{ uri: item.game.image_url }}
																	style={{ height: 57, width: "100%" }}
																	resizeMode="cover"
																/>
															</View>
															<View style={{ width: "50%", paddingLeft: 10, justifyContent: 'center' }}>

																<Text style={[styles.titleText]} numberOfLines={1} ellipsizeMode="tail">
																	{item.game.name}
																</Text>
																<View style={{flexDirection: 'row',}}>
																<Text style={{ color: Colors.black, opacity: 0.6 }}>{`${item.quantity > 1 ? item.quantity + " * " : ''}`}</Text>
																	<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
																	<Text style={{ color: Colors.black, opacity: 0.6 }}>{`${Math.floor(item.price)}`}</Text>
																	<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
																</View>
															</View>
															<View style={{ width: '30%', flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 7 }}>
																<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
																<Text style={{ color: Colors.black, opacity: 0.6 }}>{item.total_amount}</Text>
																{/* <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
															</View>
														</View>
													</View>

												</>
											)
										})
									}

						</View>
						{/* ////////////// */}
						<View style={[styles.cardFooter, { flexDirection: "column",marginBottom: 0 }]}>
									<View style={styles.pricingItemContainer}>
										<Text style={styles.pricingText}>Sub Total</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.orderDetails.subtotal}</Text>
											{/* <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
										</View>
									</View>


									{
										this.state.transport_price > 0 ?
											null :
											<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
												<Text style={styles.pricingText}>Transport Charges</Text>
												<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
													<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.orderDetails.transport}</Text>
													{/* <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
												</View>
											</View>
									}


									{
										// this.state.discount == 0 ?
										// 	null :
										// 	<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
										// 		<Text style={styles.pricingText}>Discount</Text>
										// 		<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
										// 			<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
										// 			<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.orderDetails.discount}</Text>
										// 			{/* <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
										// 		</View>
										// 	</View>
									}

									<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
										<Text style={styles.pricingText}>GST 18%</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.orderDetails.total_tax}</Text>
											{/* <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
										</View>
									</View>

									<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
										<Text style={[styles.pricingText, { fontWeight: "bold" }]}>
											Total Amount
										</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.orderDetails.grand_total}</Text>
											{/* <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
										</View>
									</View>
								</View>
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

						</View>
						
						{/* <View style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: 2,
							padding: 5,
							//backgroundColor: '#f9f9f9'
						}}>
							<Text style={{ color: Colors.grey }}>Play Time: {this.state?.play_time ?? 0} Hours</Text>
						</View> */}
						<View style={{
							justifyContent: 'center',
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: 5,
						}}>

							<TouchableOpacity style={styles.submitBtn} onPress={this.updateEnquiryBtnClick}>
								<Text style={{ fontSize: 18, color: Colors.white }}>Update Enquiry</Text>
							</TouchableOpacity>
							{/* <TouchableOpacity style={[styles.submitBtn, { backgroundColor: 'grey', marginLeft: 5 }]}
								onPress={() => this.props.navigation.goBack()}>
								<Text style={{ fontSize: 18, color: Colors.white }}>Back Order</Text>
							</TouchableOpacity> */}

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
								Your changes has been reviewed and one of our representative will get back to you
							</Text>

							<TouchableOpacity
								onPress={this.gotoManageEnquiry}
								style={[styles.submitBtn, { height: 45 }]}
							>
								<Text style={{ fontSize: 18, color: Colors.white }}>
									Manage Enquiry
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
		backgroundColor: "#f5f5f5",
	},

	rowContainer: {
		paddingHorizontal: 8,
		backgroundColor: Colors.white,
		borderRadius: 4,
		margin: 10,
		marginHorizontal: 0,
	},

	rowContainerAltContact: {
		paddingHorizontal: 8,
		backgroundColor: Colors.white,
		borderRadius: 4,
		marginBottom: 10,
	},
	titleText: {
		fontSize: 14,
		color: Colors.black,
		marginBottom: 2,
		opacity: 0.8
	},

	row: {
		marginTop: 0,
		flexDirection: 'row',
		marginBottom: 0,
		borderBottomWidth: 0.6,
		borderBottomColor: '#cfcfcf'
	},

	
	rowLeft: {
		width: '47%',
		backgroundColor: '#fff',
		paddingLeft: 0,
		paddingVertical: 10,
		justifyContent: 'center',
		marginTop: 0,
	},

	rowRight: {
		flexDirection: "row",
		width: '53%',
		marginLeft: 0,
		backgroundColor: '#fff',
		marginTop: 0,
		// justifyContent: 'space-evenly',
		paddingBottom: 8,
	},

	location: {
		color: Colors.black,
		fontSize: 14,
		opacity: 0.8,

	},

	divider: {
		width: "2%",
		borderLeftWidth: 0.3,
		alignSelf: 'center',
		height: 20,
		borderLeftColor: '#444',
		opacity: 0.4
	},
	listRow: {
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
		paddingHorizontal: 5,
		paddingVertical: 5,	
 },


	activeTab: {
		backgroundColor: Colors.primary,
	},

	textInputAddress: {
		height: 52,
		fontSize: 12,
		width: "100%",
		borderWidth: 0,
		// borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		marginTop: 0.2,
		paddingRight: 10
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
		fontSize: 14,
		width: "100%",
		borderWidth: 0,
		// borderRadius: 4,
		borderColor: "#fff",
		backgroundColor: "#fff",
		marginBottom: 0,
		color: Colors.black,
		opacity: 0.8,
		
	},
	submitBtn: {
		height: 50,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5,
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
	pricingItemContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	pricingText: {
		fontSize: 14,
		color: Colors.black,
	},
	cardFooter: {
		borderRadius: 4,
		marginVertical: 10,
		// marginLeft: 10,
		// marginRight: 10,
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		marginBottom: 10,
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
	}
});