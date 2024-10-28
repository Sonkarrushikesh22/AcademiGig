import { View, Text, ScrollView, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import  SearchInput  from "../../components/Search/SearchInput";

const Styles = {
  Headercontainer: {
    flexDirection: "row",
    //backgroundColor: "white",
    paddingVertical: 20,
  },
  logo: {
    //  paddingTop:10,
        flex: 1, 
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  icons: {
    flexDirection: "row",
    alignItems: 'center',

  },
  body: {
   // backgroundColor: "white",
    paddingHorizontal:20
  },
};

const Home = () => {
  const handleSearch = (text) => {
    console.log("Search:", text);
  };

  const handleFilter = () => {
    console.log("Filter icon clicked");
  };
  return (
    <SafeAreaView>
      <View style={Styles.body}>
        <View style={Styles.Headercontainer}>
          <Text style={Styles.logo}>AcademiGig</Text>
          <View style={Styles.icons}>
            <SimpleLineIcons name="bell" size={24} color="black" paddingHorizontal={5} />
            <Ionicons name="chatbubbles-outline" size={24} color="black" paddingHorizontal={5}/>
          </View>
        </View>
        
          <View>
          <SearchInput
          placeholder="Search for jobs..."
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
          </View>
        
      </View>
    </SafeAreaView>
  );
};

export default Home;
