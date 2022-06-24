import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import Ratings from "../components/Ratings";
import Configs from "../config/Configs";
import { gamelist_by_sub_category } from "../services/APIServices";

import Loader from "../components/Loader";
import ProgressiveImage from "../components/ProgressiveImage";
import EmptyScreen from "./EmptyScreen";

export default class Games extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: "name ASC",
      isSortModalOpen: false,
      subCategoryGameList: [],
      isLoading: true,
      sub_category_game_id: this.props.route.params.cat_id,
      sub_category_name: this.props.route.params.name,
      game_id: null,
    };
  }
  componentDidMount = () => {
    this.loadSubCategoryGameList();
  };
  loadSubCategoryGameList = () => {
    gamelist_by_sub_category(this.state.sub_category_game_id)
      .then((response) => {
        this.setState({
          subCategoryGameList: response.data,
          isLoading: false,
          // game_id: response.data[0].id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  toggleSortModal = () =>
    this.setState({ isSortModalOpen: !this.state.isSortModalOpen });

  setSortBy = (value) =>
    this.setState({
      sortBy: value,
      isSortModalOpen: false,
    });

  gotoGameDetails = (item) => {
    this.props.navigation.navigate("GameDetails", {
      game_id: item.id,
      name:item.name
    });
  };

  renderEmptyContainer = () => {
    return (
      <EmptyScreen props={this.props} />
    )
  }

  renderListItem = ({ item }) => (
    <TouchableOpacity
      onPress={this.gotoGameDetails.bind(this, item)}
      style={styles.listItemTouch}
    >
      <View style={styles.listItem}>
        <View>
          <ProgressiveImage
            style={styles.image}
            source={{ uri: Configs.SUB_CATEGORY_IMAGE_URL + item.image }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.middle}>
          <Text style={[styles.name, { alignSelf: 'center', width: "90%" }]}>{item.name}</Text>
        </View>
        <View style={{ justifyContent: 'center'}}>
          <View style={{ padding: 10, }}>
            <Text style={styles.priceText}>
              <FontAwesome name="rupee" size={16} color={Colors.black} />
              {item.rent}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
            <Ratings value={item.rating} />
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );

  render = () => {

    return (
      <SafeAreaView style={styles.container}>
        <Header title={"# "+this.state.sub_category_name} sortAction={this.toggleSortModal} />
        {this.state.isLoading ? <Loader /> :
          <FlatList
            columnWrapperStyle={{ justifyContent: 'space-evenly' }}
            data={this.state.subCategoryGameList}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderListItem}
            initialNumToRender={this.id}
            numColumns={2}
            ListEmptyComponent={this.renderEmptyContainer}
          />}

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
                  <Text>Title -- Ascending</Text>
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
                  <Text>Title -- Descending</Text>
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
                  onPress={this.setSortBy.bind(this, "price ASC")}
                >
                  <Text>Price -- Ascending</Text>
                  <Ionicons
                    name={
                      this.state.sortBy === "price ASC"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    color={Colors.primary}
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={this.setSortBy.bind(this, "price DESC")}
                >
                  <Text>Price -- Descending</Text>
                  <Ionicons
                    name={
                      this.state.sortBy === "price DESC"
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
    padding: 5,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  listItem: {
    borderBottomColor: Colors.textInputBorder,
    width: 150,
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
    flex: 1,
    //height: 50
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 100,
  },
  name: {
    fontSize: 18,
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
