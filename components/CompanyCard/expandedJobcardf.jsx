import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Alert,
  Animated,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import LogoPlaceholder from "./logoPlaceholder";
import { BlurView } from "expo-blur";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

const LargeCard = ({
  job,
  onSave,
  onApply,
  getLogoUrl,
  onClose,
  visible,
  isSaved,
}) => {
  const [logo, setLogo] = useState({ type: "placeholder" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scale] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = useState(false); // Internal state

  useEffect(() => {
    const loadLogo = async () => {
      if (job.logoKey) {
        const result = await getLogoUrl(job.logoKey);
        setLogo(result);
      }
    };
    
    loadLogo();
  }, [job.logoKey, getLogoUrl]);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 5,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => setIsAnimating(false));
    } else {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 5,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false); // Animation completed

        onClose();
      });
    }
  }, [visible]);

  if (!visible && !isAnimating) {
    return null; // Hide Modal completely
  }

  const renderLogo = () => {
    if (logo.type === 'file') {
      return (
        <Image
          source={{ uri: `file://${logo.path}` }}
          style={styles.logoLarge}
          resizeMode="cover"
        />
      );
    }
    return <LogoPlaceholder size={100} />;
  };

  const handleApply = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onApply(job);
    } catch (error) {
      Alert.alert(
        "Application Failed",
        error.message || "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderApplyButton = () => {
    if (job.hasApplied) {
      return (
        <TouchableOpacity
          style={[styles.applyButton, styles.appliedButton]}
          disabled
        >
          <Text style={styles.applyButtonText}>Already Applied</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.applyButton, isSubmitting && styles.submittingButton]}
        onPress={handleApply}
        disabled={isSubmitting}
      >
        <Text style={styles.applyButtonText}>
          {isSubmitting ? "Submitting..." : "Apply Now"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible || isAnimating}
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.blurContainer, { opacity }]}
      >
        <BlurView intensity={200} style={styles.container} tint="dark">
          <Animated.View
            style={[styles.card, { transform: [{ scale }], opacity }]}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>{renderLogo()}</View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => onSave(job)}
                >
                  <View style={[styles.iconButton, isSaved && styles.iconButtonActive]}>
                    <Feather
                      name={isSaved ? "bookmark" : "bookmark"}
                      size={20}
                      color={isSaved ? "#2563EB" : "#6B7280"}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <View style={styles.iconButton}>
                    <Feather name="x" size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <View style={styles.titleSection}>
                <Text style={styles.title}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>
                <View style={styles.tagContainer}>
                  <View style={styles.tag}>
                    <Feather name="briefcase" size={14} color="#6B7280" />
                    <Text style={styles.tagText}>{job.jobType}</Text>
                  </View>
                  {job.salary?.min && job.salary?.max && (
                    <View style={styles.tag}>
                      <Feather name="dollar-sign" size={14} color="#6B7280" />
                      <Text style={styles.tagText}>
                        {`${job.salary.min} - ${job.salary.max} ${job.salary.currency}`}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Description</Text>
                <Text style={styles.description}>{job.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Requirements</Text>
                {job.requirements?.map((req, index) => (
                  <View key={index} style={styles.bulletPoint}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletText}>{req}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {job.skills.map(skill => (
                    <View key={skill} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Additional Details</Text>
                <View style={styles.detailsCard}>
                  <View style={styles.detailRow}>
                    <Feather name="user" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      Experience: {job.experienceLevel}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Feather name="map-pin" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {job.location?.remote
                        ? "Remote"
                        : `${job.location?.city || "N/A"} ${job.location?.state || ""}`}
                    </Text>
                  </View>
                  {job.applicationDeadline && (
                    <View style={styles.detailRow}>
                      <Feather name="calendar" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  job.hasApplied && styles.appliedButton,
                  isSubmitting && styles.submittingButton
                ]}
                onPress={handleApply}
                disabled={job.hasApplied || isSubmitting}
              >
                <Text style={styles.applyButtonText}>
                  {job.hasApplied ? "Applied" : isSubmitting ? "Submitting..." : "Apply Now"}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  card: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderRadius: 12,
  },
  iconButtonActive: {
    backgroundColor: "#EBF5FF",
  },
  logoContainer: {
    marginRight: 16,
  },
  logoLarge: {
    width: 90,
    height: 90,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 16,
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    backgroundColor: "#EBF5FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  skillChipText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },
  detailsCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#4B5563",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  applyButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  appliedButton: {
    backgroundColor: "#9CA3AF",
  },
  submittingButton: {
    backgroundColor: "#60A5FA",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LargeCard;
