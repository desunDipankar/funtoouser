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
		this.loadCartList();
	};

	loadCartList = () => {
		this.setState({
			subtotal: 0,
			gst: 0,
			transport_price: 0,
			totalamount: 0,
			cartLoad: 1,
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
		// this.getWishlist();
		// this.addToCartlist();
		setTimeout(() => {
			this.gotoEventDetails();
		}, 1000);
		// Alert.alert("Event deleted",[
		//   { text: "Ok", onPress: () => {
		//     setTimeout(() => {  this.gotoWishList(); }, 1500)
		// setTimeout(() => {  this.addToWishlist(); }, 1000);
		//   } }
		// ])
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
		this.changeQuantity(item, value);
	};

	handleDelete =  (cusId,gameId,total,quantity) => {
		updateCart(
			cusId,
			gameId,
			total,
			quantity
		).then((response)=>{
			console.log(response)
			this.setState({
				isLoading: true
			})
		})
		.catch((error)=>{console.log(error)});
	}

	lsitItem = ({ item }) => (
		<View key={item.id.toString()} style={styles.card}>
			{console.log("quantity --> " , item.quantity)}
			<View style={{ width: "20%", marginRight: 5 }}>
				<Image
					// source={item.image_url}
					source={{ uri: Configs.NEW_COLLECTION_URL + item.image }}
					style={{ height: 57, width: "100%" }}
					resizeMode="contain"
				/>
			</View>
			<View>
				<Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
					{item.name}
				</Text>
				{/* <NumericInput
					value={parseInt(item.qty)}
					// value={this.state.value}
					minValue={0}
					// maxValue={5}
					step={1}
					// initValue={0}
					editable={false}
					totalHeight={30}
					totalWidth={90}
					//   rounded
					// valueType="real"
					onLimitReached={(isMax, msg) => console.log(isMax, msg)}
					textColor={Colors.black}
					iconStyle={{ color: Colors.black }}
					// onChange={value=>console.log(value)}
					onChange={(value) => {
						this.handleQtyChange(value, item);
					}}
					inputStyle={{ borderLeftWidth: 0, borderRightWidth: 0 }}
					containerStyle={{ marginTop: 5 }}
				/> */}

				<Dropdown style={styles.dropdown}
					items={[{ id: 1, value: this, name: "1" },
					{ id: 2, value: 2, name: "2" },
					{ id: 3, value: 3, name: "3" },
					{ id: 4, value: 4, name: "4" },
					{ id: 5, value: 5, name: "5" },
					{ id: 6, value: 6, name: "6" },
					{ id: 7, value: 7, name: "7" },
					{ id: 8, value: 8, name: "8" },
					{ id: 9, value: 9, name: "9" },
					{ id: 10, value: 10, name: "10" },
					{ id: 11, value: 11, name: "11" },
					{ id: 12, value: 12, name: "12" },
					]}
					value={item.qty}
					defaultValue={1}
					placeholder="Qty "
					
					onChange={(selectedItem) => {
						{console.log('item -->',item)}
						console.log(selectedItem.value, item)
						this.handleQtyChange(selectedItem.value, item)
						
					}}
					
				/>
				<Ionicons name="chevron-down-outline" size={15} color={Colors.grey} style={styles.down} />
			</View>
			
			<View style={styles.price}>
				<Text style={styles.titleText}>
					{/* {"Price: "} */}
					<FontAwesome name="rupee" size={13} color={Colors.black} />
					{item.rent*item.qty}
				</Text>
				<Ionicons
					onPress={() => this.handleDelete(this.context.userData.id, item.game_id, item.rent * item.qty, 0)}
					name="trash-outline" size={15} color={Colors.grey} style={styles.trash} />
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

	
	render = () => {
		if (this.state.isLoading === true) {
			return <Loader />;
		} if (this.state.isLoading === false && this.state.cartLoad === 0) {
			return (
				<SafeAreaView style={styles.container}>
					<Header title="Update Game" />

					<FlatList
						data={this.state.cartItems}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.lsitItem}
						contentContainerStyle={styles.cartDetails}
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
		backgroundColor: Colors.white,
	},
	cartDetails: {
		flex: 1,
		padding: 8,
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
		fontWeight: "bold",
		color: Colors.black,
		marginBottom: 2,
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
	},

	price: {
		width: "50%",
		left: 200
	},

	dropdown: {
		borderWidth: 0,
		borderColor: Colors.grey,
		height: 30,
		width: 50,
		top:5
	},

	icon:{
		 position: 'absolute',
		 top: 28,
		  right: 24,
		zIndex: 100, 
	},
	down:{
		// zIndex:1000,
		// position: "absolute",
		// left: 22,
		// top: 7
		zIndex: 10,
		bottom:22,
		left: 15,
	},
	trash:{
		fontSize:20,
		left: 10,
		top: 15
	}
});
