import React from "react";
import { View, Text, StyleSheet,Platform  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import SearchInput from "../../components/SearchComponent/SearchInput";
import JobsList from "../../components/CompanyCard/jobList";


const Home = () => {
  const router = useRouter();

  const handleSearch = (filters) => {
    const queryParams = new URLSearchParams();
    
    // Ensure default parameters are always included
    const completeFilters = {
      page: 1,
      limit: 10,
      sortBy: 'postedDate',
      sortOrder: 'desc',
      ...filters
    };
  
    Object.entries(completeFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  
    // Navigate to the search results page with the filters
    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>AcademiGig</Text>
          <View style={styles.icons}>
            <TouchableOpacity
              onPress={() => router.push("/HeaderTabs/notifications")}
              style={styles.iconButton}
            >
              <SimpleLineIcons name="bell" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/HeaderTabs/chat")}
              style={styles.iconButton}
            >
              <Ionicons name="chatbubbles-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder="Search for jobs..."
            onSearchResults={handleSearch}
            showFilterButton={true}/>
        </View>

        {/* Jobs List */}
        <View style={styles.jobsListContainer} >
          <JobsList  />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    //backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom: -20,
    ...Platform.select({
      ios: {
        paddingBottom: 0,
        marginBottom:-30
      }
    }),

  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  icons: {
    flexDirection: "row",
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 5,
  },
  searchContainer: {
    //marginBottom: 0,
  },
  jobsListContainer: {
    flex: 1,
    marginHorizontal: -5,
  },
});

export default Home;