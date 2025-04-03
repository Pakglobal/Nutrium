// import React from 'react';
// import {
//   View,
//   TouchableOpacity,
//   LogBox,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   Pressable,
// } from 'react-native';
// import {scale, verticalScale} from 'react-native-size-matters';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import NutriumLogo from '../assets/Icon/NutriumLogo.svg';
// import Color from '../assets/colors/Colors';

// const Header = ({headerText, showIcon}) => {
//   return (
//     <SafeAreaView style={{backgroundColor: Color.common}}>
//       <View
//         style={{
//           alignItems: 'flex-end',
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           marginVertical: verticalScale(12),
//         }}>
//         <NutriumLogo height={scale(25)} width={scale(150)} />
//         {showIcon === true ? (
//           <Pressable style={{marginHorizontal: scale(16)}}>
//             <MaterialCommunityIcons
//               name="email-outline"
//               color={Color.gray}
//               size={scale(22)}
//             />
//           </Pressable>
//         ) : null}
//       </View>
//       {headerText ? <Text style={styles.titleTxt}>{headerText}</Text> : null}
//     </SafeAreaView>
//   );
// };

// export default Header;
// const styles = StyleSheet.create({
//   titleTxt: {
//     fontSize: scale(19),
//     color: Color.black,
//     fontWeight: '600',
//     marginTop: verticalScale(25),
//     marginBottom: verticalScale(10),
//     marginHorizontal: scale(16),
//   },
// });

import React from 'react';
import {
  View,
  TouchableOpacity,
  LogBox,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color, {Font} from '../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';
import Logo from '../assets/Icon/logo.svg';
import Menu from '../assets/Icon/menu.svg';
import {Shadow} from 'react-native-shadow-2';

const Header = ({
  headerText,
  showIcon,
  backIcon,
  logo,
  screenName,
  iconStyle,
  onPress,
  onSave,
  logoHeader,
  screenheader,
}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.header}>
      {logoHeader && (
        <>
          <Shadow
            distance={4}
            startColor={'rgba(0,0,0,0.25)'}
            style={{width: '100%'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: scale(10),
                paddingVertical: verticalScale(15),
                borderBottomLeftRadius: scale(12),
                borderBottomRightRadius: scale(12),
              }}>
              <Logo />
              <Menu />
            </View>
          </Shadow>
        </>
      )}
      
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: scale(10),
          paddingVertical: verticalScale(15)
        }}>
        {backIcon ? <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => navigation.goBack()} >
          <AntDesign name='arrowleft' size={20} color={Color?.white} style={{ alignSelf: 'center' }} />
        </TouchableOpacity> : null}
        {screenName ? <Text style={[styles.titleTxt, iconStyle]}>{screenName}</Text> : null}
        {logo ? <Image source={require('../../src/assets/Images/LOGO.png')} style={{ height: scale(25), width: '40%' }} resizeMode='contain' /> : null}
        {showIcon === true ? (
          <Pressable style={{ alignSelf: "center" }}>
            <Entypo name="menu" color={Color?.white} size={scale(22)} />
          </Pressable>
        ) : showIcon === false ? (
          <TouchableOpacity style={{ alignSelf: "center" }} onPress={onPress}>
            <AntDesign name="pluscircle" color={Color?.white} size={scale(22)} />
          </TouchableOpacity>
        ) : showIcon == 'save' ? (
          <TouchableOpacity onPress={onSave} >
            <Text style={styles.titleTxt}>save</Text>
          </TouchableOpacity>
        ) : null}

      </View>
      {headerText ? <Text style={styles.titleTxt}>{headerText}</Text> : null} */}
    </SafeAreaView>
  );
};

export default Header;
const styles = StyleSheet.create({
  titleTxt: {
    fontSize: scale(18),
    color: Color.white,
    fontWeight: '500',
    fontFamily: Font?.Sofia,
  },
  header: {
    backgroundColor: Color?.primaryColor,
    borderBottomLeftRadius: scale(12),
    borderBottomRightRadius: scale(12),
    shadowColor: Color?.black,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
});
