import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";
import SearchInput from "../../components/Search/SearchInput";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Styles = {
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoriesContainer: {
    paddingVertical: 20,
  },
  categoryItem: {
    width: (width - 60) / 2,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  categoryCount: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 20,
  },
};

const Explore = () => {
  const sampleCategories = [
    { id: "1", title: "Restaurant", count: 25, icon: "🍽️" },
    { id: "2", title: "Retail", count: 18, icon: "🛍️" },
    { id: "3", title: "Office Work", count: 15, icon: "💼" },
    { id: "4", title: "Delivery", count: 22, icon: "🚚" },
    { id: "5", title: "Customer Service", count: 20, icon: "🎯" },
    { id: "6", title: "Education", count: 12, icon: "📚" },
    { id: "7", title: "Event Staffing", count: 10, icon: "🎉" },
    { id: "8", title: "Freelance Writing", count: 8, icon: "✍️" },
    { id: "9", title: "Tutoring", count: 14, icon: "📖" },
    { id: "10", title: "Healthcare Assistant", count: 6, icon: "🩺" },
    { id: "11", title: "Warehouse", count: 16, icon: "🏭" },
    { id: "12", title: "Cleaning Services", count: 11, icon: "🧹" },
    { id: "13", title: "Pet Care", count: 5, icon: "🐾" },
    { id: "14", title: "IT Support", count: 9, icon: "💻" },
  ];

  const [categories, setCategories] = React.useState(sampleCategories);

  const handleSearch = (text) => {
    console.log("Search:", text);
  };

  const handleApplyFilters = (filters) => {
    console.log('Applied filters:', filters);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={Styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={{ fontSize: 24 }}>{item.icon}</Text>
      <Text style={Styles.categoryTitle}>{item.title}</Text>
      <Text style={Styles.categoryCount}>{item.count} jobs</Text>
    </TouchableOpacity>
  );

  const handleCategoryPress = (category) => {
    console.log("Category pressed:", category.title);
  };

  return (
    <SafeAreaView style={Styles.container}>
     
        <View style={Styles.body}>
          <SearchInput
            placeholder="Search for jobs..."
            onSearch={handleSearch}
            onFilter={handleApplyFilters}
          />
 <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={Styles.categoriesContainer}>
            <Text style={Styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false} // If wrapping with ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
          </ScrollView>
        </View>
      
    </SafeAreaView>
  );
};

export default Explore;
