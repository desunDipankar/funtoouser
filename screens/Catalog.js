import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
	Image,
	FlatList,
	ActivityIndicator,
	SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import { GetCategorys } from "../services/CategoryService";
import Loader from "../components/Loader";
import ProgressiveImage from "../components/ProgressiveImage";
import EmptyScreen from "./EmptyScreen";

export default class Catalog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoryList: [],
			isLoading: true,
			refreshing: false
		};
	}

	componentDidMount = () => {
		this.props.navigation.addListener("focus", () => { this.loadCategoryList() })
		this.loadCategoryList();
	};

	loadCategoryList = () => {
		GetCategorys()
			.then((response) => {
				console.log("response -->", response.data);
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

	renderListItem = ({ item, index }) => (
		<>
			{

				//  this.state.categoryList.length > 0
				// ? 

				// this.state.categoryList.map((item, index) => {
				//     let image_url = Configs.CATEGORY_IMAGE_URL + item.image;
				// 	let name_url = Configs.CATEGORY_IMAGE_URL + item.name;
				// 	console.log(image_url);
				//     console.log(name_url);
				//     return (
				<TouchableHighlight
					underlayColor={Colors.textInputBg}
					onPress={this.gotoSubCategory.bind(this, item)}
				>
					<View style={styles.listItem}>
						<View style={styles.left}>
							<ProgressiveImage
								style={styles.image}
								source={{ uri: Configs.CATEGORY_IMAGE_URL + item.image }}
								resizeMode="cover"
							/>
						</View>
						<View style={styles.middle}>
							<Text style={styles.name}>
								{item.name}
							</Text>
						</View>
						<View style={styles.right}>
							<Ionicons
								name="chevron-forward"
								size={20}
								color={Colors.textInputBorder}
							/>
						</View>
					</View>
				</TouchableHighlight>
				// );
				// })
				//   : null
			}
		</>
	);

	render = () => {

		return (
			<SafeAreaView style={styles.container}>
				<Header title="Category" />
				{this.state.isLoading ? <Loader />
					: <FlatList
						data={this.state.categoryList}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderListItem}
						initialNumToRender={this.id}
						ListEmptyComponent={this.renderEmptyContainer}
					/>}

			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	listItem: {
		flexDirection: "row",
		borderBottomColor: Colors.textInputBorder,
		borderBottomWidth: 1,
		padding: 10,
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
		height: 50,
	},
	name: {
		fontSize: 18,
		color: Colors.black,
	},
});
