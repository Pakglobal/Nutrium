import {scale} from 'react-native-size-matters';
import Color from '../colors/Colors';

const IconStyle = {
  drawerIconSize: scale(22),
  drawerIconColor: Color.textColor,
  headerIconSize: scale(26),
};
export default IconStyle;

export const IconPadding = {
  padding: scale(5),
  // backgroundColor: 'red'
};

export const IconBg = {
  height: scale(25),
  width: scale(25),
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: 'red'
};
