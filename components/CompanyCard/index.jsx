// index.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import SmallCard from './jobCard';
import LargeCard from './expandedJobcardf';

const JobCard = ({ job, onApply }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  return (
    <View>
      <SmallCard job={job} onPress={() => setPopupVisible(true)} />
      {isPopupVisible && (
        <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark">
          <LargeCard
            job={job}
            onClose={() => setPopupVisible(false)}
            onApply={onApply}
          />
        </BlurView>
      )}
    </View>
  );
};

export default JobCard;
