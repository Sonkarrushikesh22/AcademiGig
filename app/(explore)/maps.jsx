import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TextInput,
  Platform
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MapView, { Marker, Circle } from "react-native-maps";
import { getJobsInRadius,
  getDownloadPresignedUrl, 
  downloadAndCacheLogo,
  saveJob,
  unsaveJob, 
  isJobSaved, 
  applyToJob, 
  hasAppliedToJob 
} from "../../api/jobsapi";
import JobCard from "../../components/CompanyCard/index";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { Alert } from 'react-native';

const RADIUS_KM = 20; // Configurable search radius
const FETCH_THRESHOLD_KM = 10; // Only fetch if moved more than 10km

const JobsMapScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [savedJobIds, setSavedJobIds] = useState([]);
const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [logoCache, setLogoCache] = useState({});
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

  const getLogoUrl = useCallback(async (logoKey) => {
  if (!logoKey) return { type: 'placeholder' };
  
  try {
    if (logoCache[logoKey]) {
      return { type: 'file', path: logoCache[logoKey] };
    }

    try {
      const presignedUrl = await getDownloadPresignedUrl(logoKey, 'job-logo');
      
      // Log the presigned URL for debugging
      console.log('Presigned URL:', presignedUrl);

      const result = await downloadAndCacheLogo(presignedUrl, logoKey);
      
      if (result.type === 'file') {
        setLogoCache(prev => ({
          ...prev,
          [logoKey]: result.path
        }));
      }

      return result;
    } catch (urlError) {
      console.warn('Error getting presigned URL:', urlError);
      return { type: 'placeholder' };
    }
  } catch (error) {
    console.warn('Error getting logo URL:', error);
    return { type: 'placeholder' };
  }
}, [logoCache]);


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
          title: job.title || "Untitled Job",
          company: job.company || "Unknown Company",
          companyLogoKey: job.companyLogoKey, // Preserve logo key
          location: {
            latitude: job.location.latitude,
            longitude: job.location.longitude,
            city: job.location.city,
            state: job.location.state,
            country: job.location.country,
            remote: job.location.remote
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
 
  useEffect(() => {
    const checkJobStatuses = async () => {
      if (jobs.length > 0) {
        try {
          const savedPromises = jobs.map(job => isJobSaved(job._id));
          const appliedPromises = jobs.map(job => hasAppliedToJob(job._id));
  
          const savedResults = await Promise.all(savedPromises);
          const appliedResults = await Promise.all(appliedPromises);
  
          const savedIds = jobs
            .filter((_, index) => savedResults[index])
            .map(job => job._id);
  
          const appliedIds = jobs
            .filter((_, index) => appliedResults[index])
            .map(job => job._id);
  
          setSavedJobIds(savedIds);
          setAppliedJobIds(appliedIds);
        } catch (error) {
          console.error('Error checking job statuses:', error);
        }
      }
    };
  
    checkJobStatuses();
  }, [jobs]);

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
  const handleSave = async (job) => {
    try {
      await saveJob(job._id);
      setSavedJobIds(prev => [...prev, job._id]);
    } catch (error) {
      console.error('Error saving job:', error);
      Alert.alert('Error', 'Failed to save job');
    }
  };
  
  const handleUnsave = async (job) => {
    try {
      await unsaveJob(job._id);
      setSavedJobIds(prev => prev.filter(id => id !== job._id));
    } catch (error) {
      console.error('Error unsaving job:', error);
      Alert.alert('Error', 'Failed to unsave job');
    }
  };
  
  const handleApply = async (job) => {
    try {
      if (appliedJobIds.includes(job._id)) {
        Alert.alert('Already Applied', 'You have already applied to this job.');
        return;
      }
  
      await applyToJob(job._id);
      
      setAppliedJobIds(prev => [...prev, job._id]);
  
      Alert.alert(
        'Application Submitted',
        'Your job application has been submitted successfully!'
      );
    } catch (error) {
      if (error.message === 'Already applied for this job') {
        setAppliedJobIds(prev => [...prev, job._id]);
        Alert.alert('Already Applied', 'You have already applied to this job.');
      } else {
        Alert.alert(
          'Application Failed',
          error.message || 'Failed to submit job application. Please try again.'
        );
      }
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
          _id: selectedJob._id,
          title: selectedJob.title || "Untitled Job",
          company: selectedJob.company || "Unknown Company",
          description: selectedJob.description || "No description available",
          jobType: selectedJob.jobType,
          salary: selectedJob.salary,
          location: {
            latitude: selectedJob.location?.coordinates?.[1],
            longitude: selectedJob.location?.coordinates?.[0],
            city: selectedJob.location?.city,
            state: selectedJob.location?.state,
            country: selectedJob.location?.country,
            remote: selectedJob.location?.remote
          },
          logoKey: selectedJob.companyLogoKey,
          skills: selectedJob.skills || [],
          applicationDeadline: selectedJob.applicationDeadline,
          experienceLevel: selectedJob.experienceLevel,
          requirements: selectedJob.requirements,
          responsibilities: selectedJob.responsibilities,
          isSaved: savedJobIds.includes(selectedJob._id),
          hasApplied: appliedJobIds.includes(selectedJob._id)
        }}
        getLogoUrl={getLogoUrl}
        onSave={() => handleSave(selectedJob)}
        onUnsave={() => handleUnsave(selectedJob)}
        onApply={() => handleApply(selectedJob)}
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
    left: 80, // Space for location button
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
    // Platform-specific shadow handling
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50, // Match the height of location button
  },
  
  currentLocationButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Add zIndex for all platforms
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 10, // Increase elevation even more
      },
    }),
  }
  
});

export default JobsMapScreen;
