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
    TextInput

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
        this.textInput = React.createRef();
        this.state = {
            list: [],
            query: "",
            counter: 0,
        };
    }

    componentDidMount = () => {
        setTimeout(() => {
            console.log(this.textInput.current, this.props.route.params.autofocus)
            if (this.textInput.current) {
                this.textInput.current.focus();
            }
            this.setState({ 
                counter: this.state.counter + 2
            })
        }, 500);
    }


    liveSearch = (value) => {
        this.setState({ query: value })
        SearchAllType(value).then(res => {
            if (res.is_success) {
                this.setState({ list: res.data })
            } else {
                this.setState({ list: [] })
            }
        }).catch((error) => {
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
                    <Autocomplete
                        // autoFocus
                        ref={this.textInput}
                        data={this.state.list}
                        value={this.state.query}
                        autoFocus={this.props.route.params.autofocus}
                        onChangeText={(text) => this.liveSearch(text)}
                        // renderTextInput={(props) => { <TextInput ref={this.textInput}  /> }}
                        placeholder="Search"
                        style={styles.autocompleteContainer}
                        //inputContainerStyle={{borderRadius:10}}
                        listContainerStyle={{ width: "100%" }}
                        flatListProps={{
                            keyExtractor: (_, idx) => Math.random().toString(),
                            // keyExtractor={item => item.index_id},
                            renderItem: ({ item }) => {
                                let url = item.search_type == "game" ? Configs.NEW_COLLECTION_URL + item.image : Configs.CATEGORY_IMAGE_URL + item.image;
                                if (item.search_type == "tag") {
                                    url = Configs.UPLOAD_PATH + item.image;
                                }
                                return (<TouchableHighlight
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
                                </TouchableHighlight>)
                            },
                        }}
                    />
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

});
