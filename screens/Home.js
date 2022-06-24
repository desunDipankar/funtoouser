import React from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	ScrollView,
	ActivityIndicator,
	SafeAreaView,
	Platform
} from "react-native";
import Carousel, { PaginationLight } from "react-native-x2-carousel";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import { GetCategorys } from "../services/CategoryService";
import { getNewArrivalsDetails, getSlider, getCategory } from "../services/APIServices";
import AppContext from "../context/AppContext";
import Loader from "../components/Loader";
import ProgressiveImage from "../components/ProgressiveImage";
import Search2 from "../components/Search2";
import { readUserData } from "../utils/Util";
import CustomImage from "../components/CustomImage";
import CarouselItem from 'react-native-snap-carousel';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
	const value = (percentage * viewportWidth) / 100;
	return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(33.1);
const itemHorizontalMargin = wp(0.5);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class Home extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.ScrollView = React.createRef();

		this.state = {
			gameData: [],
			slider: [],
			isLoading: true,
			cust_id: [],
			categoryList: [],
			isLoading: true,
			refreshing: false
			// cust_code:this.props.route.params.cust_code,
			// cust_id:this.props.id,
			// cust_code: this.context.userData.cust_code
		};
	}

	componentDidMount = () => {
		let windowwidth = Dimensions.get("window").width;
		this.loadAll();
		this.props.navigation.addListener("focus", () => { this.loadCategoryList() })
		this.loadCategoryList();
	};

	loadCategoryList = () => {
		GetCategorys()
			.then((response) => {
				this.setState({
					categoryList: response.data,
					isLoading: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	gotoSubCategory = (item) => {

		if (item.is_tag_open == 1) {
			this.props.navigation.navigate("TagScreen",
				{ data: { tags: item.tags } });
		} else {
			this.props.navigation.navigate("SubCategory",
				{ category_id: item.id, name: item.name });
		}

	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.loadCategoryList() })
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen props={this.props} />
		)
	}

	loadAll = () => {
		Promise.all([getNewArrivalsDetails(), getSlider(), getCategory()])
			.then((response) => {
				this.setState({
					gameData: response[0].data,
					slider: response[1].data,
					categoryList: response[2].data,
					isLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	// static contextType = AppContext;
	gotoGameDetails = (item) => {
		this.props.navigation.navigate("GameDetails", {
			game_id: item.id,
			name: item.name,
			cust_code: this.context.userData.cust_code,
			cust_id: this.state.cust_id,
			// id:this.state.cust_id,
		});

	};

	gotoSubCategory = (item) => {
		if (item.is_tag_open == 1) {
			this.props.navigation.navigate("TagScreen",
				{ data: { tags: item.tags } });
		} else {
			this.props.navigation.navigate("SubCategory",
				{ category_id: item.id, name: item.name });
		}
	}

	renderCarouselItem = (item) => {
		let image_url = Configs.SLIDER_URL + item.image;
		return (
			<View key={item.id.toString()} style={{
				width: windowwidth,
				height: 300,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<Image
					style={{ height: '100%', width: "100%" }}
					source={{ uri: image_url }}
					resizeMode="contain"
				/>
			</View>
		)
	};

	renderSliderlItem = (item) => {
		let image_url = Configs.CATEGORY_IMAGE_URL + item.item.image;
		// let image_url = "https://ehostingguru.com/stage/funtoo/uploads/game/funtoo-61e7b34a32c7c.jpeg";

		return (
			<View key={item.item.id.toString()} style={styles.latestCollections}>
				<>
					<TouchableOpacity
						key={item.item.id.toString()}
						style={[styles.galleryGrid, {
							width: Math.floor((windowwidth - 10) / 3.2),
							height: Math.floor((windowwidth - 10) / 3.2),
							overflow: 'hidden',
						}]}
						onPress={this.gotoSubCategory.bind(this, item.item)}
					>
						<Image
							style={[styles.latestCollectionItemImg, { borderWidth: 0.5, borderColor: '#dfdfdf', }]}
							source={{ uri: image_url }}
							resizeMode="contain"
						/>
					</TouchableOpacity>
				</>
			</View>
		)
	};



	render = () => {

		return (
			<SafeAreaView style={styles.container}>
				<Header
					title="Welcome"
					// searchIcon={true}
					wishListIcon={true}
					cartIcon={true}
					navigation={this.props.navigation}
				/>
				{/* <Search2 /> */}
				{this.state.isLoading ? <Loader /> : <>
					<ScrollView showsVerticalScrollIndicator={false}>
					<View style={{ width: '100%', height: 295 }}>
							<Carousel
								loop={true}
								autoplay={true}
								autoplayInterval={3000}
								// pagination={PaginationLight}
								renderItem={this.renderCarouselItem}
								data={this.state.slider}

							/>
						</View>

						<View style={styles.carouselContainer}>
							<CarouselItem
								data={this.state.categoryList}
								renderItem={this.renderSliderlItem}
								sliderWidth={sliderWidth}
								itemWidth={itemWidth}
								autoplay={true}
								loop={true}
								activeSlideAlignment='start'
								inactiveSlideOpacity={1}
								inactiveSlideScale={1}
							/>
						</View>
						<View style={{ marginTop: 0 }}>
							<View style={{ flex: 1, justifyContent: 'center', paddingLeft: 5 }}>
								<View>
									<Text style={[styles.title, { marginBottom: 0, marginLeft: 0, color: "#959595", fontWeight: 'normal', fontSize: 12 }]}>	New Arrivals</Text>
								</View>
								<View style={{
									width: "30%",
									backgroundColor: 'white',
									height: 2,
									marginVertical: 3
								}}></View>
							</View>
							<View style={styles.galleryContainer}>
								{this.state.gameData.length > 0
									&& this.state.gameData.map((item, index) => {
										let image_url = Configs.NEW_COLLECTION_URL + item.image;
										console.log(image_url)
										return (
											<TouchableOpacity
												key={item.id.toString()}
												style={[styles.galleryGrid, { marginHorizontal: Platform.OS == 'ios' ? 2 : 3, backgroundColor: '#fff', height: Platform.OS == 'ios' ? 110 : 95, marginBottom: 5, borderWidth: 0.6, borderColor: "#dfdfdf", padding: 2}]}
												onPress={this.gotoGameDetails.bind(this, item)}
											>
												{Platform.OS == 'ios' ? (
													<Image
														source={{ uri: image_url }}
														style={styles.galleryImg}
														resizeMode="contain"
													/>
												) : (
													<CustomImage
														source={{ uri: image_url }}
														style={styles.galleryImg}
														resizeMode="contain"
													/>
												)}
											</TouchableOpacity>
										);
									})
								}
							</View>
						</View>
					</ScrollView>
				</>

				}
			</SafeAreaView>
		);
	}
}

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	carouselContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 100
	},
	carousel: {
		height: 250,
		width: windowwidth,
		marginHorizontal: 0,
		borderRadius: 3,

	},
	carouselImg: {
		height: 250,
		width: windowwidth,
		borderRadius: 0,

	},
	title: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.black,
		marginBottom: 10,
		marginLeft: 5,
	},
	latestCollections: {
		marginTop: 0,
		marginLeft: 0,
	},
	latestCollectionItem: {
		width: Math.floor((windowwidth - 30) / 4),
		height: 70,
		marginHorizontal: 5,
		borderRadius: 5,

	},
	latestCollectionItemImg: {
		width: Platform.OS === 'android' ? Math.floor((windowwidth - 30) / 3) : Math.floor((windowwidth - 30) / 3),
		height: Platform.OS === 'android' ? 80 : 100,
		borderRadius: 0,
	},
	// galleryContainer: {
	// 	// flex: 1,
	// 	flexDirection: "row",
	// 	alignItems: "flex-start",
	// 	flexWrap: "wrap",
	// 	marginHorizontal: 5,


	// },
	// galleryGrid: {
	// 	width: Math.floor((windowwidth - 10) / 3),
	// 	height: Math.floor((windowwidth - 10) / 4),
	// 	alignItems: "center",
	// 	justifyContent: "center",

	// },
	// galleryImg: {
	// 	width: Math.floor((windowwidth - 10) / 3),
	// 	height: Math.floor((windowwidth - 10) /4),
	// 	borderWidth: 2,
	// 	borderColor: Colors.white,
	// },

	galleryContainer: {
		// flex: 1,
		flexDirection: "row",
		alignItems: "flex-start",
		flexWrap: "wrap",

	},
	galleryGrid: {
		width: Platform.OS === 'android' ? Math.floor((windowwidth - 10) / 3.1) : Math.floor((windowwidth - 10) / 3),
		height: 110,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 1,
		// borderRadius: 5
		// borderTopLeftRadius: 
	},
	galleryImg: {
		width: Platform.OS === 'android' ? Math.floor((windowwidth - 10) / 3.2) : Math.floor((windowwidth - 10) / 3.1),
		height: "98%",
	},
	newsConatiner: {
		marginTop: 40,
		width: windowwidth - 10,
		height: 70,
		marginHorizontal: 5,
		backgroundColor: "#e0ffff",
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		borderRadius: 3,
		alignItems: "center",
		justifyContent: "center",
	},
	newsText: {
		fontSize: 14,
		color: Colors.black,
		opacity: 0.9,
	},

	text: {
		paddingBottom: 10,
		fontSize: 10,
		color: "#959595"
	}
});