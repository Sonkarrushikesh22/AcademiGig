import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import SearchInput from "../../components/Search/SearchInput";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");


const CATEGORY_MAPPING = {
  'Retail': { key: 'retail', icon: '🛍️' },
  'Customer Service': { key: 'customer-service', icon: '🎯' },
  'Food Service': { key: 'food-service', icon: '🍽️' },
  'Education': { key: 'education', icon: '📚' },
  'Tutoring': { key: 'tutoring', icon: '📖' },
  'Healthcare': { key: 'healthcare', icon: '🩺' },
  'Wellness': { key: 'wellness', icon: '❤️' },
  'Administrative Support': { key: 'administrative', icon: '💼' },
  'Creative': { key: 'creative', icon: '🎨' },
  'Design': { key: 'design', icon: '✏️' },
  'Technology': { key: 'technology', icon: '💻' },
  'IT': { key: 'it', icon: '🖥️' },
  'Transportation': { key: 'transportation', icon: '🚚' },
  'Delivery': { key: 'delivery', icon: '📦' },
  'Marketing': { key: 'marketing', icon: '📊' },
  'Sales': { key: 'sales', icon: '💰' },
  'Finance': { key: 'finance', icon: '💵' },
  'Accounting': { key: 'accounting', icon: '📈' }
};
const Explore = () => {
  const router = useRouter();
  const categories = Object.entries(CATEGORY_MAPPING).map(([title, { key, icon }], index) => ({
    id: index.toString(),
    title,
    key,
    icon,
  
  }));

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
  )

  const handleCategoryPress = (category) => {
    router.push({
      pathname: `/(explore)/${category.key}`,
      params: { 
        category: category.title,
        categoryKey: category.key
      }
    });
  };

  return (
    <SafeAreaView style={Styles.container}>
      <View style={Styles.body}>
        <SearchInput
          placeholder="Search for jobs..."
          onSearch={handleSearch}
        />
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          showsVerticalScrollIndicator={false}
        >
          <View style={Styles.categoriesContainer}>
            <Text style={Styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );

};
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
    paddingBottom: 130,
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
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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
export default Explore;
