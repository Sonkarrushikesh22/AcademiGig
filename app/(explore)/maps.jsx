import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MapView, { Marker, Circle } from "react-native-maps";
import { getJobsInRadius } from "../../api/jobsapi";
import JobCard from "../../components/CompanyCard/index";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";

const RADIUS_KM = 20; // Configurable search radius
const FETCH_THRESHOLD_KM = 10; // Only fetch if moved more than 10km

const JobsMapScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [customMarker, setCustomMarker] = useState(null);
  // Refs to track current and last fetched locations
  const currentLocationRef = useRef(null);
  const lastFetchedLocationRef = useRef(null);
  const mapRef = useRef(null);

  const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2) return Infinity;

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the earth in km

    const lat1 = loc1.latitude;
    const lon1 = loc1.longitude;
    const lat2 = loc2.latitude;
    const lon2 = loc2.longitude;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const initializeMap = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      const locationCoords = {
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      };
      
      setCurrentLocation(locationCoords);
      currentLocationRef.current = locationCoords;
      
      setInitialRegion(newLocation);
      await fetchJobsInRadius(locationCoords);
    } catch (error) {
      console.error("Failed to initialize map", error);
      setError("Failed to get location");
      setLoading(false);
    }
  };

  const fetchJobsInRadius = useCallback(async (location) => {
    try {
      // Check if we need to fetch based on distance from last fetch
      const lastFetched = lastFetchedLocationRef.current;
      const distance = calculateDistance(location, lastFetched);

      // Only fetch if we've moved more than the threshold or haven't fetched before
      if (distance > FETCH_THRESHOLD_KM || !lastFetched) {
        setLoading(true);

        const response = await getJobsInRadius({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: RADIUS_KM,
          page: 1,
          limit: 50,
        });

        // Ensure response.jobs exists and is an array
        const validJobs = (response?.jobs || [])
          .filter((job) => job.location?.latitude && job.location?.longitude)
          .map((job) => ({
            ...job,
            // Ensure all necessary properties exist
            title: job.title || "Untitled Job",
            company: job.company || "Unknown Company",
            companyLogoUrl: job.companyLogoUrl || null,
            location: {
              latitude: job.location.latitude,
              longitude: job.location.longitude,
            },
          }));

        // Update last fetched location
        lastFetchedLocationRef.current = location;

        // Only update jobs if there are changes
        setJobs((prevJobs) =>
          JSON.stringify(prevJobs) !== JSON.stringify(validJobs)
            ? validJobs
            : prevJobs
        );
      }
    } catch (error) {
      console.error("Failed to fetch jobs in radius", error);
      setError("Failed to fetch nearby jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      initializeMap();
    }
  }, [isFocused]);

  // Search location function
 

  const searchLocation = async () => {
    // Check if search query is empty or just whitespace
    if (!searchQuery || searchQuery.trim() === '') {
      return;
    }
  
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        
        const newLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
  
        mapRef.current.animateToRegion(newLocation, 1000);
        await fetchJobsInRadius({ latitude, longitude });
      } else {
        setError("Location not found");
      }
    } catch (error) {
      console.error("Search location error", error);
      setError("Could not find location");
    }
  };

  // Return to current location
  const returnToCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      const region = {
        ...currentLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      mapRef.current.animateToRegion(region, 1000);
      
      // Clear custom marker
      setCustomMarker(null);
      
      // Fetch jobs for current location
      fetchJobsInRadius(currentLocation);
    }
  };

  // Handle map long press to add custom marker
  const handleMapLongPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    
    // If a custom marker already exists, remove it
    if (customMarker) {
      setCustomMarker(null);
      
      // Optionally return to current location
      if (currentLocation) {
        mapRef.current.animateToRegion({
          ...currentLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
        
        // Refetch jobs for current location
        await fetchJobsInRadius(currentLocation);
      }
      return;
    }
  
    // Existing marker creation logic
    try {
      setLoading(true);
      setCustomMarker({ latitude, longitude });
      
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
      
      await fetchJobsInRadius({ latitude, longitude });
    } catch (error) {
      console.error("Custom marker error", error);
      setError("Could not fetch jobs for this location");
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChangeComplete = (newRegion) => {
    // Update current location ref
    const newLocation = {
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    };

    currentLocationRef.current = newLocation;

    // Optional: Fetch jobs if moved significantly
    const distance = calculateDistance(
      newLocation,
      lastFetchedLocationRef.current
    );

    if (distance > FETCH_THRESHOLD_KM) {
      fetchJobsInRadius(newLocation);
    }
  };

  // Render markers
  const renderMarkers = React.useMemo(() => {
    const safeJobs = jobs || [];

    return safeJobs
      .map((job, index) => {
        // Ensure job and job.location exist
        if (!job || !job.location) return null;

        return (
          <Marker
            key={job.id || `job-${index}`}
            coordinate={{
              latitude: job.location.latitude,
              longitude: job.location.longitude,
            }}
            pinColor="blue" // Add a blue pin color
            onPress={() => setSelectedJob(job)}
            title={job.title}
            description={`${job.company}`}
          />
        );
      })
      .filter(Boolean); // Remove any null markers
  }, [jobs]);

  // Render loading state
  if (loading && !initialRegion) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Prevent rendering if no initial region
  if (!initialRegion) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={() => setSelectedJob(null)}>
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchLocation}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Return to Current Location Button */}
      <TouchableOpacity 
        style={styles.currentLocationButton} 
        onPress={returnToCurrentLocation}
      >
        <Ionicons name="locate" size={24} color="black" />
      </TouchableOpacity>

      <MapView 
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        zoomEnabled={true}
        onLongPress={handleMapLongPress}
      >
        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="green"
            title="Your Location"
          />
        )}

        {/* Custom Marker */}
        {customMarker && (
          <Marker
            coordinate={customMarker}
            pinColor="red"
            title="Selected Location"
          />
        )}

        <Circle
          center={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
          radius={RADIUS_KM * 1000} // Convert to meters
          fillColor="rgba(0, 150, 255, 0.2)"
          strokeColor="rgba(0, 150, 255, 0.5)"
        />

        {renderMarkers}
      </MapView>

        {selectedJob && (
          <View style={styles.cardOverlay}>
            <View style={styles.cardHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedJob(null)}
              >
                <AntDesign name="closecircleo" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <JobCard
              job={{
                ...selectedJob,
                // Ensure all required properties exist
                company: selectedJob.company || "Unknown Company",
                title: selectedJob.title || "Untitled Job",
                description:
                  selectedJob.description || "No description available",
                companyLogoUrl: selectedJob.companyLogoUrl || null,
                skills: selectedJob.skills || [],
                location: selectedJob.location || null,
              }}
              logoUrl={selectedJob.companyLogoUrl || null}
              onSave={() => {
                /* Implement save logic */
              }}
              onUnsave={() => {
                /* Implement unsave logic */
              }}
              onApply={() => {
                /* Implement apply logic */
              }}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 52,
    left: 20,
    right: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  closeButton: {
    padding: 4,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  jobMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  jobMarker: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  jobMarkerText: {
    color: "white",
    fontWeight: "bold",
  },
  currentLocationMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  currentLocationMarker: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  currentLocationMarkerText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 10, // Adjust this value based on your layout
    right: 10,
    backgroundColor: 'white',
    borderRadius: 40, // Make it more circular
    width: 50, // Explicit width
    height: 50, // Explicit height
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Increased elevation for shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10, // Ensure it's above other elements
  },
});

export default JobsMapScreen;
