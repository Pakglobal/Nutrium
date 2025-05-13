import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Color} from '../../../assets/styles/Colors';
import CameraPicker from '../../../Components/CameraPicker';
import {UpdateImage} from '../../../Apis/ClientApis/ProfileApi';
import {useDispatch, useSelector} from 'react-redux';
import {setImage} from '../../../redux/client';
import CustomLoader from '../../../Components/CustomLoader';
import {Font} from '../../../assets/styles/Fonts';

const MainProfile = ({route}) => {
  const data = route?.params?.data;

  const dispatch = useDispatch();
  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const token = tokenId?.token || guestTokenId?.token;
  const id = tokenId?.id || guestTokenId?.id;

  const updateProfileImage = useSelector(state => state?.client?.imageInfo);
  const profileImage = data?.image;

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullscreenImageVisible, setFullscreenImageVisible] = useState(false);

  const handleImageSelect = async imageResponse => {
    if (imageResponse) {
      const imageUrl = {
        uri: imageResponse?.uri,
        fileName: imageResponse?.fileName,
        type: imageResponse?.type,
      };
      try {
        setLoading(true);
        const response = await UpdateImage(token, id, imageUrl);
        if (
          response?.message === 'Client details updated successfully' ||
          response?.success === true
        ) {
          dispatch(setImage(response?.client?.image));
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
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

  let imgSource;
  if (updateProfileImage && typeof updateProfileImage === 'string') {
    imgSource = {uri: updateProfileImage};
  } else if (profileImage && typeof profileImage === 'string') {
    imgSource = {uri: profileImage};
  } else {
    imgSource =
      data?.gender === 'Female'
        ? require('../../../assets/Images/woman.png')
        : require('../../../assets/Images/man.png');
  }

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <View
        style={{backgroundColor: Color.headerBG, height: verticalScale(150)}}>
        <View style={{marginHorizontal: scale(16)}}>
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
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => setFullscreenImageVisible(true)}>
                <Image source={imgSource} style={styles.img} />
              </TouchableOpacity>
              {loading && (
                <View style={styles.loaderContainer}>
                  <CustomLoader size={'small'} />
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.cameraContainer}
              onPress={() => setModalVisible(true)}>
              <Entypo name="camera" size={18} color={Color.white} />
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
                color={Color.primaryColor}
              />
            </View>
            <View style={{marginLeft: scale(20)}}>
              <Text
                style={{
                  color: Color.gray,
                  fontWeight: '600',
                  fontSize: scale(12),
                  fontFamily: Font?.Poppins,
                }}>
                {item?.label}
              </Text>
              <Text
                style={{
                  fontSize: scale(13),
                  fontWeight: '700',
                  color: Color.black,
                  fontFamily: Font?.Poppins,
                }}>
                {item?.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Modal
        visible={fullscreenImageVisible}
        transparent={true}
        onRequestClose={() => setFullscreenImageVisible(false)}>
        <View style={styles.fullscreenImageContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFullscreenImageVisible(false)}>
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={imgSource}
            style={styles.fullscreenImage}
            resizeMode="cover"
          />
        </View>
      </Modal>
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
  imageContainer: {
    position: 'relative',
    height: verticalScale(80),
    width: verticalScale(80),
  },
  img: {
    height: verticalScale(80),
    width: verticalScale(80),
    borderRadius: scale(100),
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: scale(100),
  },
  cameraContainer: {
    height: verticalScale(28),
    width: verticalScale(28),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.primaryColor,
    borderRadius: scale(55),
    position: 'absolute',
    bottom: 0,
    left: '20%',
  },
  // icnPrimaryView: {
  //   height: verticalScale(22),
  //   width: verticalScale(22),
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: Color.primaryColor,
  //   borderRadius: scale(50),
  // },
  profileName: {
    fontSize: scale(18),
    fontWeight: '700',
    color: Color.txt,
    marginLeft: scale(20),
    marginTop: verticalScale(20),
  },
  fullscreenImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '50%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});
