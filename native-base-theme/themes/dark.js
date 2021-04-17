import commonColor from '../variables/commonColor';

export default {
  ...commonColor,
  brandDark: '#fff',

  containerBgColor: '#000',

  textColor: '#fff',
  inverseTextColor: '#000',

  get defaultTextColor() {
    return this.textColor;
  },

  get inputColor() {
    return this.textColor;
  },

  inputColorPlaceholder: commonColor.brandLight,
};
