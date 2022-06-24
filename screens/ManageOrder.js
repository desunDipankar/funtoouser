import React, { Component } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	Modal,
	FlatList,
	Image,
	TextInput,
	SafeAreaView
} from "react-native";
import ProgressiveImage from "../components/ProgressiveImage";
import Colors from "../config/colors";
import Header from "../components/Header";
import AppContext from "../context/AppContext";
import Configs from "../config/Configs";
import { GetSingleOrderEnquiry } from "../services/OrderService";
import OverlayLoader from "../components/OverlayLoader";
import { showDate, showDateAsClientWant, showDayAsClientWant } from "../utils/Util";
import { FontAwesome } from "@expo/vector-icons";
import Dropdown from "../components/DropDown";
import { Ionicons } from "@expo/vector-icons";

export default class ManageOrder extends Component {

	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			order_id: this.props.route.params.order_id,
			orderDetails: {},
			cartItems: [],
			value: 0,
			subtotal: 0,
			gst: 0,
			discount: 0,
			totalamount: 0,
			transport_price: 0,
			cartLoad: 0,
			prevCartLoad: 0,
			quantity: 0
		};
	}

	componentDidMount() {
		this.setState({ isLoading: true });
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
			.finally(() => {
				this.setState({
					isLoading: false,
				});
			});
	}


	lsitFooter = () => {
		return (
			<>

			</>
		);
	};


	render = () => {
		let lineItems = this.state.orderDetails?.line_items;
		return (
			<SafeAreaView style={styles.container}>
				<ScrollView showsVerticalScrollIndicator={false}>
					{this.state.isLoading == true ? (
						<OverlayLoader visible={this.state.isLoading} />
					) : (
							
						<>
							<View style={styles.container}>
								<Header title="Order Details" />


								<View style={[styles.rowContainer, {marginBottom: 0}]}>
									<View style={styles.row}>
										<View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
											<Text style={styles.inputLable}>Event Start:</Text>
										</View>
										<View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
											<View style={{ width: "55%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
													<Text style={[styles.location, {textAlign: 'center'}]}>{showDateAsClientWant(this.state.eventDetails?.event_date)}</Text>
												</TouchableOpacity>
											</View>
											<View style={styles.divider}></View>
											<View style={{ width: "45%", borderTopRightRadius: 5, }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.orderDetails?.event_data?.event_start_time}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>

									<View style={styles.row}>
										<View style={[styles.rowLeft]}>
											<Text style={styles.inputLable}>Event End:</Text>
										</View>
										<View style={[styles.rowRight]}>
											<View style={{ width: "55%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
													<Text style={[styles.location, {textAlign: 'center'}]}>{showDateAsClientWant(this.state.eventDetails?.event_date)}</Text>
												</TouchableOpacity>
											</View>
											<View style={styles.divider}></View>
											<View style={{ width: "45%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.orderDetails?.event_data?.event_end_time}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>

									<View style={styles.row}>
										<View style={[styles.rowLeft]}>
											<Text style={styles.inputLable}>Setup:</Text>
										</View>
										<View style={[styles.rowRight]}>
											<View style={{ width: "55%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
													<Text style={[styles.location, {textAlign: 'center'}]}>{showDateAsClientWant(this.state.eventDetails?.setup_date)}
													{/* <Text style={[{textAlign: 'center'}]}>{showDayAsClientWant(this.state.eventDetails?.setup_date)}</Text> */}
													</Text>
													
												</TouchableOpacity>
											</View>
											<View style={styles.divider}></View>
											<View style={{ width: "45%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.orderDetails?.event_data?.event_end_time}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>

									<View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Playtime:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.orderDetails?.event_data?.play_time}</Text>
											</TouchableOpacity>
										</View>
									</View>

									<View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}># of Guests:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.orderDetails?.event_data?.num_of_guest}</Text>
											</TouchableOpacity>
										</View>
									</View>

									<View style={[styles.row, {borderBottomColor: Colors.white}]}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Event Type:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.orderDetails?.event_data?.event_type_name}</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>




								<View style={[styles.rowContainer, {marginBottom: 0}]}>

									<View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Venue:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.orderDetails?.event_data?.venue}</Text>
											</TouchableOpacity>
										</View>
									</View>

									<View style={styles.row}>
									<View style={[styles.rowLeft, { borderBottomWidth: 0.1}]}>
											<Text style={styles.inputLable}>Address:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.orderDetails?.event_data?.address}</Text>
											</TouchableOpacity>
										</View>
									</View>

									<View style={styles.rowTop}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Google Location:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.orderDetails?.event_data?.google_location}</Text>
											</TouchableOpacity>
										</View>
									</View>

									{this.state.orderDetails?.event_data?.google_location ? (
										null
									) : (
										<View style={styles.row}>
											<View style={styles.rowLeft}>
												<Text style={styles.inputLable}>Landmark:</Text>
											</View>
											<View style={styles.rowRight}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 10, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.orderDetails?.event_data?.landmark ?? 'N/A'}</Text>
												</TouchableOpacity>
											</View>
										</View>
									)}

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
										this.state.discount == 0 ?
											null :
											<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
												<Text style={styles.pricingText}>Discount</Text>
												<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
													<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.orderDetails.discount}</Text>
													{/* <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
												</View>
											</View>
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
								
							</View>
						</>
					)}
				</ScrollView>
			</SafeAreaView>
		);
	};
}

const tabHeight = 50;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},

	cardUpper: {
		borderRadius: 4,
		marginVertical: 10,
		marginLeft: 10,
		marginRight: 10,
		width: "94%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		elevation: 10,
		marginBottom: 10,
	},

	cardGame: {
		borderRadius: 4,
		marginVertical: 10,
		marginLeft: 10,
		marginRight: 10,
		width: "94%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		elevation: 10,
		marginBottom: 0,
	},

	card: {
		flexDirection: "row",
		width: "100%",
		height: 75,
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
	},

	cardFooter: {
		borderRadius: 4,
		marginVertical: 10,
		marginLeft: 10,
		marginRight: 10,
		width: "95%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		marginBottom: 10,
	},
	heading: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 5,
		color: "#848482",
		fontWeight: "700",
	},

	heading2: {
		marginTop: 10,
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 5,
		color: "#848482",
		fontWeight: "700",
	},

	content: {
		color: Colors.grey,
	},

	content2: {
		color: Colors.grey,
		paddingBottom: 15,
	},

	cartDetails: {
		flex: 1,
		padding: 8,
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

	titleText: {
		fontSize: 14,
		color: Colors.black,
		marginBottom: 2,
		opacity: 0.8
	},

	dropdown: {
		borderWidth: 0,
		borderColor: Colors.grey,
		height: 30,
		width: 50,
	},

	price: {
		width: "50%",
		left: 180
	},

	down: {
		// zIndex:1000,
		// position: "absolute",
		// left: 22,
		// top: 7
		zIndex: 10,
		bottom: 22,
		left: 15,
	},
	button: {
		fontSize: 14,
		color: Colors.white,
		backgroundColor: Colors.primary,
		position: "absolute",
		right: 10,
		top: 5,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 2,
		zIndex: 1000
	},
	edit: {
		color: Colors.white,
	},
	pen: {
		top: 10,
		fontSize: 18,
	},

	listRow: {
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
		paddingHorizontal: 5,
		paddingVertical: 5,
	},

	rowContainer: {
		paddingHorizontal: 6,
		backgroundColor: Colors.white,
		borderRadius: 4,
		margin: 10,
	},
	row: {
		marginTop: 0,
		flexDirection: 'row',
		marginBottom: 0,
		borderBottomWidth: 0.6,
		borderBottomColor: '#cfcfcf'
	},

	rowTop: {
		marginTop: 0,
		flexDirection: 'row',
		marginBottom: 0,
	},
	rowLeft: {
		width: '47%',
		backgroundColor: '#fff',
		paddingLeft: 0,
		paddingVertical: 10,
		justifyContent: 'center',
		marginTop: 0,
		// paddingTop:1,
		// paddingBottom:1,
	},
	rowRight: {
		flexDirection: "row",
		width: '53%',
		marginLeft: 0,
		backgroundColor: '#fff',
		marginTop: 0,
		justifyContent: 'space-evenly',
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
		opacity: 0.8
	},
	divider: {
		width: "2%",
		borderLeftWidth: 0.3,
		alignSelf: 'center',
		height: 20,
		borderLeftColor: '#444',
		opacity: 0.4
	},
	location: {
		color: Colors.black,
		fontSize: 14,
		opacity: 0.8,
		
	},
});
