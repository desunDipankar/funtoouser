import React from "react";
import { StyleSheet,View, SafeAreaView } from "react-native";
import Header from "../../components/Header";
import colors from "../../config/colors";

export default class ManagePaymentScreen extends React.Component {
    render(){
        return(
            <SafeAreaView style={styles.container}>
                <Header title="Payments"/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
});