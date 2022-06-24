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
import Colors from "../../config/colors";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import {GetEventsBills} from '../../services/EventService';
import AppContext from "../../context/AppContext";
import EmptyScreen from "../../screens/EmptyScreen";

export default class ManageBillScreen extends React.Component {
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

		GetEventsBills({cust_id:this.context.userData?.id})
		.then((response)=>{
			this.setState({
				orderData: response.data,
				isLoading: false,
				refreshing: false
			})
		})
		.catch((error)=>{console.log(error)})
	}

	gotoManageOrder = () => this.props.navigation.navigate("ManageOrder");

	onRefresh = () => {
		this.setState({refreshing: true},()=>{this.loadOrderDetails()})
	}

    renderEmptyContainer=()=> {
		return(
			<EmptyScreen props={this.props}/>
		)
	}


	lsitItem = ({ item }) => {
		return(
		<TouchableOpacity
			key={item.id.toString()}
			activeOpacity={0.8}
			style={styles.card}
			onPress={()=>this.props.navigation.navigate("EventBillDetail", { data: item })}
		>
			<Text style={styles.desc}>{"Event#: " + item.odid}</Text>
			<Text style={styles.desc}>{"Event Name: " + item.event_name}</Text>
			<Text style={styles.desc}>{"Event Date: " + moment(item.event_date, "YYYY-MM-DD").format('MM/DD/YYYY')}</Text>
			<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
			<Text style={styles.desc}>
				{"Setup by: " + moment(item.setup_start_time, "HH:mm").format("hh:mm A") + ' - ' + moment(item.setup_end_time, "HH:mm").format("hh:mm A")}
			</Text>
			<Text style={styles.desc}>
				{"Event Time: " + moment(item.event_start_time, "HH:mm").format("hh:mm A") + ' - ' + moment(item.event_end_time, "HH:mm").format("hh:mm A")}
			</Text>
		</TouchableOpacity>
	)};

	render = () => (
		<SafeAreaView style={styles.container}>
			<Header title="Billings" />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<SectionList
					sections={this.state.orderData}
					keyExtractor={(item, index) => item.odid}
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
									{moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
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
		backgroundColor: Colors.white,
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
});
