import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	FlatList,
	SafeAreaView,
	Dimensions
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import NumericInput from "react-native-numeric-input";
import Colors from "../config/colors";
import Header from "../components/Header";
import { TouchableOpacity } from "react-native-gesture-handler";
import Configs from "../config/Configs";
import { getCart, addToCart, updateCart } from "../services/APIServices";
import AppContext from "../context/AppContext";
import Loader from "../components/Loader";
import EmptyScreen from "./EmptyScreen";
import Dropdown from "../components/DropDown";
import { Ionicons } from "@expo/vector-icons";

import { MaterialIcons } from '@expo/vector-icons';

const quantity = [1, 2, 3, 4, 5]

export default class Cart extends React.Component {

	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			value: 0,
			subtotal: 0,
			gst: 0,
			discount: 0,
			totalamount: 0,
			transport_price: 0,
			cartItems: [],
			cartLoad: 0,
			prevCartLoad: 0,
			quantity: 0
		};
	}
	componentDidMount = () => {
		this.subscribe = this.props.navigation.addListener('focus', () => {
			this.loadCartList();
		});
	};

	loadCartList = () => {
		this.setState({
			subtotal: 0,
			gst: 0,
			transport_price: 0,
			totalamount: 0,
			cartLoad: 1,
			isLoading: true,
			quantity: 0
		});
		getCart(this.context.userData.id)
			.then((response) => {
				response.data.map((item, index) => {
					this.setState({
						subtotal: (parseInt(this.state.subtotal) + parseInt(item.rent) * parseInt(item.qty)),
						transport_price:
							parseInt(this.state.transport_price) +
							parseInt((item.rent * 10) / 100),
						cartLoad: 0
					}, () => this.totalAmount());

				});
				this.setState((prevState) => ({
					cartItems: response.data,
					isLoading: false
				}));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	totalAmount() {
		let model = this.state;
		let sub_total = parseInt(model.subtotal);
		let transport = parseInt(model.transport_price);
		let discount = parseInt(model.discount);
		let charges_total = transport;
		let gst = this.GetGstAmount(sub_total);
		let final_amount = (sub_total + charges_total + gst) - discount;

		this.setState({ totalamount: final_amount.toString(), gst: gst.toString() });
	}

	GetGstAmount = (amount) => {
		return parseInt((amount * 18) / 100);
	}

	changeQuantity = (item, qty) => {
		this.setState({
			isLoading: true
		});
		
		updateCart(this.context.userData.id, item.game_id, item.rent * qty, qty)
			
			.then((response) => {
				if (response.is_success) {
					this.loadCartList();
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};


	combinedButtonCLick_addCart = () => {
		setTimeout(() => {
			this.gotoEventDetails();
		}, 1000);
	};
	gotoEventDetails = () => {
		this.props.navigation.navigate("EventDetails", {
			quantity: this.state.value,
			final_price: this.state.totalamount,
			price: this.state.subtotal,
			gst: this.state.gst,
			discount: this.state.discount,
			transport: this.state.transport_price,
			cartItems: this.state.cartItems
		});
	};

	handleQtyChange = (value, item) => {
		console.log('item value', value)
		if(value === 0){
			this.context.setTotalCartQuantity(Number(this.context.totalCartQuantity) - 1);
		}
		this.changeQuantity(item, value);
	};

	handleDelete = (cusId, gameId, total, quantity) => {

		this.setState({
			isLoading: true
		});

		updateCart(
			cusId,
			gameId,
			total,
			quantity
		).then((response) => {
			if (response.is_success) {
				this.loadCartList();
			}
		})
			.catch((error) => { console.log(error) });
	}

	lsitItem = ({ item }) => {

		let data = [];
		for (let i = 1; i <= item.stock_quantity; i++) {
			data.push({ id: item.id, value: item.stock_quantity, name: i.toString() });
		}

		return (

			<View key={item.id.toString()} style={styles.card}>
				<View style={{ width: "40%", flexDirection: 'row', alignItems: 'center', }}>
					<View style={{ width: "50%", marginRight: 8 }}>
						<Image
							// source={item.image_url}
							source={{ uri: Configs.NEW_COLLECTION_URL + item.image }}
							style={{ height: 57, width: "100%", borderWidth: 0.5, borderColor: '#dfdfdf' }}
							resizeMode="cover"
						/>
					</View>
					<View>
						<Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
							{item.name}
						</Text>
						<NumericInput
							value={parseInt(item.qty)}
							// value={this.state.value}
							minValue={0}
							// maxValue={5}
							step={1}
							// initValue={0}
							editable={false}
							totalHeight={20}
							totalWidth={60}
							rounded
							// valueType="real"
							onLimitReached={(isMax, msg) => console.log(isMax, msg)}
							textColor={Colors.black}
							iconStyle={{ color: Colors.black }}
							// onChange={value=>console.log(value)}
							onChange={(value) => {
								this.handleQtyChange(value, item);
							}}
							inputStyle={{ borderLeftWidth: 0, borderRightWidth: 0 }}
							// borderColor={'#dfdfdf'}
							containerStyle={{ marginTop: 5 }}
							rightButtonBackgroundColor={"#dfdfdf"}
							leftButtonBackgroundColor={"#dfdfdf"}
						/>

						{/* <Dropdown style={styles.dropdown}
		
						items={data}
						
						value={item.qty}
						// defaultValue={1}
						placeholder="Qty "
						
						onChange={(selecitetedItem) => {
							let selectedValue = selecitetedItem.value;
							console.log("selected item value -->",selectedValue)
							this.handleQtyChange(selectedValue, item)
							
						}}
						
					/>
					<Ionicons name="chevron-down-outline" size={15} color={Colors.grey} style={styles.down} /> */}
					</View>
				</View>

				<View style={[styles.price,]}>

					<View style={{ flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', right: 0, top: 7 }}>
						<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
							<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
							<Text style={{ color: Colors.black, opacity: 0.6 }}>{item.rent * item.qty}</Text>
							<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
						</View>
					</View>

					{/* <Ionicons
						onPress={() => this.handleDelete(this.context.userData.id, item.game_id, item.rent * item.qty, 0)}
						name="trash-outline" size={15} color={Colors.grey} style={styles.trash} /> */}
				</View>
				<View style={styles.qtyContainer}>
					{/* <MaterialIcons
			  name="delete"
			  size={24}
			  color={Colors.danger}
			  onPress={this.combinedButtonCLick_clearCart}
			/> */}

				</View>
			</View>
		);
	}


	lsitFooter = () => {
		return (
			<>
				<View style={[styles.cardFooter, { flexDirection: "column" }]}>
					<View style={styles.pricingItemContainer}>
						<Text style={styles.pricingText}>Sub Total</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
							<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
							<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.subtotal}</Text>
							<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
						</View>
					</View>

					{
						this.state.transport_price > 0 ?
							null :
							<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
								<Text style={styles.pricingText}>Transport Charges</Text>
								<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
									<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
									<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.transport_price}</Text>
									<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
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
									<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.discount}</Text>
									<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
								</View>
							</View>
					}

					<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
						<Text style={styles.pricingText}>GST 18%</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
							<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
							<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.gst}</Text>
							<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
						</View>
					</View>
					<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
						<Text style={[styles.pricingText, { fontWeight: "bold" }]}>
							Total Amount
						</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
							<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
							<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.totalamount}</Text>
							<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
						</View>
					</View>
				</View>

				<TouchableOpacity
					style={styles.btn}
					onPress={this.combinedButtonCLick_addCart}
				>
					<Text style={{ fontSize: 18, color: Colors.white }}>NEXT</Text>
				</TouchableOpacity>
			</>
		);
	};

	render = () => {
		if (this.state.isLoading === true) {
			return <Loader />;
		} 
		
		if (this.state.isLoading === false && this.state.cartLoad === 0) {
			return (
				<SafeAreaView style={styles.container}>
					<Header
						title=" "
						cartMiddleIcon={true}
					/>

					<FlatList
						data={this.state.cartItems}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.lsitItem}
						contentContainerStyle={styles.cartDetails}
						ListFooterComponent={this.lsitFooter.bind(this)}
						extraData={this.state.cartItems.length > 0}
					/>
				</SafeAreaView>
				
			);
		}
		else if (this.state.cartLoad === 1) {
			return (
				<EmptyScreen props={this.props} />
			);
		}
	};
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F4F4F4"
	},
	cartDetails: {
		flex: 1,
		padding: 0,
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
		marginBottom: 5,
	},

	cardFooter: {
		flexDirection: "row",
		width: "100%",
		height: 90,
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
	},
	qtyContainer: {
		width: "30%",
		alignItems: "center",
		justifyContent: "center",
	},
	titleText: {
		fontSize: 14,
		color: Colors.black,
	},
	subText: {
		fontSize: 13,
		color: Colors.black,
		opacity: 0.9,
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
	btn: {
		marginTop: 15,
		height: 50,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
		marginHorizontal: 10
	},

	price: {
		width: "60%",
	},

	dropdown: {
		borderWidth: 0,
		borderColor: Colors.grey,
		height: 30,
		width: 35,
		top: 5,
		zIndex: 1000
	},

	icon: {
		position: 'absolute',
		top: 28,
		right: 24,
	},
	down: {
		bottom: 18,
		left: 17,
	},
	trash: {
		fontSize: 20,
		left: 10,
		top: 15
	}
});
