import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SectionList,
	RefreshControl,
	SafeAreaView
} from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../components/Header";
import Loader from "../components/Loader";
import AppContext from "../context/AppContext";
import EmptyScreen from "./EmptyScreen";
import { GetOrderEnquiry } from "../services/OrderService";
import { showDate, showDayAsClientWant } from "../utils/Util";
import { GetSingleOrderEnquiry } from "../services/OrderService";

export default class ManageOrders extends React.Component {
	static contextType = AppContext;
	constructor(props){
		super(props)
		this.state = {
			orderData: [],
			isLoading: true,
			refreshing: false,
		}

	}

	componentDidMount(){
		this.loadOrderDetails();
	}

	loadOrderDetails = () => {
		GetOrderEnquiry({
			customer_id: this.context.userData.id,
			status: 'confirmed'
		}).then((response)=>{
			this.setState({
				orderData: response.data,
				isLoading: false,
				refreshing: false
			})
		})
		.catch((error)=>{console.log(error)});
	}

	gotoManageOrder = (item) => {
		this.props.navigation.navigate("ManageOrder", {
			order_id: item.id
		});
	}

	onRefresh = () => {
		this.setState({refreshing: true},()=>{this.loadOrderDetails()})
	}


	renderEmptyContainer=()=> {
		return(
			<EmptyScreen props={this.props}/>
		)
	}

	gotoUpdateOrder = (item) => {
		this.props.navigation.navigate("UpdateOrder", 
		{
			order_id: item.id
		}
	);
	}

	lsitItem = ({ item }) => {
		return(
		<TouchableOpacity
			key={item.id.toString()}
			activeOpacity={0.8}
			style={styles.card}
			onPress={ this.gotoManageOrder.bind(this, item) }
			onLongPress = { this.gotoUpdateOrder.bind(this, item)}
		>
			<Text style={styles.desc}>{"Order#: " + item.order_id}</Text>
			<Text style={styles.desc}>{"Event Date: "}{showDayAsClientWant(item.event_date)}</Text>
			<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
			<Text style={styles.desc}>
				{"Setup by: " + item.setup_by}
			</Text>
			<Text style={styles.desc}>
				{"Event Time: " + item.event_start_time + ' - ' + item.event_end_time}
			</Text>
	
			<Text style={styles.desc}>
				{"Client Name: " + (item.customer_name !== null ? item.customer_name : "")}
			</Text>
		</TouchableOpacity>
	)};

	render = () => (
		<SafeAreaView style={styles.container}>
			<Header title="Manage Orders" />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<SectionList
					sections={this.state.orderData}
					keyExtractor={(item, index) => item.order_id}
					renderItem={this.lsitItem}
					contentContainerStyle={styles.listContainer}
					ListEmptyComponent={this.renderEmptyContainer}
					renderSectionHeader={({ section: { title } }) => {
						return(
						<View style={styles.sectionHeader}>
							<View style={styles.sectionHeaderLeft}>
								<Text style={{ fontSize: 26, color: Colors.white }}>
									{moment(title, "YYYY-MM-DD").format("DD")}
								</Text>
							</View>
							<View style={styles.sectionHeaderRight}>
								<Text style={{ fontSize: 16, color: Colors.white }}>
									{moment(title, "YYYY-MM-DD").format("dddd")}
								</Text>
								<Text style={{ fontSize: 14, color: Colors.white }}>
									{showDate(title)}
								</Text>
							</View>
						</View>
					)}}
					refreshControl={
						<RefreshControl
						  refreshing={this.state.refreshing}
						  onRefresh={this.onRefresh}
						/>
					  }
				/>
			)}
			
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#d9dfe0",
	},
	listContainer: {
		padding: 8,
	},
	sectionHeader: {
		width: "100%",
		height: 50,
		flexDirection: "row",
		backgroundColor: Colors.primary,
		marginBottom: 10,
		borderRadius: 3,
	},
	sectionHeaderLeft: {
		width: "14%",
		alignItems: "flex-end",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: Colors.white,
		paddingRight: 10,
	},
	sectionHeaderRight: {
		alignItems: "flex-start",
		justifyContent: "center",
		paddingLeft: 10,
	},
	card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
		shadowColor: Colors.grey,
    	shadowOffset: {width: 2, height: 4},
    	shadowOpacity: 0.2,
    	shadowRadius: 6,
	},
	desc: {
		fontSize: 14,
		color: Colors.black,
		marginBottom: 3,
		fontWeight: "normal",
		opacity: 0.9,
	},
});
