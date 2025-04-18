// import {
//   Image,
//   ImageBackground,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React from 'react';
// import { scale, verticalScale } from 'react-native-size-matters';
// import { Color } from '../assets/styles/Colors';
// import { useNavigation } from '@react-navigation/native';
// import { Shadow } from 'react-native-shadow-2';
// import Food from '../assets/Images/Food.svg';
// import { Font } from '../assets/styles/Fonts';
// import { shadowStyle, ShadowValues } from '../assets/styles/Shadow';
// import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';
// import CustomShadow from './CustomShadow';

// const MealsLikeInHome = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={{ marginTop: verticalScale(18) }}>
//       <CustomShadow radius={3}>
//         <View style={shadowStyle}>
//           <View style={{ padding: scale(10) }}>
//             <Text style={styles.title}>What were your meals like?</Text>
//             <View>
//               <Food width='100%' preserveAspectRatio="xMaxYMax slice" />
//             </View>
//             <CustomHomeButtonNavigation
//               text={'Go to Food Diary'}
//               onPress={() => navigation.navigate('foodDiary')}
//             />
//           </View>
//         </View>
//       </CustomShadow>
//     </View>
//   );
// };

// export default MealsLikeInHome;

// const styles = StyleSheet.create({
//   cardContainer: {
//     width: '100%',
//     backgroundColor: Color?.white,
//   },
//   card: {
//     height: '100%',
//     width: '100%',
//     borderRadius: scale(20),
//     paddingLeft: scale(20),
//   },
//   discription: {
//     fontSize: scale(14),
//     color: Color.white,
//     fontWeight: '500',
//     position: 'absolute',
//     bottom: scale(20),
//     left: scale(10),
//     fontFamily: Font?.Poppins,
//   },
//   txt: {
//     fontSize: scale(12),
//     fontWeight: '500',
//     color: Color.primaryColor,
//     fontFamily: Font?.Poppins,
//     marginTop: verticalScale(2),
//     marginLeft: scale(5),
//   },
//   title: {
//     fontSize: scale(14),
//     fontWeight: '500',
//     color: Color.textColor,
//     fontFamily: Font?.PoppinsMedium,
//   },
//   DiaryBtn: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
// });


import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { Color } from '../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';
import Food from '../assets/Images/Food.svg';
import { Font } from '../assets/styles/Fonts';
import { shadowStyle } from '../assets/styles/Shadow';
import CustomHomeButtonNavigation from './CustomHomeButtonNavigation';
import CustomShadow from './CustomShadow';

const MealsLikeInHome = () => {
  const navigation = useNavigation();

  return (
    <View style={{ marginTop: verticalScale(18) }}>
      <CustomShadow radius={3}>
        <View style={shadowStyle}>
          <View style={{ padding: scale(10) }}>
            <Text style={styles.title}>What were your meals like?</Text>
            
            {/* Image container with overlay text */}
            <View style={styles.imageContainer}>
              {/* If SVG doesn't work properly, use Image component instead */}
              <Food width="100%" height="100%" style={styles.foodImage} />
              {/* Alternatively use regular image: */}
              {/* <Image
                source={require('../assets/Images/Food.png')}
                style={styles.foodImage}
                resizeMode="cover"
              /> */}
              
              <Text style={styles.overlayText}>
                Log more meals and get the{'\n'}
                bigger picture of your days.
              </Text>
            </View>

            <CustomHomeButtonNavigation
              text={'Go to Food Diary'}
              onPress={() => navigation.navigate('foodDiary')}
            />
          </View>
        </View>
      </CustomShadow>
    </View>
  );
};

export default MealsLikeInHome;

const styles = StyleSheet.create({
  title: {
    fontSize: scale(14),
    fontWeight: '500',
    color: Color.textColor,
    fontFamily: Font?.PoppinsMedium,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: scale(10),
    overflow: 'hidden',
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(10),
  },
  overlayText: {
    fontSize: scale(14),
    color: Color.white,
    fontWeight: '500',
    fontFamily: Font?.Poppins,
    position: 'absolute',
    bottom: scale(20),
    left: scale(15),
  },
});