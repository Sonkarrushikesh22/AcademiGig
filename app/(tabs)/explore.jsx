import { View, Text } from 'react-native'
import React from 'react'
import  SearchInput  from "../../components/Search/SearchInput";
import { SafeAreaView } from "react-native-safe-area-context";

const Styles={
body:{
  paddingHorizontal:20,
  paddingTop:20,
}
};
const Explore = () => {
  const handleSearch = (text) => {
    console.log("Search:", text);
  };

  const handleFilter = () => {
    console.log("Filter icon clicked");
  };
  return (
    <SafeAreaView>
      <View style={Styles.body}>
        <SearchInput
          placeholder="Search for jobs..."
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
      </View>
    </SafeAreaView>
  )
}

export default Explore