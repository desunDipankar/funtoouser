import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SectionList,
	RefreshControl,
	SafeAreaView,
	Button,
	Alert,
} from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { GetEventsByGroup } from '../services/EventService';
import AppContext from "../context/AppContext";
import EmptyScreen from "./EmptyScreen";
import { GetOrderEnquiry } from "../services/OrderService";
import { showDate, showDayAsClientWant } from "../utils/Util";
import { cancel_enquiry_request } from "../services/APIServices";

export default class ManageEnquiry extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props)
		this.state = {
			enquiryLists: [],
			isLoading: false,
			refreshing: false,
		}
	}


	onPressCancel = (id) =>
    Alert.alert(
      "Alert!",
      "Do you really want to cancel?",
      [
        {
          text: "Ok",
          onPress: () => {
			cancel_enquiry_request({
				id: id,
				status: 'declined',
				reason_of_cancel: 'Customer cancelled'
			}).then((response)=>{
				console.log(response)
		
			})
			.catch((error)=>{console.log(error)});
		}
		  
        },
        // { text: "No", onPress: () => console.log("No") }
      ]
    );

	componentDidMount() {
		this.loadOrderDetails();
	}

	loadOrderDetails = () => {
		this.setState({ isLoading: true });
		GetOrderEnquiry({
			customer_id: this.context.userData.id,
			// status: 'pending'
		})
			.then((result) => {
				if (result.is_success) {
					this.setState({
						enquiryLists: result.data,
						refreshing: false
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => { this.setState({ isLoading: false }) });
	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.loadOrderDetails() })
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen props={this.props} />
		)
	}

	

	renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				key={item.order_id.toString()}
				activeOpacity={0.8}
				style={styles.card}
				onPress={() => {
					this.props.navigation.navigate('UpdateEnquiry', {
						order_id: item.id
						
					})
				}}
			>
				<Text style={styles.desc}>{"Order#: " + item.order_id}</Text>
				<Text style={styles.desc}>{"Event Date: "}{showDayAsClientWant(item.event_date)}</Text>
				<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
				<Text style={styles.desc}>
					{"Setup by: " + item.setup_by }
				</Text>
				{/* <Text style={styles.desc}>
					{"Event Time: " + moment(item.event_start_time, "HH:mm").format("hh:mm A") + ' - ' + moment(item.event_end_time, "HH:mm").format("hh:mm A")}
				</Text> */}
				<Text style={styles.desc}>
					{"Event Time: " + item.event_start_time + ' - ' + item.event_end_time}
				</Text>
				<Text style={styles.desc}>
					{"Client Name: " + (item.customer_name !== null ? item.customer_name : "")}
				</Text>
				<Text style={styles.desc}>
					Status: {item.order_status == 'pending' && <Text style={{ color: 'red' }}>Pending</Text>}
					{item.order_status == 'confirmed' && <Text style={{ color: 'green' }}>Confirmed</Text>}
					{item.order_status == 'declined' && <Text style={{ color: 'red' }}>Declined</Text>}
					{item.order_status == 'ongoing' && <Text>Ongoing</Text>}
					{item.order_status == 'completed' && <Text style={{ color: Colors.primary }}>Completed</Text>}
				</Text>
				<View style={styles.button}>

				{
					item.order_status == 'confirmed' || item.order_status == 'declined' ?
					null :
					<Button
					onPress={() => this.onPressCancel(item.id)}
					title="Cancel"
					color={Colors.primary}
				/>
				}
				
				</View>
			</TouchableOpacity>
		)
	};

	render = () => (
		<SafeAreaView style={styles.container}>
			<Header title="Manage Enquiry" />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<SectionList
					sections={this.state.enquiryLists}
					keyExtractor={(item, index) => item.order_id}
					renderItem={this.renderItem}
					contentContainerStyle={styles.listContainer}
					ListEmptyComponent={this.renderEmptyContainer}
					renderSectionHeader={({ section: { title } }) => {
						return (
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
						)
					}}
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
	},
	desc: {
		fontSize: 14,
		color: Colors.black,
		marginBottom: 3,
		fontWeight: "normal",
		opacity: 0.9,
	},

	button:{
		position: "absolute",
		right: 10,
		top: 10
	}
});
