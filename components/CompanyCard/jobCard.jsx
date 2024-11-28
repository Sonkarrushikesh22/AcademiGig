import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import LogoPlaceholder from "./logoPlaceholder";

const { width } = Dimensions.get("window");

const SmallCard = ({ job, onSave, getLogoUrl, onPress, isSaved }) => {
  const [logo, setLogo] = useState({ type: "placeholder" });

  useEffect(() => {
    const loadLogo = async () => {
      if (job.logoKey) {
        const result = await getLogoUrl(job.logoKey);
        setLogo(result);
      }
    };

    loadLogo();
  }, [job.logoKey, getLogoUrl]);

  const renderLogo = () => {
    if (logo.type === "file") {
      return (
        <Image
          source={{ uri: `file://${logo.path}` }}
          style={styles.logoSmall}
          resizeMode="cover"
        />
      );
    }
    return <LogoPlaceholder size={60} />;
  };

  return (
    <Pressable 
      onPress={onPress} 
      style={styles.card}
      android_ripple={{ color: "rgba(0,123,255,0.1)" }}
    >
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSave(job)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={[styles.bookmarkContainer, isSaved && styles.bookmarkContainerActive]}>
            <Feather
              name="bookmark"
              size={20}
              color={isSaved ? "#007BFF" : "#6B7280"}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.logoContainer}>{renderLogo()}</View>

        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.title}>{job.title}</Text>
          <Text numberOfLines={1} style={styles.companyName}>{job.company}</Text>
          
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Feather name="briefcase" size={14} color="#6B7280" style={styles.tagIcon} />
              <Text style={styles.tagText}>{job.jobType}</Text>
            </View>
            
            <View style={styles.tag}>
              <Feather name="dollar-sign" size={14} color="#6B7280" style={styles.tagIcon} />
              <Text style={styles.salary}>
                {job.salary?.min && job.salary?.max
                  ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency}`
                  : "Not specified"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    marginVertical: 8,
    marginHorizontal: width * 0.05,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  mainContainer: {
    padding: 16,
  },
  saveButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  bookmarkContainer: {
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 8,
  },
  bookmarkContainerActive: {
    backgroundColor: "#EBF5FF",
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoSmall: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 4,
    color: "#1F2937",
  },
  companyName: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 14,
    color: "#6B7280",
  },
  salary: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default SmallCard;