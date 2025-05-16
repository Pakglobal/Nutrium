import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Image,
  StyleSheet,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Color} from '../../../../assets/styles/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddMealInFoodDiary,
  DeleteMealInFoodDiary,
  DeleteSpecificMealInFoodDiary,
} from '../../../../Apis/ClientApis/FoodDiaryApi';
import Header from '../../../../Components/Header';
import {Font} from '../../../../assets/styles/Fonts';
import CustomShadow from '../../../../Components/CustomShadow';

const LogMeal = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state?.user?.userInfo);
  const token = userInfo?.token;
  const meal = useSelector(state => state?.client?.addInfo);
  const plus = meal?.press === 'plus';

  const mealType = meal?.meal || meal?.type;
  const mealTime = meal?.time;
  const mealName = meal?.name;
  const foodId = meal?.foodId;
  const foodIndex = meal?.foodIndex;
  const scheduleId = meal?.id;
  const registrationDate = '2025-02-21T18:30:00.023Z';

  const navigation = useNavigation();
  const [showAction, setShowAction] = useState(false);
  const [comments, setComments] = useState('');
  const [showImgaePicker, setShowImgaePicker] = useState(false);
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

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    setShowImgaePicker(false);
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
    setShowImgaePicker(false);
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

  const handleSave = async () => {
    const payload = {
      token: token,
      registrationDate: registrationDate,
      mealType: mealType,
      time: mealTime,
      foodId: foodId,
      comments: comments,
    };
    const response = await AddMealInFoodDiary(payload);
    if (
      response?.success === true ||
      response?.message === 'Food diary fetched successfully'
    ) {
      navigation.navigate('foodDiary');
    }
  };

  const handleNavigateSwapFood = name => {
    navigation.navigate('swapMeal', {
      name: name,
      time: mealTime,
      type: mealType,
      mealId: scheduleId,
    });
  };

  const handleDeleteMeal = async () => {
    const payload = {
      token: token,
      registrationDate: registrationDate,
      scheduleId: scheduleId,
    };

    const response = await DeleteMealInFoodDiary(payload);
    if (
      response?.message === 'Food item deleted successfully' ||
      response?.success === true
    ) {
      navigation.navigate('foodDiary');
    } else {
      console.log(response?.message);
    }
  };

  const handleDeleteSeparateMeal = async () => {
    const payload = {
      token: token,
      registrationDate: registrationDate,
      scheduleId: scheduleId,
      foodIndex: foodIndex,
    };

    const response = await DeleteSpecificMealInFoodDiary(payload);
  };

  return (
    <View style={{flex: 1, backgroundColor: Color.white}}>
      <Header
        screenheader={true}
        screenName={'Add Meal'}
        plus={false}
        handleSave={() => handleSave()}
      />
      <ScrollView
        style={{marginHorizontal: scale(16)}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTxt}>Log Your Meal</Text>

        <CustomShadow>
          <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <View style={{}}>
                <Text style={styles.title}>{mealType}</Text>
                <View style={styles.icon}>
                  <AntDesign
                    name="clockcircleo"
                    color={Color.black}
                    size={scale(16)}
                  />
                  <Text style={styles.time}>{mealTime}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => setShowAction(true)}>
                  <MaterialCommunityIcons
                    name="dots-horizontal-circle"
                    size={verticalScale(28)}
                    color={Color.primaryColor}
                    style={{marginHorizontal: scale(4)}}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('swapMeal', {
                      time: mealTime,
                      type: mealType,
                    })
                  }>
                  <MaterialCommunityIcons
                    name="plus-circle"
                    size={verticalScale(28)}
                    color={Color.primaryColor}
                    style={{marginHorizontal: scale(4)}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {mealName ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: verticalScale(5),
                  paddingHorizontal: scale(16),
                }}>
                <Text style={{color: Color.black, fontFamily: Font?.Poppins}}>
                  {mealName}
                </Text>
                <TouchableOpacity
                  onPress={() => handleNavigateSwapFood(mealName)}
                  style={{
                    backgroundColor: Color.primaryColor,
                    padding: scale(5),
                    borderRadius: scale(20),
                  }}>
                  <Ionicons
                    name="swap-horizontal"
                    color={Color.white}
                    size={scale(14)}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  paddingVertical: verticalScale(10),
                  paddingHorizontal: scale(16),
                }}>
                <Text
                  style={{
                    fontSize: scale(13),
                    color: Color.black,
                    textAlign: 'center',
                  }}>
                  You did not eat any foods in this meal
                </Text>
              </View>
            )}
          </View>
        </CustomShadow>
        <View
          style={{
            borderRadius: scale(10),
            marginTop: verticalScale(15),
          }}>
          <View style={styles.cardContent}>
            <View style={{}}>
              <Text style={styles.title}>Photo</Text>
              <Text style={{color: Color.gray, fontFamily: Font?.Poppins}}>
                Add a photo of your meal
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowImgaePicker(true)}
              style={styles.row}>
              <MaterialCommunityIcons
                name="plus-circle"
                size={verticalScale(28)}
                color={Color.primaryColor}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: 'center',
            }}>
            {filePath.assets && filePath.assets.length > 0 ? (
              <Image
                source={{uri: filePath.assets[0].uri}}
                style={styles.img}
                resizeMode="stretch"
              />
            ) : null}
          </View>
        </View>
        <CustomShadow>
          <View
            style={[
              styles.commentContainer,
              {marginBottom: verticalScale(10)},
            ]}>
            <Text style={styles.title}>Comments</Text>
            <CustomShadow color={Color?.gray}>
              <View style={styles.commentContent}>
                <TextInput
                  placeholder="Anything you'd like to add about your meal?"
                  placeholderTextColor={Color?.gray}
                  multiline={true}
                  style={{
                    fontSize: scale(12),
                    color: Color?.textColor,
                    fontFamily: Font?.Poppins,
                  }}
                  value={comments}
                  onChangeText={e => setComments(e)}
                />
              </View>
            </CustomShadow>
          </View>
        </CustomShadow>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showAction}
        onRequestClose={() => setShowAction(false)}>
        <Pressable
          onPress={() => setShowAction(false)}
          style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={{marginHorizontal: scale(20)}}>
              <Text style={styles.modalTxt}>choose an action</Text>
              {mealName && (
                <TouchableOpacity
                  style={{marginTop: verticalScale(20)}}
                  onPress={() => handleDeleteSeparateMeal()}>
                  <Text style={styles.modalOption}>
                    I did not eat this food
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{marginTop: verticalScale(20)}}
                onPress={() => handleDeleteMeal()}>
                <Text style={styles.modalOption}>Delete meal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: verticalScale(20)}}
                onPress={() => {
                  navigation.navigate('swapMeal');
                  setShowAction(false);
                }}>
                <Text style={styles.modalOption}>Add food</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: verticalScale(20)}}
                onPress={() => {
                  setShowAction(false);
                }}>
                <Text style={styles.modalOption}>
                  Change the hour of the meal
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showImgaePicker}
        onRequestClose={() => setShowImgaePicker(false)}>
        <Pressable
          onPress={() => setShowImgaePicker(false)}
          style={styles.container}>
          <View style={styles.whiteContainer}>
            <Text style={styles.tittle}>Add profile photo</Text>
            <View style={styles.border} />
            <TouchableOpacity onPress={() => captureImage('photo')}>
              <Text style={styles.btnTxt}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => chooseFile('photo')}>
              <Text style={[styles.btnTxt, {marginTop: verticalScale(15)}]}>
                Choose Photo
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default LogMeal;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: scale(8),
    borderColor: '#EEE',
    borderWidth: 1,
    backgroundColor: Color?.white,
    width: '98%',
    alignSelf: 'center',
  },
  cardContent: {
    backgroundColor: Color.white,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(8),
    justifyContent: 'space-between',
  },
  time: {
    marginLeft: scale(8),
    color: Color.black,
    fontSize: scale(12),
    fontFamily: Font?.Poppins,
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(8),
    backgroundColor: Color.white,
    padding: scale(4),
    borderRadius: scale(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentContainer: {
    borderRadius: scale(8),
    backgroundColor: Color.white,
    padding: scale(10),
    marginTop: verticalScale(15),
    width: '98%',
    alignSelf: 'center',
  },
  commentContent: {
    backgroundColor: Color.white,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(40),
    borderRadius: scale(8),
  },

  img: {
    height: verticalScale(140),
    width: '100%',
  },
  title: {
    fontSize: scale(15),
    color: Color.black,
    fontFamily: Font?.Poppins,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,100,100,0.5)',
  },
  modalView: {
    width: '80%',
    paddingVertical: verticalScale(20),
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTxt: {
    fontSize: scale(16),
    color: Color.gray,
    fontFamily: Font?.Poppins,
  },
  modalOption: {
    fontSize: scale(13),
    color: Color.textColor,
    fontFamily: Font?.Poppins,
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
  tittle: {
    fontSize: scale(14),
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
    fontSize: scale(14),
    fontWeight: '600',
    color: Color.gray,
  },
  headerTxt: {
    fontFamily: Font?.PoppinsSemiBold,
    color: Color?.textColor,
    fontSize: scale(15),
    marginVertical: scale(10),
  },
});
