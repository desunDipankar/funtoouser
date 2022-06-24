import React from "react";
import { StyleSheet,View, SafeAreaView } from "react-native";
import Header from "../components/Header";
import Colors from "../config/colors";
import EmptyScreen from "./EmptyScreen";

export default class OfferScreen extends React.Component {
    render(){
        return(
            <SafeAreaView style={styles.container}>
                <Header title="Offers"/>
                <EmptyScreen props={this.props}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
});