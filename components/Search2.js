import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, FlatList, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

const Search2 = ({ navigation }) => {

    return (
        <View style={{
            flex: 1,
            marginTop: 0
        }}>
            <View style={{
                padding: 0,
                flexDirection: "row",
                justifyContent: "space-around",
                elevation: 5,

            }}>
                <TextInput
                    style={{
                        width: "70%",
                        backgroundColor: "white"
                    }}
                    

                />
            </View>

        </View>
    )
}

export default Search2