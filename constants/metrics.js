import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375; // Base width for scaling
const guidelineBaseHeight = 812; // Base height for scaling

export const horizontalScale = size => (width / guidelineBaseWidth) * size;
export const verticalScale = size => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;
