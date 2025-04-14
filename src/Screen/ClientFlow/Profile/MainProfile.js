
import React, {useCallback, useEffect, useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
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
import Toast from 'react-native-simple-toast';
import {setImage} from '../../../redux/client';

const MainProfile = ({route}) => {
  const data = route?.params?.data;

  const dispatch = useDispatch();
  const tokenId = useSelector(state => state?.user?.token);
  const token = tokenId?.token;
  const id = tokenId?.id;

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
        } else {
     
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
            {/* {loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: verticalScale(80),
                  width: verticalScale(80),
                }}>
                <ActivityIndicator size="small" color={Color.primaryColor} />
              </View>
            ) : (

              <Image source={imgSource} style={styles.img} />
            )} */}

            {loading ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: verticalScale(80),
                  width: verticalScale(80),
                }}>
                <ActivityIndicator size="small" color={Color.primaryColor} />
              </View>
            ) : (
              <TouchableOpacity onPress={() => setFullscreenImageVisible(true)}>
                <Image source={imgSource} style={styles.img} />
              </TouchableOpacity>
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
                color={Color.primaryColor}
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
    backgroundColor: Color.white,
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
    backgroundColor: Color.white,
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