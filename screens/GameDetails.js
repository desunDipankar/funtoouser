import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { readUserData } from "../utils/Util";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import { gamedetails, addWishList, addToCart } from "../services/APIServices";
import AppContext from "../context/AppContext";
import CheckBox from "@react-native-community/checkbox";
import Loader from "../components/Loader";
import ProgressiveImage from "../components/ProgressiveImage";
import {
  WishlistCategory,
  WishlistCategoryCreate,
} from "../services/WishlistCategoryService";
import AwesomeAlert from "react-native-awesome-alerts";
import { WishlistCreate } from "../services/WishlistService";
import CustomImage from "../components/CustomImage";
import ImageView from "react-native-image-viewing";
// import { Video } from "expo-av";
// import YouTube from 'react-native-youtube';
import YoutubePlayer from 'react-native-youtube-iframe';


export default class GameDetails extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      GameDetails: [],
      id: this.props.route.params?.cust_id,
      cust_code: this.props.route.params?.cust_code,
      isLoading: true,
      game_id: this.props.route.params?.game_id,
      game_name: this.props.route.params?.name,
      game_ids: null,
      WishList: [],
      cartList: [],
      Ionicons: "heart-outline",
      heart_color: Colors.white,
      wishlistText: " Add to Wishlist",
      qty: 1,
      categoryList: [],
      isOpenCategoryModal: false,
      isOpenCategoryAddModal: false,
      cat_name: "",

      showAlertModal: false,
      alertMessage: "",
      alertType: "",
      wishlist_id: "",

      selectedGalleryImageIndex: 0,
      selectedGalleryItemID: undefined,
      isGalleryImageViewerOpen: false,
      isPlaybackModalOpen: false,
      playbackURI: undefined,
      videoid: '',
      splitUrl:''

    };

  }
  componentDidMount = () => {

    Promise.all([this.loadGameDetails(), this.WishlistCategory(), ]);
  };
  videoIdRtrive = () => {
    //  let splitUrl = this.state.GameDetails.game[0].video_link
    this.setState({
      splitUrl :  this.state.GameDetails.game[0].video_link
    }, () => {
      let urlsplit = this.state.splitUrl.split('=')
      this.setState({
        videoid:urlsplit[1]
      }, () => {
        // console.log('video code ' ,  this.state.videoid)
      })
      // console.log('spilt url ' , this.state.splitUrl)
    })
      
    }
  toggleCategoryModal = () =>
    this.setState({ isOpenCategoryModal: !this.state.isOpenCategoryModal });

  toggleCategoryAddModal = () =>
    this.setState({
      isOpenCategoryAddModal: !this.state.isOpenCategoryAddModal,
    });

  renderEmptyContainer = () => {
    return <EmptyScreen />;
  };

  WishlistCategory = () => {
    WishlistCategory(this.context.userData.id)
      .then((response) => {
        this.setState({
          categoryList: response.data,
          isLoading: false,
          refreshing: false,
        });

      })
      .catch((err) => {
        Alert.alert("Warning", "Network error");
      });
  };

  loadGameDetails = () => {
    gamedetails(this.state.game_id)
      .then((response) => {
        console.log("Game Details Reposne ***********", response)
        this.setState(
          {
            GameDetails: response.data,
            // wishlist_game_id:response.data.game[0].game_code,
            isLoading: false,
          },
          // () => this.WishlistCategory()
          () => {
            this.videoIdRtrive()
            console.log('video link>>>>>>>>>>>>' ,this.state.GameDetails.game[0].video_link)
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };


  goPrev = (game_id, name) => {
    this.props.navigation.push("GameDetails", {
      game_id: game_id,
      name: name,
    });
  }

  goNext = (game_id, name) => {
    this.props.navigation.push("GameDetails", {
      game_id: game_id,
      name: name,
    });
  }


  addToWishlist = (game_id, wishlist_id) => {
    addWishList(
      { game_id, wishlist_id }
    )
      .then((response) => {
        this.setState({
          WishList: response.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  WishlistCreateHandle = (game_id, wishlist_id) => {
    Alert.alert("Are your sure?", "Are you sure you want to add this game?", [
      {
        text: "Yes",
        onPress: () => {
          this.addToWishlist(game_id, wishlist_id);
        },
      },
      {
        text: "No",
      },
    ]);
  };

  WishlistCreate = () => {
    let model = {
      // cat_id: cat_id,
      customer_id: this.context.userData.id,
      name: this.state.cat_name,
      // game_id: this.state.game_id,
    };
    // this.setState({
    //   isLoading: true
    // });
    WishlistCreate(model)
      .then((res) => {
        this.setState({
          isLoading: false,
        });
        if (res.is_success) {

          this.setState({
            isOpenCategoryAddModal: false,
            isOpenCategoryModal: false,
            showAlertModal: true,
            alertType: "Success",
            alertMessage: res.message,
          });
        } else {
          this.setState({
            showAlertModal: true,
            alertType: "Error",
            alertMessage: res.message,
          });
        }
      })
      .catch((error) => {
        Alert.alert("Server Error", error.message);
      });
  };

  WishlistCategoryCreate = () => {
    let model = {
      name: this.state.cat_name,
      customer_id: this.context.userData.id,
      game_id: this.state.game_id,
    };
    // this.setState({
    //   isLoading: true
    // });
    WishlistCategoryCreate(model)
      .then((res) => {
        this.setState({
          isLoading: false,
          WishList: res.data
        });
        if (res.is_success) {
          this.WishlistCategory();
          this.setState({
            isOpenCategoryAddModal: false,
            isOpenCategoryModal: true,
            cat_name: "",
            showAlertModal: true,
            alertType: "Success",
            alertMessage: res.message,
          });
        } else {
          this.setState({
            showAlertModal: true,
            alertType: "Error",
            alertMessage: res.message,
          });
        }
      })
      .catch((error) => {
        Alert.alert("Server Error", error.message);
      });
  };

  hideAlert = () => {
    this.setState({
      showAlertModal: false,
    });
  };

  addToCartlist = () => {
    let data = {
      game_id: this.state.GameDetails.game[0].id,
      cust_id: this.context.userData.id,
      price: this.state.GameDetails.game[0].rent,
      qty: this.state.qty,

    };

    addToCart(data)
      .then((response) => {
        this.context.setTotalCartQuantity(Number(this.context.totalCartQuantity) +1);
        this.setState({
          showAlertModal: true,
          alertType: response.is_success ? "Success" : "Error",
          alertMessage: response.message,
        });

      })
      .catch((err) => {
        console.log(err);
      });
  };

  getGalleryImages = () => {
    console.log('gallery iamges -->', this.state.GameDetails)
    let { image } = this.state.GameDetails;
    let data = (image || []).map((item) => {
      return {
        id: item.id,
        uri: Configs.GAME_GALLERY_IMAGE_URL + item.image,
      };
    });
    return data;
  };

  openGalleryImageViewer = (id) => {
    let galleryImages = this.getGalleryImages();
    let index = galleryImages.findIndex((item) => item.id === id);

    this.setState({
      selectedGalleryImageIndex: index > -1 ? index : 0,
      isGalleryImageViewerOpen: true,
    });
  };

  closeGalleryImageViewer = () =>
    this.setState({
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
    });

  openPlaybackModal = (uri) => {
    console.log("YOUTUBE URI------", uri)
    this.setState({
      isPlaybackModalOpen: true,
      playbackURI: uri,
    })
  };

  closePlaybackModal = () =>
    this.setState({
      isPlaybackModalOpen: false,
      playbackURI: undefined,
    });

  render = () => {
    if (this.state.GameDetails.length == 0) {
      return null;
    }

    let url = "";
    if (this.state.GameDetails.hasOwnProperty("game")) {
      url = Configs.NEW_COLLECTION_URL + this.state.GameDetails.game[0].image;
    }
    if (this.state.GameDetails.hasOwnProperty("image")) {
    }
    if (this.state.GameDetails.hasOwnProperty("tag")) {
    }
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={""}
          gameDetailsIcon={true}
          previous_game={this.state.GameDetails.previous_game}
          next_game={this.state.GameDetails.next_game}
          previous_game_function={() => this.goPrev(this.state.GameDetails.previous_game.id, this.state.GameDetails.previous_game.name)}
          next_game_function={() => this.goNext(this.state.GameDetails.next_game.id, this.state.GameDetails.next_game.name)}
        />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            <View style={styles.gameBannerContainer}>
              <ProgressiveImage
                source={{ uri: url }}
                resizeMode="contain"
                style={styles.gameBanner}
              />
            </View>

            <View style={styles.gameDetails}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.gameTitle}>
                  {this.state.GameDetails.game[0].name}
                </Text>
                <Text style={{ fontSize: 12, fontStyle: 'italic' }}>{`(Product ID: G000${this.state.GameDetails.game[0].id})`}</Text>
              </View>

              <View style={{ height: 100, marginTop: 10, }}>
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                  <Text style={styles.gameDesc}>
                    {this.state.GameDetails.game[0].description}
                  </Text>
                </ScrollView>
              </View>

              <View style={styles.galleryContainer}>
                {this.state.GameDetails.image.length > 0
                  ? this.state.GameDetails.image.map((item, index) => {
                    let url = Configs.GAME_GALLERY_IMAGE_URL + item.image;
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        key={item.id.toString()}
                        style={styles.galleryGrid}
                        onPress={this.openGalleryImageViewer.bind(this, item.id)}
                      >
                        {Platform.OS == 'ios' ? (
                          <Image
                            source={{ uri: url }}
                            style={styles.galleryImg}
                            resizeMode="contain"
                          />
                        ) : (
                          <CustomImage
                            source={{ uri: url }}
                            style={styles.galleryImg}
                            resizeMode="contain"
                          />
                        )}

                      </TouchableOpacity>
                    );
                  })
                  : null}

                {this.state.GameDetails.game[0].video_link ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.galleryGrid, { backgroundColor: "#d1d1d1", }]}
                    onPress={this.openPlaybackModal.bind(this, this.state.GameDetails.game[0].video_link)}
                  >
                    <Ionicons
                      name="play-circle-outline"
                      size={60}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ) : null}

              </View>

              <View style={{ marginTop: 20 }}>
                <View style={{ marginBottom: 5, flexDirection: 'row' }}>
                  <Text style={[styles.gameDataText]}>{'Price: '}</Text>
                  <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
                  <Text style={[styles.gameDataText]}>
                    {`${this.state.GameDetails.game[0].rent}`}
                  </Text>
                  <Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
                </View>

                <View style={{ marginBottom: 5 }}>
                  <Text style={styles.gameDataText}>
                    Size: {this.state.GameDetails.game[0].size}
                  </Text>
                </View>

                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.gameDataText}>
                      {"Tags: "}
                    </Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                      {this.state.GameDetails.tag.length > 0
                        ? this.state.GameDetails.tag.map((item, index) => {
                          return (
                            <View style={{ borderWidth: 1, padding: 5, marginRight: 2, borderRadius: 3, borderColor: '#cfcfcf' }}>
                              <Text
                                style={[styles.gameDataText, { fontSize: 10 }]}
                                key={item.id.toString()}
                              >
                                {item.name}
                              </Text>
                            </View>
                          );
                        })
                        : null}
                    </ScrollView>
                  </View>
                </>
              </View>

              <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={this.toggleCategoryModal}
                  style={[styles.btn, { backgroundColor: Colors.grey }]}
                >
                  <Ionicons
                    name={this.state.Ionicons}
                    size={20}
                    color={this.state.heart_color}
                  />
                  <Text style={{ fontSize: 14, color: Colors.white }}>
                    {this.state.wishlistText}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.addToCartlist}
                  style={[styles.btn, { backgroundColor: Colors.primary }]}
                >
                  <Ionicons
                    name="cart-outline"
                    size={20}
                    color={Colors.white}
                  />
                  <Text style={{ fontSize: 14, color: Colors.white }}>
                    {"Add to Cart"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        <Modal
          animationType="none"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isOpenCategoryModal}
        >
          <View style={styles.categoryModalOverlay}>
            <View style={styles.categoryModalContainer}>
              <View style={styles.categoryModalHeader}>
                {/* <Text style={{ fontSize: 16, color: Colors.black, opacity: 0.6 }}>
                  Wishlist
                </Text> */}

                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isOpenCategoryModal: false,
                      isOpenCategoryAddModal: true,
                    })
                  }
                  style={{ flexDirection: "row", alignItems: "flex-end" }}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    style={{ color: Colors.black }}
                  />
                  <Text style={{ fontSize: 16, color: Colors.black }}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryCloseButton}
                  onPress={this.toggleCategoryModal}
                >
                  <Ionicons
                    name="close-outline"
                    style={styles.categoryCloseButtonText}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.categoryModalBody}>
                <ScrollView>
                  {this.state.categoryList?.map((item) => {
                    return (
                      <TouchableOpacity
                        style={styles.radioItem}
                        key={item.id}
                        onPress={() => this.WishlistCreateHandle(this.state.game_id, item.id)}
                      >
                        <Text>{item.name}</Text>
                        {/* <CheckBox
                          value={item.is_added}
                          onChange={() => this.WishlistCreateHandle(item.id)}
                        /> */}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isOpenCategoryAddModal}
          onRequestClose={this.toggleCategoryAddModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBody}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.toggleCategoryAddModal}
              >
                <Ionicons name="close-outline" style={styles.closeButtonText} />
              </TouchableOpacity>

              <TextInput
                value={this.state.cat_name}
                autoCompleteType="off"
                autoCapitalize="words"
                placeholder="Enter Wishlist Name"
                style={styles.textInput}
                onChangeText={(cat_name) => this.setState({ cat_name })}
              />

              <TouchableOpacity
                onPress={this.WishlistCategoryCreate}
                style={[
                  styles.btn,
                  { backgroundColor: Colors.primary, marginTop: 10 },
                ]}
              >
                <Ionicons name="add" size={20} color={Colors.white} />
                <Text style={{ fontSize: 14, color: Colors.white }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <AwesomeAlert
          show={this.state.showAlertModal}
          showProgress={false}
          title={this.state.alertType}
          message={this.state.alertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="Ok"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            // this.hideAlert();
            this.props.navigation.goBack();
          }}
        />
        {/* Gallery Images */}
        <ImageView
          visible={this.state.isGalleryImageViewerOpen}
          images={this.getGalleryImages()}
          imageIndex={this.state.selectedGalleryImageIndex}
          onRequestClose={this.closeGalleryImageViewer}
        />
        {/*Video Playback Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isPlaybackModalOpen}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
            <View style={[styles.modalContainer, { backgroundColor: "#000" }]}>
              <View style={styles.playbackModalBody}>
                {/* <Video
                  useNativeControls={true}
                  resizeMode="contain"
                  isLooping={false}
                  source={{
                    uri: `http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4`,
                  }}
                  style={styles.video}
                // onLoadStart={() => console.log("Started***********")}
                // onLoad={() => console.log("Loaded***********")}
                /> */}

                {/* youtube video play */}
                <View>
               <YoutubePlayer
                    height={300}
                    width={windowwidth}
                  play={true}
                  videoId={this.state.videoid}
                  />
                  </View>
                <TouchableOpacity
                  style={[styles.closeButton, { top: 10, right: 10 }]}
                  onPress={this.closePlaybackModal}
                >
                  <Ionicons name="close-outline" style={styles.closeButtonText} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>

      </SafeAreaView>
    );
  };
}

