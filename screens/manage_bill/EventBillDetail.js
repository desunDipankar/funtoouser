import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Image,
    Dimensions,
    FlatList,
    Alert,
    Linking
} from "react-native";
import Colors from "../../config/colors";
import { GetEventDetail } from '../../services/EventService';
import Header from "../../components/Header";
import moment from "moment";
import OverlayLoader from "../../components/OverlayLoader";
import ProgressiveImage from "../../components/ProgressiveImage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Configs from "../../config/Configs";
//import AwesomeAlert from 'react-native-awesome-alerts';
import * as FileSystem from 'expo-file-system';
import * as Permissions from "expo-permissions";
import * as MediaLibrary from 'expo-media-library';

import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';



export default class EventBillDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props?.route?.params?.data,
            event_id: this.props?.route?.params?.data?.id,
            tax_category: 0,
            installation: "0.00",
            transport: "0.00",
            additional: "0.00",
            discount: "0.00",
            gst: "0.00",
            sub_total: "0.00",
            total_amount: "0.00",

            paid_amount: "",
            paid_status: false,
            paid_type: "",

            isSuccessModalOpen: false,
            isLoading: true,
            event_games: [],

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.loadOrderDetails();
    }


    printToFile = async () => {

        this.setState({ isLoading: true });
        let url = Configs.BASE_URL + "download/print_bill?id=" + this.state.event_id;

        Linking.openURL(url);
        this.setState({ isLoading: false });
        // const downloadResumable = FileSystem.createDownloadResumable(
        //     url,
        //     FileSystem.documentDirectory + 'invoice.pdf',
        // );
        // try {
        //     const { uri } = await downloadResumable.downloadAsync();
        //     this.saveFile(uri);

        //     this.setState({ isLoading: false });
        // } catch (e) {
        //     this.setState({ isLoading: false });
        //     Alert.alert("Message", "Try again");
        // }

    }


    saveFile = async (fileUri) => {

        const asset = await MediaLibrary.createAssetAsync(fileUri)
        await MediaLibrary.createAlbumAsync("Download", asset, false);

        // const { status } = await Permissions.askAsync();
        // if (status === "granted") {
        //     const asset = await MediaLibrary.createAssetAsync(fileUri)
        //     await MediaLibrary.createAlbumAsync("Download", asset, false);
        // }
    }

    selectPrinter = async () => {
        const printer = await Print.selectPrinterAsync();
        setSelectedPrinter(printer);
    }

    loadOrderDetails = () => {
        GetEventDetail(this.state.event_id)
            .then((response) => {
                this.setState({ isLoading: false });
                if (response.is_success) {
                    let data = response.data;
                    this.setState({
                        data: data,
                        event_games: data?.event_games ?? [],
                        tax_category: data.installation ?? 0,
                        installation: data.installation,
                        transport: data.transport,
                        additional: data.additional,
                        discount: data.discount,
                        gst: data.gst,
                        sub_total: data.sub_total,
                        total_amount: data.total_amount,
                        paid_amount: data.paid_amount,
                        paid_status: data.paid_status,
                        paid_type: data.paid_type,
                    })
                }

            })
            .catch((error) => { Alert.alert("Warring", "Internet issue") })
    }


    // UpdateEventOrder = () => {
    // 	let data = this.state;
    // 	let model = {
    // 		id: data.event_id,
    // 		installation: data.installation,
    // 		transport: data.transport,
    // 		additional: data.additional,
    // 		discount: data.discount,
    // 		gst: data.gst,
    // 		sub_total: data.sub_total,
    // 		total_amount: data.total_amount,
    // 		paid_amount: data.paid_amount,
    // 		//paid_status: data.paid_status,
    // 		paid_type: data.paid_type,
    // 	};
    // 	Alert.alert(
    // 		"Are your sure?",
    // 		"Are you sure you want to update",
    // 		[
    // 			{
    // 				text: "Yes",
    // 				onPress: () => {
    // 					UpdateEventOrder(model).then(res => {
    // 						if (res.is_success) {
    // 							this.setState({
    // 								showAlertModal: true,
    // 								alertType: "Success",
    // 								alertMessage: res.message
    // 							});
    // 							this.loadOrderDetails();
    // 						}

    // 					}).catch((error) => {
    // 						Alert.alert("Server Error", error.message);
    // 					})
    // 				},
    // 			},
    // 			{
    // 				text: "No",
    // 			},
    // 		]
    // 	);

    // }

    renderDate = (date) => {
        return moment(date, "YYYY-MM-DD").format("D/MM/YYYY");;
    }

    renderTime = (v_time) => {
        let time = moment(v_time, "HH:mm").format("hh:mm A");
        return `${time}`;
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };
    // installation: data.installation,
    // transport: data.transport,
    // additional: data.additional,
    // discount: data.discount,
    // gst: data.gst,
    // sub_total: data.sub_total,
    // total_amount: data.total_amount,

    UpdateTotalAmount = () => {

        let model = this.state;
        let sub_total = parseInt(model.sub_total);
        let installation = parseInt(model.installation);
        let transport = parseInt(model.transport);
        let additional = parseInt(model.additional);
        let discount = parseInt(model.discount);
        let charges_total = installation + transport + additional;
        let gst = this.GetGstAmount(sub_total);
        let final_amount = (sub_total + charges_total + gst) - discount;

        this.setState({
            gst: gst.toString(),
            total_amount: final_amount.toString(),
        });

    };


    GetGstAmount = (amount) => {
        return parseInt((amount * 18) / 100);
    }

    render = () => {

        return (
            <>
                {this.state.isLoading && <OverlayLoader />}
                <View style={styles.container}>
                    <Header title="Manage Bills" />
                    <View style={{ margin: 5 }}>
                        <Text style={styles.row_item}>Order# : {this.state.data.odid}</Text>
                        <Text style={{ fontWeight: 'bold' }}>Customer Details</Text>
                        <Text style={styles.row_item}>Name : {this.state.data.customer_name}</Text>
                        <Text style={styles.row_item}>Mobile Number : {this.state.data.customer_mobile}</Text>
                        <Text style={styles.row_item}>Email : {this.state.data.customer_email}</Text>
                        <Text style={styles.row_item}>GST : {this.state.data.customer_gstin}</Text>
                    </View>

                    <ScrollView>
                        {this.state.event_games?.map(item =>
                            <View key={item.id.toString()} style={styles.listRow}>
                                <View style={{ width: "20%" }}>
                                    <ProgressiveImage
                                        source={{ uri: Configs.NEW_COLLECTION_URL + item.image }}
                                        style={{ height: 57, width: "100%" }}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={{ width: "50%", paddingLeft: 10 }}>
                                    <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                                        {item.game_name}
                                    </Text>
                                    <Text style={styles.subText}>{item.quantity} Quantity</Text>
                                    {/* <Text style={styles.subText}>Rent</Text> */}
                                </View>
                                <View style={styles.qtyContainer}>
                                    <Text>Rent</Text>
                                    <Text style={styles.subText}>
                                        <FontAwesome name="rupee" size={13} color={Colors.black} />
                                        {item.total_amount}
                                    </Text>
                                </View>
                            </View>)}


                        <View style={[styles.listRow, { flexDirection: "column" }]}>

                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Text style={[styles.textInput, { fontWeight: 'bold' }]}>Sub Total:</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Text style={[styles.textInput, { backgroundColor: Colors.white }]}>
                                        <FontAwesome name="rupee" size={13} color={Colors.black} /> {this.state.sub_total}</Text>
                                </View>
                            </View>


                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.textInput}>Transport Charges:</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Text style={[styles.textInput, { backgroundColor: Colors.white }]}> {this.state.transport}</Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.textInput}>Installation Charges:</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Text style={[styles.textInput, { backgroundColor: Colors.white }]}> {this.state.installation}</Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.textInput}>Additional Charges:</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Text style={[styles.textInput, { backgroundColor: Colors.white }]}> {this.state.additional}</Text>

                                </View>
                            </View>


                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.textInput}>GST 18%:</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    {/* <TextInput
										value={this.state.gst}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(gst) => this.setState({ gst })}
										editable={false}
									/> */}
                                    <Text style={[styles.textInput, { backgroundColor: Colors.white }]}>
                                        {this.state.gst}
                                    </Text>
                                </View>
                            </View>


                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.textInput}>Discount:</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Text style={[styles.textInput, { backgroundColor: Colors.white }]}> {this.state.discount}</Text>
                                </View>
                            </View>


                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Text style={[styles.textInput, { fontWeight: 'bold' }]}>Total Amount:</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Text style={[styles.textInput, { backgroundColor: Colors.white }]}>
                                        <FontAwesome name="rupee" size={13} color={Colors.black} /> {this.state.total_amount}</Text>
                                </View>
                            </View>

                            {/* <View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.textInput}>Paid Amount:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.paid_amount}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(paid_amount) => this.setState({ paid_amount })}
                                        editable={false}

									/>
								</View>
							</View> */}

                            {this.state.paid_type == 1 &&
                                <View style={{ alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={styles.btn}
                                    //onPress={this.UpdateEventOrder}
                                    >
                                        <Text style={{ fontSize: 18, color: Colors.white }}>Pay Online</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>


                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    backgroundColor: "silver",
                                    padding: 5, borderRadius: 10, flexDirection: 'row',
                                    elevation: 10,
                                    width: '50%',
                                    justifyContent: 'space-around'
                                }}
                                onPress={this.printToFile}
                            >
                                <Text style={{ fontSize: 18, color: Colors.white }}> Download</Text>
                                <FontAwesome name="cloud-download" size={19} color={Colors.white} />
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </View>

                {/* <AwesomeAlert
					show={this.state.showAlertModal}
					showProgress={false}
					title={this.state.alertType}
					message={this.state.alertMessage}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton={false}
					showConfirmButton={true}
					cancelText="cancel"
					confirmText="Ok"
					confirmButtonColor="#DD6B55"
					onCancelPressed={() => {
						this.hideAlert();
					}}
					onConfirmPressed={() => {
						this.hideAlert();
					}}
				/> */}
            </>

        );
    }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    listRow: {
        // flexDirection: "row",
        // borderBottomColor: "#eee",
        // borderBottomWidth: 1,
        // paddingHorizontal: 5,
        // paddingVertical: 5,

        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderRadius: 4,
        elevation: 10,
        marginBottom: 10,
    },


    rowBody: {
        flex: 1,
        padding: 8,
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

    qtyContainer: {
        width: "30%",
        alignItems: "center",
        justifyContent: "center",
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
        width: '100%',
        borderRadius: 4,
    },

    row: {
        marginTop: 5,
        flexDirection: 'row'
    },
    rowLeft: {
        width: '70%',
        justifyContent: 'center',
        //backgroundColor: '#f9f9f9',
        //alignItems: 'center'
    },
    rowRight: {
        width: '30%', marginLeft: 5
    },


    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    inputLable: {
        //fontSize: 16,
        color: Colors.black,
        marginBottom: 10,
        opacity: 0.8,
    },
    textInput: {
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },


    row_item: {
        fontSize: 14,
        color: Colors.black,
        marginBottom: 3,
        fontWeight: "normal",
        opacity: 0.9,
    },

    radioItem: {

        marginLeft: 50
    },
});
