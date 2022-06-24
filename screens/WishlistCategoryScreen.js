import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableHighlight,
    Image,
    FlatList, SafeAreaView,
    RefreshControl,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import Loader from "../components/Loader";
import ProgressiveImage from "../components/ProgressiveImage";
import EmptyScreen from "./EmptyScreen";
import CustomImage from "../components/CustomImage";
import { WishlistCategory, WishlistCategoryDelete } from "../services/WishlistCategoryService";
import AppContext from "../context/AppContext";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class WishlistCategoryScreen extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],
            isLoading: true,
            refreshing: false,
        };
    }

    componentDidMount = () => {
        this.focusListner = this.props.navigation.addListener("focus", () => { this.loadCategoryList() })
    };

    componentWillUnmount() {
        this.focusListner();
    }

    loadCategoryList = () => {
        this.getList();
    };


    Delete = (id) => {
        Alert.alert(
          "Are your sure?",
          "Are you sure you want to remove this category?",
          [
            {
              text: "Yes",
              onPress: () => {
                WishlistCategoryDelete({ id: id }).then(res => {
                  if (res.is_success) {
                    this.getList();
                  }
    
                }).catch((error) => {
                  Alert.alert("Server Error", error.message);
                })
              },
            },
            {
              text: "No",
            },
          ]
        );
      }

    getList = () => {
        WishlistCategory(this.context.userData.id)
            .then((response) => {
                console.log('response wishlist-->',response.data);
                this.setState({
                    categoryList: response.data,
                    isLoading: false,
                    refreshing: false,
                });
            })
            .catch((err) => {
                Alert.alert("Warning", err.message );
            });
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.getList() })
    }

    renderEmptyContainer = () => {
        return (
            <EmptyScreen props={this.props} />
        )
    }

    renderListItem = ({ item }) => {
        console.log("category list -->", item)
        let url = '';
        if (item.game_image != '') {
            url = Configs.NEW_COLLECTION_URL + item.game_image;
        } else {
            url = 'https://www.osgtool.com/images/thumbs/default-image_450.png';
        }

        return (

            <TouchableOpacity
                underlayColor={Colors.textInputBg}
                onPress={() => this.props.navigation.navigate("WishList", { data: { cat_id: item.id, name: item.name } })}
                onLongPress={() => this.Delete(item.id)}
            >
                <View style={styles.listItem}>
                    <View >
                        {/* <CustomImage
                            style={styles.image}
                            // source={{ uri: url }}
                        // resizeMode="cover"
                        /> */}
                    </View>
                    <View style={styles.middle}>
                        <Text style={styles.name}>{item.name}</Text>
                    </View>
                    <View style={styles.right}>
                        <View style={styles.qtyContainer}>
                            <Text style={styles.qty}>{item.total}</Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={Colors.textInputBorder}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    render = () => {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Wishlist" />
                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                    
                        data={this.state.categoryList}
                        keyExtractor={(item, index) => item.id}
                        renderItem={this.renderListItem}
                        ListEmptyComponent={this.renderEmptyContainer()}
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
        width: "100%",
        height: 40,
    },
    name: {
        fontSize: 18,
        color: Colors.black,
    },
    qtyContainer: {
        height: 25,
        width: 25,
        borderRadius: 100,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
    },
    qty: {
        fontSize: 14,
        color: Colors.white,
        textAlign: "center",
    },
});
