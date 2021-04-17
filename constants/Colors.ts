import commonColor from '../native-base-theme/variables/commonColor';

const tintColorLight = commonColor.brandPrimary;
const tintColorDark = commonColor.inverseTextColor;

export default {
  light: {
    text: commonColor.textColor,
    background: commonColor.inverseTextColor,
    tint: tintColorLight,
    tabIconDefault: commonColor.brandLight,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: commonColor.textColor,
    background: commonColor.inverseTextColor,
    tint: tintColorDark,
    tabIconDefault: commonColor.brandLight,
    tabIconSelected: tintColorDark,
  },
};
