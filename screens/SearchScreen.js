import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableHighlight,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    TextInput,
    FlatList

} from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import Configs from "../config/Configs";
import Autocomplete from 'react-native-autocomplete-input';
import { SearchAllType } from "../services/GameApiService";



export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        console.log(props, "*********")
        this.searchInput = React.createRef();
        this.state = {
            list: [],
            query: "",
            searchValue: '',
            isSearching: false
        };
    }

    componentDidMount = () => {
        setTimeout(() => {
            // console.log(this.searchInput.current, this.props.route.params.autofocus)
            if (this.searchInput.current) {
                this.searchInput.current.focus();
            }
            this.setState({
                counter: this.state.counter + 2
            })
        }, 500);
    }

    renderSearchItem = ({ item }) => {
        let url = item.search_type == "game" ? Configs.NEW_COLLECTION_URL + item.image : Configs.CATEGORY_IMAGE_URL + item.image;
        if (item.search_type == "tag") {
            url = Configs.UPLOAD_PATH + item.image;
        }
        return (
            <TouchableHighlight
                onPress={this.Goto.bind(this, item)}
                underlayColor={Colors.textInputBg}
            >
                <View style={styles.listItem}>
                    <View style={styles.left}>
                        <Image
                            style={styles.image}
                            source={{ uri: url }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.middle}>
                        <Text style={{ fontFamily: 'serif' }}>
                            {item.name} ({item.search_type.toString().replace("_", " ")})
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
        );
    }

    liveSearch = (value) => {
        this.setState({ query: value })
        SearchAllType(value).then(res => {
            if (res.is_success) {
                this.setState({ list: res.data, isSearching: false })
            } else {
                this.setState({ list: [], isSearching: false })
            }

        }).catch((error) => {
            this.setState({ list: [], isSearching: false })
            Alert.alert("Server Error", error.message);
        })
    }


    Goto = (data) => {

        if (data.search_type == "category") {
            this.props.navigation.navigate("SubCategory", { category_id: data.id, name: data.name })
        }

        if (data.search_type == "sub_category") {
            this.props.navigation.navigate("Games",
                {
                    cat_id: data.id,
                    name: data.name
                });
        }

        if (data.search_type == "game") {
            this.props.navigation.navigate("GameDetails", {
                game_id: data.id,
            });
        }

        if (data.search_type == "tag") {
            this.props.navigation.navigate("GamesByTag", { data: { tag_id: data.id, name: data.name } });
        }
    }

    render = () => {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
                <Header title="Search" />
                {/* <ScrollView> */}

                <View style={styles.searchModalBody}>
                    <View style={styles.searchFieldBox}>
                        <Ionicons name="search" size={24} color={Colors.textColor} />
                        <TextInput
                            ref={this.searchInput}
                            value={this.state.searchValue}
                            onChangeText={(searchValue) =>
                                this.setState(
                                    {
                                        searchValue: searchValue,
                                        isSearching: true,
                                    }, () => { this.liveSearch(searchValue) }
                                )
                            }
                            autoCompleteType="off"
                            autoCapitalize="none"
                            placeholder={"Search"}
                            style={styles.searchField}
                        />
                    </View>
                    {this.state.searchValue.trim().length > 0 ? (
                        this.state.isSearching ? (
                            <Text style={styles.searchingText}>Searching...</Text>
                        ) : (
                            <FlatList
                                data={this.state.list}
                                keyExtractor={(item, index) => item.id.toString()}
                                renderItem={this.renderSearchItem}
                                initialNumToRender={this.state.list.length}
                                keyboardShouldPersistTaps="handled"
                                ListEmptyComponent={() => (
                                    <Text style={styles.searchingText}>No Result Found</Text>
                                )}
                            />
                        )
                    ) : null}
                </View>


                {/* </ScrollView> */}
            </SafeAreaView>
        );
    }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    searchModalBody: {
        flex: 1,
        height: windowHeight - 50,
        padding: 8,
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
    },
    right: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    image: {
        width: 40,
        height: 40,
    },

    autocompleteContainer: {
        //flex: 1,
        //left: 0,
        //position: 'absolute',
        //right: 0,
        //top: 0,
        //zIndex: 1,
        //width: "100%",
        height: 45,
        padding: 10,
        //borderWidth: 1,
        //borderColor: Colors.primary,
        //borderRadius: 4,
        //flexDirection: "row",
        //alignItems: "center",
        //paddingHorizontal: 5,
        color: 'black'
    },


    searchFieldBox: {
        width: "100%",
        height: 40,
        marginTop: 8,
        paddingLeft: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 2,
    },
    searchField: {
        padding: 5,
        width: "90%",
        color: Colors.textColor,
        fontSize: 15,
    },
    searchingText: {
        fontSize: 12,
        color: Colors.textColor,
        opacity: 0.8,
        alignSelf: "center",
        marginTop: 20,
    },
    listItemContainer: {
        flexDirection: "row",
        paddingHorizontal: 6,
        paddingVertical: 5,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
    },
    titleText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.textColor,
    },
    angelIconContainer: {
        width: "15%",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    rightAngelIcon: {
        fontSize: 18,
        color: "#ddd",
    },
});
