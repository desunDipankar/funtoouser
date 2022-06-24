import React, { useContext } from "react";
import { Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Colors from "../config/colors";
import CustomDrawerContent from "../components/CustomDrawer";

import MobileVerification from "../screens/MobileVerification";
import OtpVerification from "../screens/OtpVerification";
import UpdateAccount from "../screens/UpdateAccount";
import Home from "../screens/Home";
import WishList from "../screens/WishList";
import Cart from "../screens/Cart";
import ManageEnquiry from "../screens/ManageEnquiry";
import ManageOrders from "../screens/ManageOrders";
import Chat from "../screens/Chat";
import Profile from "../screens/Profile";
import GameDetails from "../screens/GameDetails";
import EventDetails from "../screens/EventDetails";
import Catalog from "../screens/Catalog";
import SubCategory from "../screens/SubCategory";
import Games from "../screens/Games";
import ReferEarn from "../screens/ReferEarn";
import AppContext from "../context/AppContext";
import EmptyScreen from "../screens/EmptyScreen";
import Logout from "../screens/Logout";
import SearchScreen from "../screens/SearchScreen";
import GamesByTag from "../screens/game/GamesByTag";
import ManageBillScreen from "../screens/manage_bill/ManageBillScreen";
import ManagePaymentScreen from "../screens/manage_bill/ManagePaymentScreen";
import OfferScreen from "../screens/OfferScreen";
import BecomeSellerScreen from "../screens/BecomeSellerScreen";
import EventBillDetail from "../screens/manage_bill/EventBillDetail";
import WishlistCategoryScreen from "../screens/WishlistCategoryScreen";
import TagScreen from "../screens/TagScreen";
import UpdateEnquiry from "../screens/UpdateEnquiry";
import ManageOrder from "../screens/ManageOrder";
import UpdateOrder from "../screens/UpdateOrder";
import UpdateGameQuantity from "../screens/UpdateGameQuantity";
import colors from "../config/colors";

const styles = StyleSheet.create({
  drawerItem: {
    marginLeft: -10,
    fontSize: 16,
  },
  activeLabel: {
    fontWeight: "bold",
  },
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const activeIconSize = 22;
const inactiveIconSize = 20;

const TabNavigation = () => {
  const context = useContext(AppContext);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.lightGrey,
        tabBarStyle: { backgroundColor: Colors.primary, },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        tabBarIcon: ({ focused, color }) => {
          let iconPkg;
          let iconName;
          let iconSize;
          if (route.name === "Homes") {
            iconName = focused ? "home" : "home-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Catalog") {
            iconName = focused ? "book" : "book-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "ManageOrders") {
            iconPkg = "MaterialCommunityIcons";
            iconName = "calendar-clock";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbox" : "chatbox-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Cart") {
            iconName = focused ? "ios-cart" : "ios-cart-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "WishlistCategory") {
            iconName = focused ? "heart-sharp" : "heart-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          }

          if (iconPkg === "MaterialCommunityIcons") {
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={iconSize}
                color={color}
              />
            );
          } else {
            return <Ionicons name={iconName} size={iconSize} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Homes" component={Stacks} />
      <Tab.Screen name="Catalog" component={Catalog} />
      <Tab.Screen
        name="ManageOrders"
        component={ManageOrders}
        options={{
          tabBarLabel: "Orders",
        }}
      />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="WishlistCategory" component={WishlistCategoryScreen} />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarBadge: context.totalCartQuantity,
          tabBarBadgeStyle: { backgroundColor: Colors.white, color: colors.primary, fontSize: 10 },
          tabBarAccessibilityLabel: 'Cart'
        }} />

    </Tab.Navigator>
  )
};

const getDrawerLabel = (focused, color, label) => {
  return (
    <Text
      style={[
        { color },
        styles.drawerItem,
        focused ? styles.activeLabel : null,
      ]}
    >
      {label}
    </Text>
  );
};

const DrawerNav = () => (
  <Drawer.Navigator
    initialRouteName={"HomePage"}
    screenOptions={{
      headerShown: false,
      drawerActiveTintColor: Colors.primary,
      drawerInactiveTintColor: Colors.black,
      drawerActiveBackgroundColor: Colors.white,
      drawerInactiveBackgroundColor: Colors.white,
      drawerItemStyle: { marginVertical: 5 },
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="HomePage"
      component={TabNavigation}
      options={{
        drawerLabel: ({ focused, color }) =>
          getDrawerLabel(focused, color, "Home"),
        drawerIcon: ({ color }) => (
          <FontAwesome name="home" size={20} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Catalog"
      component={Catalog}
      options={{
        drawerLabel: ({ focused, color }) =>
          getDrawerLabel(focused, color, "Catalog"),
        drawerIcon: ({ color }) => (
          <Ionicons name="book" size={20} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="WishlistCategory"
      component={WishlistCategoryScreen}
      options={{
        drawerLabel: ({ focused, color }) =>
          getDrawerLabel(focused, color, "Wishlist"),
        drawerIcon: ({ color }) => (
          <FontAwesome name="heart" size={20} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="ManageEnquiry"
      component={ManageEnquiry}
      options={{
        drawerLabel: ({ focused, color }) =>
          getDrawerLabel(focused, color, "Manage Enquiry"),
        drawerIcon: ({ color }) => (
          <MaterialCommunityIcons
            name="clipboard-list"
            size={20}
            color={color}
          />
        ),
      }}
    />
    <Drawer.Screen
      name="ManageOrders"
      component={ManageOrders}
      options={{
        drawerLabel: ({ focused, color }) =>
          getDrawerLabel(focused, color, "Manage Orders"),
        drawerIcon: ({ color }) => (
          <MaterialCommunityIcons
            name="calendar-clock"
            size={20}
            color={color}
          />
        ),
      }}
    />

    <Drawer.Screen
      name="ManageBill"
      component={ManageBillScreen}
      options={{
        drawerLabel: ({ focused, color }) =>
          getDrawerLabel(focused, color, "Billing"),
        drawerIcon: ({ color }) => (
          <Ionicons name="receipt" size={20} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="ManagePayment"
      component={ManagePaymentScreen}
      options={{
        drawerLabel: ({ focused, color }) =>
          getDrawerLabel(focused, color, "Payment"),
        drawerIcon: ({ color }) => (
          <FontAwesome name="money" size={20} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);


class LoginStack extends React.Component {
  static contextType = AppContext;

  render() {
    return (
      <Stack.Navigator
        initialRouteName={this.context.userData === null ? "MobileVerification" : "Home"}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >

        <Stack.Screen
          name="MobileVerification"
          component={MobileVerification}
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerification}
        />
        <Stack.Screen name="UpdateAccount" component={UpdateAccount} />
      </Stack.Navigator>
    )
  }
}

class Stacks extends React.Component {
  static contextType = AppContext;
  
  render = () => {
    return (
      <Stack.Navigator
        initialRouteName={this.context.userData === null ? "MobileVerification" : "Home"}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="EventDetails" component={EventDetails} />
        <Stack.Screen name="SubCategory" component={SubCategory} />
        <Stack.Screen name="Games" component={Games} />
        <Stack.Screen name="GameDetails" component={GameDetails} />
        <Stack.Screen name="WishlistCategory" component={WishlistCategoryScreen} />
        <Stack.Screen name="WishList" component={WishList} />
        <Stack.Screen name="ReferEarn" component={ReferEarn} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="GamesByTag" component={GamesByTag} />
        <Stack.Screen name="ManageBill" component={ManageBillScreen} />
        <Stack.Screen name="EventBillDetail" component={EventBillDetail} />
        <Stack.Screen name="ManagePayment" component={ManagePaymentScreen} />
        <Stack.Screen name="Offer" component={OfferScreen} />
        <Stack.Screen name="BecomeSeller" component={BecomeSellerScreen} />
        <Stack.Screen name="TagScreen" component={TagScreen} />
        <Stack.Screen name="ManageOrder" component={ManageOrder} />
        <Stack.Screen name="UpdateEnquiry" component={UpdateEnquiry} />
        <Stack.Screen name="UpdateGameQuantity" component={UpdateGameQuantity} />
        <Stack.Screen name="UpdateOrder" component={UpdateOrder} />
      </Stack.Navigator>
    )
  }
}


export default class Navigation extends React.Component {
  static contextType = AppContext;

  render = () => {
    return (
      <NavigationContainer>
        {this.context.userData === null ? (<LoginStack />) : (<DrawerNav />)}
      </NavigationContainer>
    );
  };
}
