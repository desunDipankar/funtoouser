import React from "react";
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	SafeAreaView,
	TouchableOpacity,
	Image,
	ScrollView,
	Dimensions,
	Modal,
	Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import Loader from "../components/Loader";
import EmptyScreen from "./EmptyScreen";
import GetGamesByTag from "../components/GetGamesByTag";

export default class TagScreen extends React.Component {

	constructor(props) {
		console.log("props", props)
		super(props);
		this.state = {
			list: this.props.route.params.data?.tags ?? [],
			categoryName: this.props.route.params.categoryName,
			tagId: null,
			tagName: '',
			gameData: [],
			isLoading: false,
			categoryList: [],
			isVisible: false
		};
	}


	componentDidMount() {

		console.log("props comp did mo", this.props)
		this.setState({
			tagId: this.state.list[0].tag_id,
		});
	}

	toggleTab = (item) => {
		//alert("Hi")
		console.log("ITEM****", item)
		this.setState({ tagId: item.tag_id, itemPressedId: item.tag_id, tagName: item.tag_name });
	};

	// gatoGames = (item) => this.props.navigation.navigate("GamesByTag",
	// 	{ data: { tag_id: item.tag_id, name: item.tag_name } }
	// );



	renderEmptyContainer = () => {
		return (
			<EmptyScreen props={this.props} />
		)
	}



	renderListItem = ({ item, index }) => (

		<>
			{/* <MenuSide /> */}
			<TouchableOpacity
				underlayColor={Colors.textInputBg}
				onPress={this.gatoGames.bind(this, item)}
			>
				<View style={styles.listItem}>
					<Text style={styles.name}>
						{item.tag_name}
					</Text>
					<Ionicons
						name="chevron-forward"
						size={20}
						color={Colors.textInputBorder}
					/>
				</View>
			</TouchableOpacity>
		</>
	);

	render = () => {
		let { list } = this.state;
		console.log("list-->", list);

		return (
			<>

				<SafeAreaView style={styles.container}>

					<Header
						title={this.state.categoryName}
						lists={list}
						searchIcon={true}
						bindTotag = {this.toggleTab}
					/>
					
					{this.state.isLoading ? <Loader />
						:
						<>

							<View style={styles.scroll} >

								<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexWrap: 'wrap', backgroundColor: Colors.white, paddingVertical: 5, paddingHorizontal: 5 }}>

									{/* <Ionicons style={styles.icon} name="chevron-back-outline" size={26} color={Colors.white} /> */}
									{
										list.length > 0 ?
											(list.map((item) => {
												return (
													<>

														<TouchableOpacity
															key={item.id}
															onPress={this.toggleTab.bind(this, item)}
														>

															<View style={[styles.listItem, { backgroundColor: this.state.itemPressedId == item.tag_id ? Colors.primary : Colors.white, }]} key={item.id}>
																<Text style={[styles.name, { color: this.state.itemPressedId == item.tag_id ? Colors.white : Colors.primary, }]}>
																	{item.tag_name}
																</Text>
															</View>
														</TouchableOpacity>

													</>
												)

											})

											) : null
									}
									{/* <Ionicons style={styles.icon} name="chevron-forward-outline" size={26} color={Colors.white} /> */}
								</ScrollView>
							</View>


							<GetGamesByTag tagId={this.state.tagId} tagName={this.state.tagName} />

							{/* {
							list.map(item => {
								return <Text>{item.tag_name}</Text>
							})
						} */}



						</>
					}
				</SafeAreaView>

			</>
		);
	}
}

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},

	icon: {
		top: 10,
	},

	listItem: {
		flexDirection: "row",
		justifyContent: 'space-between',
		paddingVertical: 5,
		paddingHorizontal: 8,
		borderWidth: 0.6,
		borderRadius: 3, 
		borderColor: Colors.primary,
		marginRight: 5
	},
	left: {
		width: "20%",
		justifyContent: "center",
	},
	middle: {
		justifyContent: "center",
		flex: 1,
		paddingLeft: 10
	},
	right: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	image: {
		width: '100%',
		height: 40,
	},
	name: {
		fontSize: 14,
		color: Colors.white,
	},


	scroll: {
		// backgroundColor: Colors.grey,
		// color: Colors.white,
		marginTop: 0,
	},

	galleryContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		flexWrap: "wrap",
		backgroundColor: 'red'

	},
	galleryGrid: {
		width: Math.floor((windowwidth - 10) / 3),
		height: Math.floor((windowwidth - 10) / 3),
		alignItems: "center",
		justifyContent: "center",
	},
	galleryImg: {
		width: Math.floor((windowwidth - 10) / 3),
		height: Math.floor((windowwidth - 10) / 3),
		borderWidth: 2,
		borderColor: Colors.white,

	},

	menu:{
		fontSize: 20
	}
});
