import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import { GetSubCategorys } from "../services/CategoryService";
import Loader from "../components/Loader";
import ProgressiveImage from "../components/ProgressiveImage";
import EmptyScreen from "./EmptyScreen";

export default class SubCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subCategoryList: [],
      isLoading: true,
      category_id: this.props.route.params.category_id,
      category_name: this.props.route.params.name,
      cat_id: null,
    };
  }

  componentDidMount = () => {
    this.loadSubCategoryList();
  };

  loadSubCategoryList = () => {
    GetSubCategorys(this.state.category_id)
      .then((response) => {
        this.setState({
          isLoading: false,
        });
        if (response?.data?.length > 0) {
          this.setState({
            subCategoryList: response.data,
            cat_id: response.data[0].id,
            isLoading: false,
          });
        }

      })
      .catch((err) => {
        console.log(err);
      });
  };
  gotoGames = (item) => {
    this.props.navigation.navigate("Games",
      { cat_id: this.state.cat_id, name: item.name }
    );
  }


  GoToGamesByTag = (data) => {
    this.props.navigation.navigate("GamesByTag", { data: { tag_id: data.tag_id, name: data.tag_name } });
  };


  renderEmptyContainer = () => {
    return (
      <EmptyScreen props={this.props} />
    )
  }

  renderListItem = ({ item }) => (

    <View style={styles.listItem}>
      <TouchableOpacity style={{ flexDirection: 'row' }}
        onPress={this.gotoGames.bind(this, item)}>
        <View style={styles.left}>
          <ProgressiveImage
            style={styles.image}
            source={{ uri: Configs.CATEGORY_IMAGE_URL + item.image }}
            resizeMode="cover"
          />
        </View>
        <View style={styles.middle}>
          <Text style={styles.name}>
            {item.name}
          </Text>
        </View>
        <View style={styles.right}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textInputBorder}
          />
        </View>
      </TouchableOpacity>

      <View style={{ marginTop: 10 }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {item.tags?.map(tag => {
            return (
              <TouchableOpacity key={tag.id} style={{ elevation: 4, backgroundColor: '#F5F5F5', padding: 2, paddingLeft: 20, paddingRight: 20, borderRadius: 10, margin: 5 }}
                onPress={() => this.GoToGamesByTag(tag)}>
                <Text>{tag.tag_name}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </View>

    // <TouchableOpacity
		// 	underlayColor={Colors.textInputBg}
		// 	onPress={this.gotoGames.bind(this, item)}
		// >
		// 	<View style={styles.listItem}>
		// 		<Text style={styles.name}>
		// 			{item.name}
		// 		</Text>
		// 		<Ionicons
		// 			name="chevron-forward"
		// 			size={20}
		// 			color={Colors.textInputBorder}
		// 		/>
		// 	</View>
		// </TouchableOpacity>

  );

  render = () => {

    let { list } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Header title={"# " + this.state.category_name} />
        {this.state.isLoading ? <Loader /> :
          <FlatList
            data={this.state.subCategoryList}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderListItem}
            initialNumToRender={this.id}
            ListEmptyComponent={this.renderEmptyContainer}
          />
        }

      </SafeAreaView>

      // <SafeAreaView style={styles.container}>
			// 	<Header title={this.state.category_name} />
			// 	{this.state.isLoading ? <Loader />
			// 		:
			// 		<>
			// 			<View style={styles.scroll} >

			// 				<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
			// 				<Ionicons style={styles.icon} name="chevron-back-outline" size={26} color={Colors.white} />
			// 					{

			// 						list.map((renderListItem) => {
			// 							return (
			// 								<>
												
			// 									<TouchableOpacity
			// 										onPress={this.toggleTab.bind(this, renderListItem)}
			// 									>
			// 										<View style={styles.listItem} key={renderListItem.id}>
			// 											<Text style={styles.name}>
			// 												{renderListItem.name}
			// 											</Text>
			// 										</View>
			// 									</TouchableOpacity>
												
			// 								</>
			// 							)

			// 						})


			// 					}
			// 				<Ionicons style={styles.icon} name="chevron-forward-outline" size={26} color={Colors.white} />
			// 				</ScrollView>
			// 			</View>

			// 			{/* <GetGamesByTag tagId={this.state.tagId} /> */}

			// 		</>
			// 	}
			// </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listItem: {
    //flexDirection: "row",
    borderBottomColor: Colors.textInputBorder,
    borderBottomWidth: 1,
    padding: 10,
  },
  left: {
    width: "20%",
    justifyContent: "center",
  },
  middle: {
    justifyContent: "center",
    flex: 1,
    paddingLeft: 10
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    width: '100%',
    height: 40,
  },
  name: {
    fontSize: 18,
    color: Colors.black,
  },
});
