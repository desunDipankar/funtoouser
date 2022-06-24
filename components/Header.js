import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
  TouchableHighlight,
  Image,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import SearchScreen from "../screens/SearchScreen";
import Colors from "../config/colors";
import AppContext from "../context/AppContext";
import Autocomplete from "react-native-autocomplete-input";
import colors from "../config/colors";
import GetGamesByTag from "../components/GetGamesByTag";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    paddingHorizontal: 5,
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    width: "8%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerMiddle: {
    width: "50%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  headerRight: {
    minWidth: "15%",
    maxWidth: "40%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  searchModalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
  },
  seacrhModalContainer: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: Colors.white,
  },
  searchModalHeader: {
    height: 50,
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.primary,
    elevation: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerBackBtnContainer: {
    width: "20%",
    height: 50,
    paddingLeft: 8,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitleContainer: {
    width: "60%",
    height: 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    alignSelf: "center",
  },
  searchModalBody: {
    flex: 1,
    height: windowHeight - 50,
    padding: 8,
  },
  searchInputBox: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  textInput: {
    //width: "93%",
    //height: "100%",
    //marginLeft: 5,
    paddingLeft: 5,
    fontSize: 14,
    height: 50,
    borderRadius: 10,
    color: Colors.black,
  },

  quantityy: {
    color: Colors.white,
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: Colors.primary,
    width: 15,
    height: 15,
    fontSize: 10,
    borderRadius: 15 / 2,
    textAlign: "center",
    overflow: "hidden",
  },

  quantity: {
    color: Colors.primary,
    position: "absolute",
    left: 12,
    bottom: 12,
    fontWeight: "bold",
    backgroundColor: Colors.white,
    width: 15,
    height: 15,
    padding: 2,
    fontSize: 8,
    borderRadius: 15 / 2,
    textAlign: "center",
    overflow: "hidden",
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
    color: "black",
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

  modalOverlay: {
	height: windowHeight,
	backgroundColor: "rgba(0,0,0,0.2)",
	justifyContent: "flex-end",
	
},
modalContainer: {
	backgroundColor: "#fff",
	height: Math.floor(windowHeight * 0.35),
},
modalHeader: {
	height: 40,
	flexDirection: "row",
	borderTopWidth: StyleSheet.hairlineWidth,
	borderBottomWidth: StyleSheet.hairlineWidth,
	borderColor: "#ccc",
	elevation: 0.4,
	alignItems: "center",
},

modalBody: {
	flex: 1,
	paddingVertical: 8,
	
},

text:{
	fontSize: 15,
	margin: 10
}


});

const Header = (props) => {


  const navigation = useNavigation();
  const route = useRoute();
  const routeName = route.name;
  const appContext = useContext(AppContext);
  const [isVisible, setIsVisble] = useState(false)

  const toggleDrawer = () => navigation.toggleDrawer();
  const gotoBack = () => navigation.goBack();
  const gotoWishList = () => navigation.navigate("WishlistCategory");
  const gotoCart = () => navigation.navigate("Cart");
  const gotoHome = () => navigation.navigate("Home");

  const handlePress = () => {
	  setIsVisble(true)
  }

 const handleTags = (item) => {

	// navigation.navigate('TagScreen')

	// setTagId(item.tag_id)
	// setTagName(item.tag_name)
};

  return (
    <>
      <StatusBar
        barStyle={Platform.OS == "ios" ? "dark-content" : "light-content"}
        backgroundColor={Colors.primary}
      />
      <View style={styles.headerContainer}>
        {typeof props.gameDetailsIcon !== "undefined" ? (
          <>
            <TouchableOpacity
              activeOpacity={1}
              onPress={gotoHome}
              style={[
                styles.headerLeft,
                {
                  borderRightWidth: 1,
                  width: "10%",
                  borderRightColor: Colors.white,
                },
              ]}
            >
              <Ionicons name="close" size={26} color={Colors.white} />
            </TouchableOpacity>

            {props.previous_game ? (
              <TouchableOpacity
                onPress={props.previous_game_function}
                style={[
                  styles.headerLeft,
                  {
                    borderRightWidth: 1,
                    borderRightColor: Colors.white,
                    width: "10%",
                    alignItems: "center",
                  },
                ]}
              >
                <Ionicons name="arrow-back" size={26} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {props.next_game ? (
              <TouchableOpacity
                onPress={props.next_game_function}
                style={[
                  styles.headerLeft,
                  {
                    borderRightWidth: 1,
                    borderRightColor: Colors.white,
                    width: "10%",
                    alignItems: "center",
                  },
                ]}
              >
                <Ionicons name="arrow-forward" size={26} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
          </>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={routeName === "Home" ? toggleDrawer : gotoBack}
            style={styles.headerLeft}
          >
            {routeName === "Home" ? (
              <FontAwesome name="navicon" size={20} color={Colors.white} />
            ) : routeName === "TagScreen" ? (
              <View style={{ flexDirection: "row" }}>
                {/* <Ionicons name="arrow-back" size={26} color={Colors.white} /> */}
                <TouchableOpacity onPress={handlePress}>
                  <Ionicons
                    name="menu-outline"
                    size={26}
                    color={Colors.white}
					style={{marginLeft: 10}}
                  />
                </TouchableOpacity>
                <Modal
						animationType="slide"
						transparent={true}
						statusBarTranslucent={true}
						visible={isVisible}
					>
						<View style={styles.modalOverlay}>
							<View style={styles.modalContainer}>
								<View style={styles.modalHeader}>
									<TouchableOpacity
										activeOpacity={1}
										style={styles.closeBtn}
										onPress={() => setIsVisble(false)}
									>
										<Ionicons name="close" size={26} color={Colors.textColor} />
									</TouchableOpacity>
									
								</View>
								{
									props.lists.map(item => {
										return(
											<Pressable onPress={()=>props.bindTotag(item)} onPressOut={() => setIsVisble(false)}>
												<Text style={styles.text}>{item.tag_name}</Text>
											</Pressable>
										)
									})
								}
							
							</View>
						</View>
					</Modal>

					
              </View>
            ) : (
              // null
              <Ionicons name="arrow-back" size={26} color={Colors.white} />
            )}
          </TouchableOpacity>
        )}

        {routeName === "Home" ? (
          <View
            style={{
              backgroundColor: Colors.white,
              width: "92%",
              height: "70%",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              elevation: 5,
              borderRadius: 5,
              padding: 5,
            }}
          >
            <View style={{ flexDirection: "row", flex: 1 }}>
              <TouchableOpacity
                style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
                onPress={() =>
                  props.navigation.navigate("SearchScreen", { autofocus: true })
                }
                activeOpacity={0.8}
              >
                <View>
                  <Ionicons name="md-search" size={20} color={"#959595"} />
                </View>
                <View style={{ paddingLeft: 5, flex: 1 }}>
                  <Text style={{ color: "#959595", fontSize: 16 }}>
                    {"Search "}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity activeOpacity={0.5} onPress={gotoCart}>
                {/* <Feather name="shopping-cart" size={20} color={'#959595'} /> */}
                <Ionicons name="ios-cart-outline" size={24} color={"#959595"} />
                <Text style={styles.quantityy}>
                  {appContext.totalCartQuantity}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // <TouchableOpacity
          // style={{flex: 1, backgroundColor: '#fff', height: 30, justifyContent: 'center', paddingLeft: 10, borderRadius: 2}}
          // onPress={() => props.navigation.navigate("SearchScreen")}
          // activeOpacity={0.8}
          // >
          // 	<Text>Search</Text>
          // </TouchableOpacity>
          <View style={styles.headerMiddle}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 22, color: Colors.white }}
            >
              {props.title}
            </Text>
          </View>
        )}
        {routeName !== "Home" ? (
          <View style={styles.headerRight}>
            {routeName !== "Home" ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={gotoHome}
                  style={{ paddingRight: 3 }}
                >
                  <Ionicons name="home" size={20} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={gotoWishList}
                  style={{ paddingRight: 3 }}
                >
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color={Colors.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={gotoCart}
                  style={{ paddingRight: 3 }}
                >
                  <Ionicons name="ios-cart-outline" size={24} color={"white"} />
                  <Text style={styles.quantity}>
                    {appContext.totalCartQuantity}
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
            {typeof props.searchIcon !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate("SearchScreen")}
                style={{ padding: 3 }}
              >
                <Ionicons name="search" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {props.wishListIcon ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={gotoWishList}
                style={{ padding: 3 }}
              >
                <Ionicons name="heart-outline" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
            {typeof props.cartIcon !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={gotoCart}
                style={{ padding: 3 }}
              >
                <Ionicons name="cart-outline" size={22} color={Colors.white} />
                <Text style={styles.quantity}>
                  {appContext.totalCartQuantity}
                </Text>
              </TouchableOpacity>
            ) : null}
            {typeof props.sepCartIcon !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={gotoCart}
                style={{ padding: 3 }}
              >
                <Ionicons name="cart-outline" size={22} color={Colors.white} />
                <Text style={styles.quantityy}>
                  {appContext.totalCartQuantity}
                </Text>
              </TouchableOpacity>
            ) : null}
            {/* {typeof props.cartMiddleIcon !== 'undefined' ? (
							<TouchableOpacity
								activeOpacity={0.5}
								onPress={gotoCart}
								style={{ padding: 3 }}
							>
								<Ionicons name="cart-outline" size={22} color={Colors.white} />
								<Text style={[styles.quantity, { backgroundColor: '#fff', color: colors.primary, left: 18, top: 0 }]}>{appContext.totalCartQuantity}</Text>
							</TouchableOpacity>
						) : null} */}
            {typeof props.sortAction !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.sortAction}
                style={{ padding: 3 }}
              >
                <MaterialIcons name="sort" size={24} color={Colors.white} />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* {
				routeName === "Home" ?
					<View style={styles.headerContainer}>
						<TouchableOpacity
							style={{ flex: 1, backgroundColor: '#fff', height: 40, justifyContent: 'center', paddingLeft: 10, borderRadius: 2 }}
							onPress={() => props.navigation.navigate("SearchScreen", { 'autofocus': true })}
							activeOpacity={0.8}
						>
							<Ionicons name="search" size={20} color={Colors.grey} />
							<Text style={{ position: 'absolute', left: 35, color: Colors.grey }}>Search</Text>
						</TouchableOpacity>
					</View> : null
			} */}
    </>
  );
};
export default Header;
