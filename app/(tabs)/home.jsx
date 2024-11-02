import { View, Text, ScrollView, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import  SearchInput  from "../../components/Search/SearchInput";
// import Chat from "../../components/Headertabs/chat"
// import Notification from "../../components/Headertabs/notifications";
import { useRouter, Link } from 'expo-router';

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
  const router = useRouter();

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
            <TouchableOpacity
             onPress={() => router.push("/HeaderTabs/notifications")}
            >
            <SimpleLineIcons name="bell" size={24} color="black" paddingHorizontal={5} />
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => router.push("/HeaderTabs/chat")}
            >
            <Ionicons name="chatbubbles-outline" size={24} color="black" paddingHorizontal={5}/>
            </TouchableOpacity>
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
