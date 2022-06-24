import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    Dimensions,
    RefreshControl,
    ScrollView,
    Platform
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import Carousel, { Pagination } from "react-native-x2-carousel";
import Configs from "../config/Configs";
import Loader from "./Loader";
import Colors from "../config/colors";
import { GameListByTagId } from "../services/GameApiService";
import ProgressiveImage from "../components/ProgressiveImage";
import CustomImage from "../components/CustomImage";
import { getNewArrivalsDetails, getSlider, getCategory } from "../services/APIServices";

const DATA = [
    { text: '#1' },
    { text: '#2' },
    { text: '#3' },
];

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;



export default function GetGamesByTag({ tagId, tagName }) {

    console.log("Inside tag component", tagId);

    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();
    const [gameData, setGameData] = useState([])


    useEffect(() => {
        setIsLoading(true);
        loadAll();
        GameListByTagId(tagId)
            .then((result) => {
                console.log("RESULT", result.data);
                setList(result.data);
                setIsLoading(false);
            })
            .catch((err) => console.error("Error -->", err))
            .finally(() => {
                setIsLoading(false);
            });
    }, [tagId]);

    const loadAll = () => {
        Promise.all([getNewArrivalsDetails(), getSlider(), getCategory()])
            .then((response) => {
                setGameData(response[0].data);
            })

            .catch((err) => {
                console.log(err);
            });
    }

    console.log('game data -->', gameData)



    const gotoGameDetails = (item) => {
        console.log('item id-->', item.id)

        navigation.navigate("GameDetails", {
            game_id: item.id,
        });
    }

    const renderItem = data => {
        let image_url = Configs.NEW_COLLECTION_URL + data.image;
        console.log('data --> ', data)
        return (

            <TouchableOpacity onPress={() => gotoGameDetails(data)}>
                <View key={data.id} style={styles.item}
                >

                    <Image

                        style={{ height: '100%', width: '100%' }}
                        source={{ uri: image_url }}
                        resizeMode="cover"
                    />

                </View>

            </TouchableOpacity>
        )
    };

    const renderSliderItem = (data) => {
        let image_url = Configs.SUB_CATEGORY_IMAGE_URL + data.image;
        return (
            <>

                <TouchableOpacity onPress={() => gotoGameDetails(data)}>
                    <View style={styles.item}
                    >
                        <Image

                            style={{ height: '100%', width: '100%' }}
                            source={{ uri: image_url }}
                            resizeMode="cover"
                        />

                    </View>
                </TouchableOpacity>
            </>
        )
    }


    // const renderListItem = ({ item }) => {
    //     // <View key={item.id.toString()}><Text>Game Slug {item.name}</Text></View>
    //     return (
    //         <>
    //             <TouchableOpacity
    //                 onPress={()=>gotoGameDetails(item)}
    //                 style={styles.listItemTouch}
    //             >
    //                 <View style={styles.listItem}>
    //                     <View>
    //                         <ProgressiveImage
    //                             style={styles.image}
    //                             source={{ uri: Configs.SUB_CATEGORY_IMAGE_URL + item.image }}
    //                             resizeMode="cover"
    //                         />
    //                     </View>
    //                 </View>
    //             {/* <View style={styles.middle}>
    //                    <Text style={[styles.name, { alignSelf: 'center'}]}>₹{item.rent}</Text>
    //                 </View> */}
    //             <View style={styles.bottom}>
    //                     <Text style={styles.text}>{item.name}</Text>
    //                 </View>
    //             </TouchableOpacity>
    //         </>
    //     )
    // }


    return (



        <>

            <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                {/* <MenuSlide /> */}
                {
                    isLoading ?
                        <View style={{ width: '100%', height: windowheight }}>
                            <Loader />
                        </View> :
                        <>
                            {
                                list.length > 0 ? (
                                    <>
                                        {/* <MenuSide /> */}
                                        <View style={{ width: '100%', height: 300 }}>
                                            <Carousel
                                                pagination={Pagination}
                                                renderItem={renderItem}
                                                data={list}
                                            />
                                        </View>

                                        <View style={styles.box} >
                                            <Text style={styles.title}>{tagName}</Text>
                                            <View style={styles.galleryContainer}>
                                                {list.length > 0
                                                    && list.map((item, index) => {

                                                        let image_url = Configs.SUB_CATEGORY_IMAGE_URL + item.image;
                                                        return (
                                                            <>
                                                                <TouchableOpacity
                                                                    key={item.id.toString()}
                                                                    style={[styles.galleryGrid]}
                                                                    onPress={() => gotoGameDetails(item)}
                                                                >
                                                                    <View >
                                                                        <CustomImage
                                                                            source={{ uri: image_url }}
                                                                            style={[styles.galleryImg, {width: 123, height: 119}]}
                                                                            resizeMode="contain"
                                                                        />
                                                                    </View>
                                                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: "99%", marginRight: 5 }}>
                                                                        <Text style={styles.titleText}>
                                                                            {item.name}
                                                                        </Text>
                                                                        <View style={[styles.price]}>

                                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                                                    <Text style={{ fontSize: 7, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
                                                                                    <Text style={{ color: Colors.black, opacity: 0.6, fontSize: 10 }}>{item.rent}</Text>
                                                                                    {/* <Text style={{ fontSize: 7, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                        {/* <Ionicons
						                                                        onPress={() => this.handleDelete(this.context.userData.id, item.game_id, item.rent * item.qty, 0)}
						                                                        name="trash-outline" size={15} color={Colors.grey} style={styles.trash} /> */}
                                                                    </View>
                                                                </TouchableOpacity>

                                                            </>
                                                        );
                                                    })
                                                }
                                            </View>
                                        </View>

                                    </>
                                ) :
                                    <>
                                        {/* <MenuSide /> */}
                                        <View style={{ width: '100%', height: 300 }}>
                                            <Carousel
                                                pagination={Pagination}
                                                renderItem={renderSliderItem}
                                                data={gameData}
                                            />
                                        </View>

                                        <View style={styles.box} >
                                            <Text style={styles.title}>{tagName}</Text>
                                            <View style={styles.galleryContainer}>
                                                {gameData.length > 0
                                                    && gameData.map((item, index) => {
                                                        let image_url = Configs.SUB_CATEGORY_IMAGE_URL + item.image;
                                                        return (
                                                            <TouchableOpacity
                                                                key={item.id.toString()}
                                                                style={styles.galleryGrid}
                                                                onPress={() => gotoGameDetails(item)}
                                                            >
                                                                <CustomImage
                                                                    source={{ uri: image_url }}
                                                                    style={styles.galleryImg}
                                                                    resizeMode="contain"
                                                                />
                                                                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                                                                        {item.name}
                                                                    </Text>
                                                                    <View style={[styles.price,]}>

                                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', position: 'absolute', right: 0 }}>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text style={{ color: Colors.black, opacity: 0.6 }}>{'('}</Text>
                                                                                <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
                                                                                <Text style={{ color: Colors.black, opacity: 0.6, fontSize: 12 }}>{item.rent}</Text>
                                                                                <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
                                                                                <Text style={{ color: Colors.black, opacity: 0.6 }}>{')'}</Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                    {/* <Ionicons
						                                                        onPress={() => this.handleDelete(this.context.userData.id, item.game_id, item.rent * item.qty, 0)}
						                                                        name="trash-outline" size={15} color={Colors.grey} style={styles.trash} /> */}
                                                                </View>
                                                            </TouchableOpacity>
                                                        );
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </>
                            }
                        </>
                }


            </ScrollView>

        </>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    item: {
        width: windowwidth,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemTouch: {
        borderBottomColor: Colors.textInputBorder,
        padding: 2,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
        marginBottom: 0,
        marginHorizontal: 5,
    },

    titleText: {
        fontSize: 12,
        color: Colors.black,
        opacity: 0.6
    },

    listItem: {
        borderBottomColor: Colors.textInputBorder,
        width: "100%",
        //justifyContent: 'flex-start'
    },
    left: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        borderWidth: 1,
    },

    price: {
        width: "30%",
    },
    // middle: {
    //     justifyContent: "center",
    //     alignItems: 'center',
    //     alignContent: 'center',
    //     position: "absolute",
    //     bottom: -10,
    //     zIndex: 1000,
    //     borderWidth: 1,
    //     paddingVertical: 5,
    //     paddingHorizontal: 20,
    //     left: 150,
    //     backgroundColor: Colors.white,
    //     borderColor: Colors.lightBlue,
    //     // flex: 1,
    //     // height: 50,
    // },
    // bottom: {
    //     position: "absolute",
    //     bottom: -40,
    //     left: 170
    // },

    right: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 140,
    },
    name: {
        fontSize: 16,
        color: Colors.black,
        marginBottom: 3,
    },

    text: {
        fontSize: 20
    },

    priceText: {
        fontSize: 18,
        color: Colors.black,
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
    image: {
        height: 300,
    },
    carousel: {
        height: 280,
        width: "100%",
        marginHorizontal: 0,
        borderRadius: 3,
    },
    carouselImg: {
        height: '100%',
        width: "100%",
    },

    box: {
        marginTop: 20,
        padding: 2,
    },

    galleryContainer: {
        // flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",

    },
    galleryGrid: {
        width: Platform.OS === 'android' ? Math.floor((windowwidth - 10) / 3) : Math.floor((windowwidth - 10) / 2),
        // height: Math.floor((windowwidth - 10) / 3),
        height: 150,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5,
        borderWidth: 0.5,
        borderColor: "#dfdfdf",
        marginRight: 2
    },
    galleryImg: {
        width: Platform.OS === 'android' ? Math.floor((windowwidth - 10) / 3) - 1 : Math.floor((windowwidth - 10) / 2),
        // height: Math.floor((windowwidth - 10) / 3),
        height: '90%',
    },
    title: {
        fontSize: 15,
        marginBottom: 20,
    }

});








// <SafeAreaView style={styles.container}>
        //     <FlatList
        //         data={list}
        //         keyExtractor={(item, index) => item.id.toString()}
        //         renderItem={renderListItem}
        //         initialNumToRender={10}
        //         refreshControl={
        //             <RefreshControl
        //                 refreshing={refreshing}
        //                 onRefresh={() => { }}
        //             />
        //         }
        //     />
        // </SafeAreaView>