const windowHeight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  gameDetails: {
    flex: 1,
    paddingHorizontal: 8,
  },
  gameBannerContainer: {
    width: "100%",
    height: 320,
  },
  gameBanner: {
    height: 310,
    width: "100%",
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
    alignSelf: "center",
    marginTop: 2,
  },
  gameDesc: {
    fontSize: 14,
    color: Colors.black,
    opacity: 0.9,
    textAlign: 'justify'
  },
  galleryContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  galleryGrid: {
    width: Math.floor((windowwidth - 10) / 3.1),
    height: 110,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  galleryImg: {
    width: Math.floor((windowwidth - 10) / 3.1),
    height: "98%",
    borderWidth: 0.5,
    borderColor: "#dfdfdf",
  },
  gameDataText: {
    fontSize: 14,
    color: Colors.black,
    opacity: 0.6,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  btn: {
    flexDirection: "row",
    width: 150,
    height: 45,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  btnPrev: {
    flexDirection: "row",
    width: 50,
    height: 45,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryModalOverlay: {
    height: windowHeight + 50,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },

  categoryModalContainer: {
    backgroundColor: Colors.white,
    minHeight: Math.floor(windowHeight * 0.5),
    elevation: 5,
  },

  categoryModalHeader: {
    height: 50,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.white,
    //elevation: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  categoryCloseButton: {
    backgroundColor: "#ddd",
    width: 25,
    height: 25,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
  },
  categoryCloseButtonText: {
    color: Colors.textColor,
    fontSize: 22,
  },

  categoryModalBody: {
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
    borderBottomWidth: 1,
    borderColor: "#eee",
    padding: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalBody: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    width: windowwidth - 30,
    minHeight: Math.floor(windowHeight / 5),
    padding: 15,
    borderRadius: 5,
    elevation: 8,
  },

  closeButton: {
    position: "absolute",
    zIndex: 11,
    top: 5,
    right: 5,
    backgroundColor: "#ddd",
    width: 25,
    height: 25,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
  },
  closeButtonText: {
    color: "#444",
    fontSize: 22,
  },
  playbackModalBody: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#000",
    width: windowwidth,
    height: windowHeight,
    padding: 15,
    borderRadius: 5,
    elevation: 5,
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: Math.floor(windowHeight / 4),
  },

  textInput: {
    padding: 9,
    fontSize: 14,
    textAlign: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.white,
  },

  buttonView: {

  },
  button: {
    flexDirection: "row",
    width: 50,
    height: 45,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 55
  },



});
