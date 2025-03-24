import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Color from '../../../assets/colors/Colors';
import CameraPicker from '../../../Components/CameraPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UpdateImage} from '../../../Apis/ClientApis/ProfileApi';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {setImage} from '../../../redux/client';

const MainProfile = ({route}) => {
  const data = route?.params?.data;

  const dispatch = useDispatch();
  const getToken = useSelector(state => state?.user?.userInfo);
  const token = getToken?.token;
  const id = getToken?.userData?._id || getToken?.user?._id;

  const profileImage = useSelector(state => state?.client?.imageInfo);

  const showToast = message => {
    Toast.show(message, Toast.LONG, Toast.BOTTOM);
  };

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  console.log(profileImage);

  const image =
    data?.gender === 'Female'
      ? require('../../../assets/Images/woman.png')
      : require('../../../assets/Images/man.png');

  const handleImageSelect = async imageResponse => {
    if (imageResponse) {
      const imageUrl = {
        uri: imageResponse?.uri,
        fileName: imageResponse?.fileName,
        type: imageResponse?.type,
      };
      setLoading(true);
      try {
        const response = await UpdateImage(token, id, imageUrl);
        if (
          response?.message === 'Client details updated successfully' ||
          response?.success === true
        ) {
          dispatch(setImage(response?.client?.image));
          setLoading(false);
        } else {
          showToast(response?.message);
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
        showToast(error);
        setLoading(false);
      }
    }
  };

  const information = [
    {
      id: 0,
      icon: 'female',
      label: 'Gender',
      value: data?.gender || '--',
    },
    {
      id: 1,
      icon: 'calendar',
      label: 'Birthdate',
      value: data?.dateOfBirth || '--',
    },
    {
      id: 2,
      icon: 'call',
      label: 'Phone number',
      value: data?.phoneNumber || '--',
    },
    {id: 3, icon: 'mail', label: 'E-mail', value: data?.email || '--'},
    {
      id: 4,
      icon: 'location',
      label: 'Residence',
      value: data?.country || '--',
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: Color.primary}}>
      <View
        style={{backgroundColor: Color.headerBG, height: verticalScale(150)}}>
        <View style={{marginHorizontal: scale(8)}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{marginTop: verticalScale(20)}}>
            <AntDesign
              name="arrowleft"
              size={verticalScale(20)}
              color={Color.black}
            />
          </TouchableOpacity>

          <View style={styles.imgIconView}>
            {loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: verticalScale(80),
                  width: verticalScale(80),
                }}>
                <ActivityIndicator size="small" color={Color.primaryGreen} />
              </View>
            ) : (
              <Image
                source={profileImage ? {uri: profileImage} : image}
                style={styles.img}
              />
            )}

            <TouchableOpacity
              style={styles.icnWhiteView}
              onPress={() => setModalVisible(true)}>
              <View style={styles.icnPrimaryView}>
                <Entypo name="camera" size={15} color={Color.black} />
              </View>
            </TouchableOpacity>

            <Text style={styles.profileName}>{data?.fullName}</Text>

            <CameraPicker
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onImageSelect={handleImageSelect}
            />
          </View>
        </View>
      </View>

      <View style={{marginTop: verticalScale(40)}}>
        {information?.map(item => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: verticalScale(10),
              marginLeft: scale(20),
            }}
            key={item?.id}>
            <View
              style={{
                height: scale(35),
                width: scale(35),
                borderRadius: scale(50),
                backgroundColor: Color.lightGreen,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons
                name={item?.icon}
                size={scale(20)}
                color={Color.primaryGreen}
              />
            </View>
            <View style={{marginLeft: scale(20)}}>
              <Text
                style={{
                  color: Color.gray,
                  fontWeight: '600',
                  fontSize: scale(12),
                }}>
                {item?.label}
              </Text>
              <Text
                style={{
                  fontSize: scale(13),
                  fontWeight: '700',
                  color: Color.black,
                }}>
                {item?.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MainProfile;

const styles = StyleSheet.create({
  imgIconView: {
    flexDirection: 'row',
    marginTop: verticalScale(50),
    marginLeft: scale(15),
  },
  img: {
    height: verticalScale(80),
    width: verticalScale(80),
    borderRadius: scale(100),
  },
  icnWhiteView: {
    height: verticalScale(35),
    width: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primary,
    borderRadius: scale(55),
    marginTop: verticalScale(50),
    marginStart: scale(-35),
  },
  icnPrimaryView: {
    height: verticalScale(25),
    width: verticalScale(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.secondary,
    borderRadius: scale(50),
  },
  profileName: {
    fontSize: verticalScale(18),
    fontWeight: '700',
    color: Color.txt,
    marginLeft: scale(20),
    marginTop: verticalScale(20),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,100,100,0.5)',
  },
  whiteContainer: {
    width: '65%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: scale(10),
    paddingVertical: verticalScale(15),
  },
  title: {
    fontSize: verticalScale(14),
    fontWeight: '700',
    color: Color.txt,
    marginBottom: verticalScale(10),
  },
  border: {
    borderBottomColor: Color.borderColor,
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: verticalScale(10),
  },
  btnTxt: {
    fontSize: verticalScale(14),
    fontWeight: '600',
    color: Color.gray,
  },
});
