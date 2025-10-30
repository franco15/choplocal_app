import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
	size + (horizontalScale(size) - size) * factor;

export { horizontalScale, moderateScale, verticalScale };

//usage
// verticalScale: all vertical related ex. height, marginTop, marginBottom, marginVertical, paddingTop, paddingBottom paddingVertical, line-height, etc

// horizontalScale: all horizontal related ex. width, marginLeft, marginRight, marginHorizontal, paddingLeft, paddingRight, paddingHorizontal, etc

// moderateScale: anything else like fontSize, borderRadius
