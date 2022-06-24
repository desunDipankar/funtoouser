import React from "react";
import { StyleSheet, View, ScrollView, TextInput, Text, TouchableOpacity ,SafeAreaView } from "react-native";
import Header from "../components/Header";
import Colors from "../config/colors";

export default class BecomeSellerScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            mobile: "",
            email: "",
        }
    }

    setMobile = (number) => {
        if (number?.length <= 10) {
            this.setState({ mobile: number });
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Become a seller" />
                <View style={styles.form}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.heading}>Become A Seller</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLable}> Name:</Text>
                            <TextInput
                                value={this.state.name}
                                autoCompleteType="off"
                                autoCapitalize="words"
                                style={styles.textInput}
                                onChangeText={(name) => this.setState({ name })}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLable}> Mobile Number:</Text>
                            <TextInput
                                value={this.state.mobile}
                                autoCompleteType="off"
                                autoCapitalize="words"
                                style={styles.textInput}
                                keyboardType="number-pad"
                                onChangeText={(mobile) => this.setMobile(mobile)}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLable}> Email:</Text>
                            <TextInput
                                value={this.state.email}
                                autoCompleteType="off"
                                autoCapitalize="words"
                                style={styles.textInput}
                                onChangeText={(email) => this.setState({ email })}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.submitBtn}
                        >
                            <Text style={{ fontSize: 18, color: Colors.white }

                            }>SUBMIT</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    form: {
        flex: 1,
        padding: 8,
    },

    heading: {
        fontSize: 16,
        color: Colors.black,
        fontWeight: "bold",
        marginVertical: 30,
        alignSelf: "center",
    },

    inputContainer: {
        width: "100%",
        marginBottom: 25,
    },
    inputLable: {
        fontSize: 16,
        color: Colors.black,
        marginBottom: 10,
        opacity: 0.8,
    },
    textInput: {
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: 'white',
    },
    submitBtn: {
        marginTop: 15,
        height: 45,
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },
});