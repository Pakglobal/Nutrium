import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale, verticalScale} from 'react-native-size-matters';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Color from '../../../assets/colors/Colors';
import PickerModal from '../../../Components/PickerModal';

const MainProfile = ({route}) => {
  const data = route?.params?.data;

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [filePath, setFilePath] = useState({});

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    setModalVisible(false);
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setFilePath(response);
      });
    }
  };

  const chooseFile = type => {
    setModalVisible(false);
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response);
    });
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
            <AntDesign name="arrowleft" size={verticalScale(20)} />
          </TouchableOpacity>

          <View style={styles.imgIconView}>
            {filePath.assets && filePath.assets.length > 0 ? (
              <Image
                source={{uri: filePath.assets[0].uri}}
                style={styles.img}
              />
            ) : (
              <Image
                source={require('../../../assets/Images/profile.jpg')}
                style={styles.img}
              />
            )}
            <TouchableOpacity
              style={styles.icnWhiteView}
              onPress={() => setModalVisible(true)}>
              <View style={styles.icnPrimaryView}>
                <Entypo
                  name="camera"
                  size={verticalScale(15)}
                  color={Color.primary}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.profileName}>{data?.fullName}</Text>
          </View>
        </View>
      </View>

      <View style={{marginTop: verticalScale(40)}}>
        {information.map(item => (
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

      <PickerModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        pressableClose={() => setModalVisible(false)}
        captureImagePress={() => captureImage('photo')}
        chooseFilePress={() => chooseFile('photo')}
      />
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
    borderRadius: 55,
    marginTop: verticalScale(50),
    marginStart: scale(-35),
  },
  icnPrimaryView: {
    height: verticalScale(25),
    width: verticalScale(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.secondary,
    borderRadius: 50,
  },
  profileName: {
    fontSize: verticalScale(18),
    fontWeight: '700',
    color: Color.txt,
    marginLeft: scale(20),
    marginTop: verticalScale(20),
  },
});
