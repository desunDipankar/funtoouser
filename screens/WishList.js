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
import { Wishlist, WishlistDelete } from "../services/WishlistService";
import AppContext from "../context/AppContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default class WishList extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      data: this.props?.route?.params?.data,
      list: [],
      isLoading: true,
      refreshing: false,
    };
  }

  componentDidMount = () => {
    this.focusListner = this.props.navigation.addListener("focus", () => { this.loadCategoryList() })
    this.getList();
  };

  componentWillUnmount() {
    this.focusListner();
  }

  loadCategoryList = () => {
    this.getList();
  };

  getList = () => {
    Wishlist(this.state.data.cat_id)
    
      .then((response) => {
        console.log("individual wishlist -->",response.data);
        this.setState({
          list: response.data,
          isLoading: false,
          refreshing: false,
        });
      })
      .catch((err) => {
        Alert.alert("Warning", "Network error");
      });
  }

  onRefresh = () => {
    this.setState({ refreshing: true }, () => { this.getList() })
  }

  Delete = (id) => {
    Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this game?",
      [
        {
          text: "Yes",
          onPress: () => {
            WishlistDelete({ id: id }).then(res => {
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


  gotGameDetail = (item) => {
    this.props.navigation.navigate("GameDetails", { game_id: item.id, name: item.name });
  }

  renderEmptyContainer = () => {
    return (
      <EmptyScreen props={this.props} />
    )
  }

  renderListItem = ({ item }) => {
    console.log("item to show --> ", item)
    let url = '';
    if (item.game_image != '') {
      url = Configs.NEW_COLLECTION_URL + item.image;
      console.log(url);
    } else {
      url = 'https://www.osgtool.com/images/thumbs/default-image_450.png';
    }

    return (

      <TouchableOpacity  style={styles.card}
      onPress={() => this.gotGameDetail(item)}
      onLongPress={() => this.Delete(item.item_id)}>
        <View style={{ width: "20%" }}>
          <Image
            source={{ uri: url }}
            style={{ height: 57, width: "100%" }}
            resizeMode="contain"
          />
        </View>
        <View style={{ width: "50%", paddingLeft: 10 }}>
          <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.subText}>
            {"Price: "}
            <FontAwesome name="rupee" size={13} color={Colors.black} />
            {item.rent}
          </Text>
        </View>
        <View style={styles.qtyContainer}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textInputBorder}
          />
        </View>
      </TouchableOpacity>
    )
  };

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={this.state.data?.name} />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            data={this.state.list}
            keyExtractor={(item, index) => item.id.toString()}
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
    // padding:10
  },
  cartDetails: {
    flex: 1,
    padding: 8,
  },
  card: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 10,
    marginBottom: 10,
  },
  qtyContainer: {
    width: "30%",
    alignItems: "flex-end",
    justifyContent: "center",
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
    // marginTop: 15,
    height: 50,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    elevation: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,

  },
  btnText: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.white,
  },
});
