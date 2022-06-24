import React from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView
} from "react-native";
import Colors from "../config/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import LottieView from 'lottie-react-native';
//import Header from "../components/Header";



export default class EmptyScreen extends React.Component {

  constructor(props) {
    super(props);
  }


  render = () => {
    return (
      <SafeAreaView style={styles.container} >
        {/* <Header title="Invite friends" /> */}
        <View style={{ alignItems: 'center', marginTop: 150 }}>
          <LottieView
            ref={animation => {
              this.animation = animation;
              this.animation?.play();
            }}
            style={{
              width: 250,
              height: 250,
              //backgroundColor: '#eee',
            }}
            source={require('../assets/lottie/no-result-found.json')}
          />
        </View>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontSize: 20, color: 'red' }}>
            Oops!
          </Text>

          <Text style={{ color: 'grey' }}>
            No records found !
          </Text>

        </View>

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <TouchableOpacity style={{
            backgroundColor: "#c43160",
            paddingLeft: 50,
            paddingRight: 50,
            padding: 10,
            color: 'white',
            borderRadius: 10,
          }}
            onPress={() => this.props?.props?.navigation?.goBack()}
          >

            <Text style={{
              fontSize: 18,
              color: '#FAFAFA',
              marginLeft: 10,
              marginTop: 2,
              fontWeight: 'bold'
            }}>START SHOPPING</Text>

          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // padding:10
  },

});
