import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import MessageComponent from '../../../Components/useMessaging';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Color from '../../../assets/colors/Colors';
import {scale as scaleSize, verticalScale} from 'react-native-size-matters';

const ClientProfileScreen = ({route}) => {
  const clientData = route?.params?.response[0];
  const userName = clientData?.fullName;
  const userImage = clientData?.image;
  const userWorkspace = clientData?.workplace;
  const otherUserId = clientData?._id;
  const userId = clientData?.userId;

  const navigation = useNavigation();
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {icon: 'fast-food', label: 'Meal plan', color: '#10B981'},
    {icon: 'calendar', label: 'Appointment', color: '#4B5563'},
    {icon: 'people', label: 'Follow-up', color: '#374151'},
    {icon: 'help-circle', label: 'Question', color: '#EF4444'},
  ];

  const [animValues] = useState(menuItems.map(() => new Animated.Value(0)));

  const toggleMenu = () => {
    setIsOpen(!isOpen);

    if (!isOpen) {
      Animated.stagger(
        100,
        animValues.map((anim, index) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ),
      ).start();
    } else {
      Animated.stagger(
        100,
        animValues
          .map((anim, index) =>
            Animated.timing(anim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          )
          .reverse(),
      ).start();
    }
  };

  const options = [
    {id: 0, label: 'INFORMATION'},
    {id: 1, label: 'MESSAGES'},
  ];

  const information = [
    {id: 0, icon: 'female', label: 'Gender', value: clientData?.gender || '--'},
    {
      id: 1,
      icon: 'calendar',
      label: 'Date of Birth',
      value: clientData?.dateOfBirth || '--',
    },
    {
      id: 2,
      icon: 'location',
      label: 'Country of Residence',
      value: clientData?.country || '--',
    },
    {id: 3, icon: 'mail', label: 'E-mail', value: clientData?.email || '--'},
    {
      id: 4,
      icon: 'call',
      label: 'Phone Number',
      value: clientData?.phoneNumber || '--',
    },
    {
      id: 5,
      icon: 'briefcase',
      label: 'Occupation',
      value: clientData?.occupation || '--',
    },
    {
      id: 6,
      icon: 'location',
      label: 'Workplace',
      value: clientData?.workplace || '--',
    },
    {id: 7, icon: 'pin', label: 'Zip Code', value: clientData?.zipcode || '--'},
  ];

  const handleSelctedOption = id => {
    setSelected(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              color={Color.white}
              size={scaleSize(22)}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Client profile</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: verticalScale(15),
          }}>
          {clientData?.image ? (
            <Image source={{uri: clientData?.image}} style={styles.avatar} />
          ) : (
            <Image
              source={
                clientData?.gender === 'Female'
                  ? require('../../../assets/Images/woman.png')
                  : require('../../../assets/Images/man.png')
              }
              style={styles.avatar}
            />
          )}
          <View style={{marginLeft: scaleSize(5)}}>
            <Text style={{color: Color.white, fontSize: scaleSize(14)}}>
              {userName}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Entypo name="location" color={Color.white} size={16} />
              <Text style={{marginLeft: scaleSize(5), color: Color.white}}>
                {userWorkspace}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.optionContainer}>
        {options.map(item => (
          <TouchableOpacity
            key={item?.id}
            onPress={() => handleSelctedOption(item?.id)}>
            <Text
              style={[
                styles.optionText,
                {
                  borderBottomColor:
                    item?.id === selected ? Color.primaryGreen : Color.black,
                  borderBottomWidth: item?.id === selected ? 2 : 0,
                  color: item?.id === selected ? Color.black : Color.gray,
                },
              ]}>
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selected === 0 && (
        <View>
          <View style={styles.bothContainer}>
            {information.map(item => (
              <View style={styles.infoContainer} key={item?.id}>
                <View style={styles.infoView}>
                  <Ionicons
                    name={item?.icon}
                    size={scaleSize(20)}
                    color={Color.primaryGreen}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.label}>{item?.label}</Text>
                  <Text style={styles.value}>{item?.value}</Text>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: scaleSize(0),
              right: scaleSize(16),
              alignItems: 'flex-end',
            }}>
            {menuItems.map((item, index) => (
              <Animated.View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: animValues[index],
                  transform: [
                    {
                      translateY: animValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                  marginBottom: verticalScale(8),
                }}>
                <Text style={styles.fabText}>{item.label}</Text>

                <TouchableOpacity
                  style={[styles.fabButton, {backgroundColor: item.color}]}>
                  <Ionicons name={item.icon} size={18} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            ))}

            <TouchableOpacity
              onPress={toggleMenu}
              style={[
                styles.bottomButton,
                {
                  transform: [{rotate: isOpen ? '45deg' : '0deg'}],
                  backgroundColor: isOpen ? '#FB923C' : '#FB923C',
                },
              ]}>
              <Ionicons name={'add-outline'} size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selected === 1 && (
        <MessageComponent
          userId={userId}
          otherUserId={otherUserId}
          userName={userName}
          image={userImage}
          showHeader={false}
          onBackPress={() => navigation.goBack()}
          containerStyle={{backgroundColor: '#f9f9f9'}}
        />
      )}
    </SafeAreaView>
  );
};

export default ClientProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  header: {
    backgroundColor: Color.primaryGreen,
    paddingVertical: verticalScale(20),
    paddingHorizontal: scaleSize(16),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: scaleSize(16),
    fontWeight: '600',
    color: Color.white,
    marginLeft: scaleSize(10),
  },
  optionText: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scaleSize(15),
    fontSize: scaleSize(14),
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Color.white,
    padding: scaleSize(8),
  },
  bothContainer: {
    marginHorizontal: scaleSize(16),
    marginTop: verticalScale(5),
    height: '72%',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(8),
  },
  infoView: {
    height: scaleSize(35),
    width: scaleSize(35),
    backgroundColor: Color.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleSize(20),
  },
  label: {
    fontSize: scaleSize(13),
    color: Color.black,
  },
  value: {
    fontSize: scaleSize(14),
    fontWeight: '600',
    color: Color.black,
  },
  textContainer: {
    marginLeft: scaleSize(10),
  },
  fabButton: {
    width: scaleSize(35),
    height: scaleSize(35),
    borderRadius: scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    backgroundColor: '#222',
    padding: scaleSize(5),
    fontSize: scaleSize(11),
    color: '#fff',
    borderRadius: scaleSize(4),
    marginRight: scaleSize(8),
    fontWeight: '500',
    textAlign: 'left',
  },
  bottomButton: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: Color.primaryGreen,
  },
  image: {
    width: scaleSize(200),
    height: scaleSize(200),
    borderRadius: scaleSize(8),
  },
});
