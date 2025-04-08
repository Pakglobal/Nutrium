import {scale} from 'react-native-size-matters';
import Color from '../colors/Colors';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

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

export const LeftIcon = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {alignSelf: 'flex-start'}]}
      onPress={() => navigation.goBack()}>
      <View style={[styles.button]}>
        <FontAwesome6
          name="circle-arrow-left"
          color={Color.primaryColor}
          size={32}
        />
      </View>
    </TouchableOpacity>
  );
};

export const RightIcon = ({onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {alignSelf: 'flex-end'}]}
      onPress={onPress}>
      <View style={[styles.button]}>
        <FontAwesome6
          name="circle-arrow-right"
          color={Color.primaryColor}
          size={32}
        />
      </View>
    </TouchableOpacity>

    // <TouchableOpacity style={styles.button} onPress={onPress}>
    //   <AntDesign name="arrowright" color={Color.white} size={scale(24)} />
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(5),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(10),
    // backgroundColor: 'red'

    // backgroundColor: Color.primaryColor,
    // borderRadius: scale(25),
    // padding: scale(10),
    // alignSelf: 'flex-end',
  },
});
