import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../config/colors";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Configs from "../config/Configs";
import { Ionicons } from "@expo/vector-icons";

export default class GoogleAddressPickerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            searchValue: "",
            isOpen: true,
        }
    }

    // closeModal = () => {
    //     console.log("closeModal")
    // }


    closeModal = () => this.setState({ isOpen: false });

    render() {
        return (

            <Modal
                isVisible={this.props.openPickLocationModal}
                onBackdropPress={this.props.onBackdropPress}
                onRequestClose={this.props.onRequestClose}
            >
                <View style={{marginTop: 10, backgroundColor: Colors.white, borderTopLeftRadius: 10, borderTopRightRadius: 10}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.closeBtn}
                        onPress={this.props.onRequestClose}
                    >
                        <Ionicons name="close-circle-sharp" size={26} style={{opacity: 0.6}} color={Colors.black} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    backgroundColor: '#fff',
                    paddingHorizontal: 25,
                    paddingBottom: 25,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10
                }}>

                    <View style={styles.placeInputSearch}>


                        <GooglePlacesAutocomplete
                            placeholder='Type to search....'
                            onPress={(data, details = null) => {
                                this.setState({
                                    address: data.description
                                });
                            }}
                            query={{
                                key: Configs.GOOGLE_PLACE_API_KEY,
                                language: 'en',
                            }}
                            styles={{
                                textInput: {
                                    color: '#5d5d5d',
                                    fontSize: 16,
                                    borderColor: "#dfdfdf",
                                    borderWidth: 1
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb',
                                },
                            }}
                            enablePoweredByContainer={false}
                            debounce={500}
                            minLength={2}
                        />
                    </View>


                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={() => {
                            this.props.onChooseAddress(this.state.address)
                        }}
                    >
                        <Text style={{ fontSize: 18, color: Colors.white }}>
                            Select This Location
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    submitBtn: {
        marginTop: 15,
        height: 45,
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },
    placeInputSearch: {
        height: 180,
        marginBottom: 20
    },

    closeBtn: {
        width: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
    },
})