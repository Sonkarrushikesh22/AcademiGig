import React, { useState } from 'react';
import SmallCard from './jobCard';
import LargeCard from './expandedJobcardf';

const JobCard = ({ job, onSave, onUnsave, onApply, getLogoUrl }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const handleSave = async () => {
    try {
      if (isSaved) {
        await onUnsave(job);
        setIsSaved(false);
      } else {
        await onSave(job);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };

  const handleCardPress = () => {
    setPopupVisible(true);
  };

  return (
    <>
      <SmallCard 
        job={job} 
        onPress={handleCardPress}
        onSave={handleSave}
        getLogoUrl={getLogoUrl}
        isSaved={isSaved}
      />
      <LargeCard
        job={job}
        onClose={() => setPopupVisible(false)}
        onApply={onApply}
        onSave={handleSave}
        getLogoUrl={getLogoUrl}
        isSaved={isSaved}
        visible={isPopupVisible}
      />
    </>
  );
};

export default JobCard;