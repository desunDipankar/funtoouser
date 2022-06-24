import React from "react";
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    Dimensions,
    RefreshControl
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Ratings from "../../components/Ratings";
import Header from "../../components/Header";
import Configs from "../../config/Configs";
import { GameListByTag } from "../../services/GameApiService";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/ProgressiveImage";
import EmptyScreen from "../EmptyScreen";


export default class GamesByTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortBy: "name ASC",
            isSortModalOpen: false,
            list: [],
            isLoading: true,
            data: this.props.route.params?.data,
            refreshing: false,


            game_id: null,
            categoryID: this.props.route.params?.cat?.id,
            categoryName: this.props.route.params?.cat?.name,
            subCategoryID: this.props.route.params?.sub_cat?.id,
            tag_id: this.props.route.params?.tag_id,
            subCategoryName: this.props.route.params?.sub_cat?.name,
        };
    }
    componentDidMount = () => {
        this.LoadData(this.state.sortBy);
        this.focusListner = this.props.navigation.addListener("focus", () => { this.LoadData(this.state.sortBy) })
    };

    componentWillUnmount() {
        this.focusListner();
    }


    LoadData = (sortBy) => {
        this.GameListByTag(sortBy, "");
    }


    GameListByTag = (sortBy, cat_id) => {
        GameListByTag(this.state.data?.tag_id, sortBy, cat_id)
            .then((response) => {
                this.setState({
                    list: response.data,
                    isLoading: false,
                    refreshing: false,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.LoadData(this.state.sortBy) })
    }


    toggleSortModal = () =>
        this.setState({ isSortModalOpen: !this.state.isSortModalOpen });

    setSortBy = (value) => {
        this.setState({
            sortBy: value,
            isSortModalOpen: false,
        });
        this.LoadData(value);
    }


    gotoGameDetails = (item) => {
        this.props.navigation.navigate("GameDetails", {
            game_id: item.id,
        });
    };

    gotoEditGame = (item) => this.props.navigation.navigate("EditGame",
        {
            cat: { id: this.state.categoryID, name: this.state.categoryName },
            sub_cat: { id: this.state.subCategoryID, name: this.state.subCategoryName },
            game: item
        });

    gotoAddGame = () => this.props.navigation.navigate("AddGame",
        {
            cat: { id: this.state.categoryID, name: this.state.categoryName },
            sub_cat: { id: this.state.subCategoryID, name: this.state.subCategoryName }
        });

    renderEmptyContainer = () => {
        return (
            <EmptyScreen props={this.props} />
        )
    }


    renderListItem = ({ item }) => {

        return (
            <>
                <TouchableOpacity
                    onPress={this.gotoGameDetails.bind(this, item)}
                    style={styles.listItemTouch}
                >
                    <View style={styles.listItem}>
                        <View>
                            <ProgressiveImage
                                style={styles.image}
                                source={{ uri: Configs.SUB_CATEGORY_IMAGE_URL + item.image }}
                                resizeMode="cover"
                            />
                            
                        </View>

                        {/* <View style={{ justifyContent: 'center' }}>
                        <View style={{ padding: 10, }}>
                            <Text style={styles.priceText}>
                                <FontAwesome name="rupee" size={16} color={Colors.black} />
                                {item.rent}
                            </Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
                            <Ratings value={item.rating} />
                        </View>
                    </View> */}

                    </View>
                    <View style={styles.middle}>
                       <Text style={[styles.name, { alignSelf: 'center'}]}>₹{item.rent}</Text>
                    </View>
                    <View style={styles.bottom}>
                        <Text style={styles.text}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
            </>
        )
    };



    render = () => {
        return (
            <SafeAreaView style={styles.container}>
                <Header
                    title={"#" + this.state.data?.name}
                    addAction={this.gotoAddGame}
                    sortAction={this.toggleSortModal}
                />
                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        columnWrapperStyle={{ justifyContent: 'space-evenly' }}
                        data={this.state.list}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.renderListItem}
                        initialNumToRender={this.id}
                        numColumns={2}
                        ListEmptyComponent={this.renderEmptyContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                    />
                )}


                <Modal
                    animationType="none"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={this.state.isSortModalOpen}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={{ fontSize: 16, color: Colors.black, opacity: 0.6 }}>
                                    SORT BY
                                </Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={this.toggleSortModal}
                                >
                                    <Ionicons name="close-outline" style={styles.closeButtonText} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={this.setSortBy.bind(this, "name ASC")}
                                >
                                    <Text>Name -- Ascending</Text>
                                    <Ionicons
                                        name={
                                            this.state.sortBy === "name ASC"
                                                ? "radio-button-on"
                                                : "radio-button-off"
                                        }
                                        color={Colors.primary}
                                        size={20}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={this.setSortBy.bind(this, "name DESC")}
                                >
                                    <Text>Name -- Descending</Text>
                                    <Ionicons
                                        name={
                                            this.state.sortBy === "name DESC"
                                                ? "radio-button-on"
                                                : "radio-button-off"
                                        }
                                        color={Colors.primary}
                                        size={20}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={this.setSortBy.bind(this, "rent ASC")}
                                >
                                    <Text>Price -- Ascending</Text>
                                    <Ionicons
                                        name={
                                            this.state.sortBy === "rent ASC"
                                                ? "radio-button-on"
                                                : "radio-button-off"
                                        }
                                        color={Colors.primary}
                                        size={20}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={this.setSortBy.bind(this, "rent DESC")}
                                >
                                    <Text>Price -- Descending</Text>
                                    <Ionicons
                                        name={
                                            this.state.sortBy === "rent DESC"
                                                ? "radio-button-on"
                                                : "radio-button-off"
                                        }
                                        color={Colors.primary}
                                        size={20}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    listItemTouch: {
        borderBottomColor: Colors.textInputBorder,
        padding: 2,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
        marginBottom: 50,
        marginHorizontal: -8
        
    },
    listItem: {
        borderBottomColor: Colors.textInputBorder,
        width: 180,
        
        //justifyContent: 'flex-start'
    },
    left: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        borderWidth: 1
    },
    middle: {
        justifyContent: "center",
        alignItems: 'center',
        alignContent: 'center',
        position: "absolute",
        bottom: -10,
        zIndex:1000,
        borderWidth: 1,
        paddingVertical:5,
        paddingHorizontal:20,
        left: 50,
        backgroundColor: Colors.white,
        borderColor: Colors.lightBlue,
        // flex: 1,
        // height: 50,
    },
    bottom:{
        position: "absolute",
        bottom: -40,
        left: 60
    },

    right: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 140,
    },
    name: {
        fontSize: 16,
        color: Colors.black,
        marginBottom: 3,
    },
    priceText: {
        fontSize: 18,
        color: Colors.black,
    },
    modalOverlay: {
        height: windowHeight,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: Colors.white,
        minHeight: Math.floor(windowHeight * 0.32),
        elevation: 5,
    },
    modalHeader: {
        height: 50,
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.white,
        elevation: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    closeButton: {
        backgroundColor: "#ddd",
        width: 25,
        height: 25,
        borderRadius: 40 / 2,
        alignItems: "center",
        justifyContent: "center",
        elevation: 0,
    },
    closeButtonText: {
        color: Colors.textColor,
        fontSize: 22,
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    radioItem: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
    },
    radioLabel: {
        fontSize: 18,
        color: Colors.black,
        opacity: 0.9,
    },
    
});