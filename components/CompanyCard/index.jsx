import React, { useState } from 'react';
import SmallCard from './jobCard';
import LargeCard from './expandedJobcardf';

const JobCard = ({ job, onSave, onUnsave, onApply, getLogoUrl }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleSave = async () => {
    try {
      if (job.isSaved) {
        await onUnsave(job);
      } else {
        await onSave(job);
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
        isSaved={job.isSaved}
      />
      <LargeCard
        job={job}
        onClose={() => setPopupVisible(false)}
        onApply={onApply}
        onSave={handleSave}
        getLogoUrl={getLogoUrl}
        isSaved={job.isSaved}
        visible={isPopupVisible}
      />
    </>
  );
};

export default JobCard;