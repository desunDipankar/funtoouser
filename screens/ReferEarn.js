import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Text, Image } from 'react-native';
//import { Input, Text ,Card,Button,Image, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import { Entypo } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';



export default class ReferEarn extends React.Component {

    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: "transparent" }}>
                <Header title="Invite friends" />
                <View style={styles.container}>
                    <View
                        style={styles.cardViewStyle}>
                        <View style={styles.leftContent}>
                            <MaterialIcons name="money" style={{
                                fontSize: 30,
                                color: 'silver',
                                textAlign: 'center'
                            }} />
                        </View>
                        <View style={styles.rightContent}>
                            <Text style={{
                                color: 'grey',
                                fontFamily: "sans-serif",
                                textAlign: 'justify',
                                fontSize: 16
                            }}> Refer a friend and both earn upto 10% when your friend's first order is successfully delivered. Minimum Order amount should be €100, which allows you to earn upto 30. </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center'}}>
                        <LottieView
                            ref={animation => {
                                this.animation = animation;
                                this.animation.play();
                            }}
                            style={{
                                width: 200,
                                height: 200,
                                //backgroundColor: '#eee',
                            }}
                            source={require('../assets/lottie/refer-earn.json')}
                        />
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                            Refer & Earn
                        </Text>
                        <Text style={{ marginTop: 10, color: 'grey' }}>
                            Your Referral Code
                        </Text>
                        <Text style={{
                            paddingLeft: 60,
                            paddingRight: 60,
                            borderWidth: 1,
                            borderStyle: 'dotted',
                            borderColor: "#f5a9c1",
                            color: 'grey',
                            padding: 10,
                            fontWeight: 'bold',
                            borderRadius: 10,
                            marginTop: 5,
                            backgroundColor: 'white'
                        }}>
                            LNGTJHJKJH
                        </Text>

                        <Text style={{ marginTop: 5, color: "green" }}>
                            Tab To Copy
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 30 }}>
                        <TouchableOpacity style={{
                            backgroundColor: "#c43160",
                            paddingLeft: 50,
                            paddingRight: 50,
                            padding: 10,
                            fontFamily: 'serif',
                            flexDirection: 'row',
                            color: 'white',
                            borderRadius: 10,
                        }}>

                            <Entypo name='share' style={{ height: 25, width: 25 }} size={25} color='white' />
                            <Text style={{
                                fontSize: 18,
                                color: '#FAFAFA',
                                marginLeft: 10,
                                marginTop: 2,
                                fontWeight: 'bold'
                            }}>REFFER NOW</Text>


                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );

    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#dbd5d5',
        width: '100%',
        height: '100%'
    },

    cardViewStyle: {
        borderRadius: 10,
        margin: 10,
        backgroundColor: 'white',
        marginTop: 100,
        fontFamily: 'serif',
        flexDirection: 'row',
        flexWrap: 'wrap'

    },
    rightContent: {
        width: '90%',
        padding: 10,
        //justifyContent:'center'

        // alignItems:'center'
    },

    leftContent: {
        width: '10%', justifyContent: 'center'
    }

});
