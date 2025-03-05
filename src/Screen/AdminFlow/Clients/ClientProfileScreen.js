import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

const ClientProfileScreen = ({route}) => {
  const clientData = route?.params?.response[0];

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

  const messages = [
    {
      id: 0,
      title: 'Appointment January 09, 2025',
      time: '11:11 AM',
      tag: 'Appointment',
      icon: 'pricetag',
      message: 'You: New appointment',
    },
    {
      id: 1,
      title: 'Example conversation',
      time: '11:11 AM',
      tag: 'Follow up',
      icon: 'pricetag',
      message:
        'Hi Snk! You can check here all the messages sent by your clients between appointments.',
    },
  ];

  const handleMessageCard = () => {
    navigation.navigate('Chat');
  };

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
              color={Color.primary}
              size={scale(22)}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Client profile</Text>
        </View>
        <View style={styles.imageContainer}>
          <View style={styles.image} />
          <View style={{marginLeft: scale(10)}}>
            <Text style={{color: Color.primary}}>
              {clientData?.fullName || 'Example Client'}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Entypo name="location" color={Color.primary} size={16} />
              <Text style={{marginLeft: scale(5), color: Color.primary}}>
                {clientData?.workplace || '--'}
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
        <View style={styles.bothContainer}>
          {information.map(item => (
            <View style={styles.infoContainer} key={item?.id}>
              <View style={styles.infoView}>
                <Ionicons
                  name={item?.icon}
                  size={scale(20)}
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
      )}

      {selected === 1 && (
        <View style={styles.bothContainer}>
          {messages?.map(item => (
            <TouchableOpacity
              style={styles.messageCard}
              key={item?.id}
              onPress={handleMessageCard}>
              <View style={styles.messContainer}>
                <View style={styles.titleTime}>
                  <Text style={styles.title}>{item?.title}</Text>
                  <Text style={styles.time}>{item?.time}</Text>
                </View>
                <View style={styles.icon}>
                  <Ionicons
                    name={item?.icon}
                    size={scale(18)}
                    color={'lightgray'}
                  />
                  <Text style={styles.tag}>{item?.tag}</Text>
                </View>
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.messageText}>{item?.message}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View
        style={{
          position: 'absolute',
          bottom: scale(16),
          right: scale(16),
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
              marginBottom: scale(8),
            }}>
            <Text style={styles.fabText}>{item.label}</Text>

            <TouchableOpacity
              style={[styles.fabButton, {backgroundColor: item.color}]}>
              <Ionicons name={item.icon} size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <TouchableOpacity
          onPress={toggleMenu}
          style={[
            styles.bottomButton,
            {
              transform: [{rotate: isOpen ? '45deg' : '0deg'}],
              backgroundColor: isOpen ? '#DC2626' : '#F97316',
            },
          ]}>
          <Ionicons name={isOpen ? 'close' : 'add'} size={30} color="#fff" />
        </TouchableOpacity>
      </View>
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
    padding: scale(10),
    backgroundColor: Color.primaryGreen,
    height: scale(130),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Color.primary,
    marginLeft: scale(10),
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(10),
  },
  image: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: Color.primary,
  },
  optionText: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    fontSize: scale(14),
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Color.primary,
    padding: scale(8),
  },
  bothContainer: {
    marginHorizontal: scale(8),
    marginTop: scale(5),
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(8),
  },
  infoView: {
    height: scale(35),
    width: scale(35),
    backgroundColor: Color.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(20),
  },
  label: {
    fontSize: scale(12),
  },
  value: {
    fontSize: scale(14),
    fontWeight: '700',
  },
  textContainer: {
    marginLeft: scale(10),
  },
  messContainer: {
    padding: scale(10),
    backgroundColor: Color.primary,
  },
  title: {
    fontSize: scale(14),
    fontWeight: '600',
  },
  time: {
    fontSize: scale(13),
    fontWeight: '600',
  },
  titleTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tag: {
    marginLeft: scale(5),
    color: Color.gray,
  },
  icon: {
    flexDirection: 'row',
    marginVertical: verticalScale(5),
    alignItems: 'center',
  },
  messageText: {
    fontWeight: '500',
  },
  messageContent: {
    padding: scale(10),
    backgroundColor: Color.lightGreen,
    marginBottom: scale(10),
    borderLeftColor: Color.primaryGreen,
    borderLeftWidth: 2,
  },
  messageCard: {
    backgroundColor: '#fff',
    marginTop: scale(10),
    borderRadius: scale(5),
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: verticalScale(5),
    right: 20,
    bottom: 0,
  },
  fabButton: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(30),
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
    padding: scale(5),
    fontSize: scale(13),
    color: '#fff',
    borderRadius: scale(4),
    marginRight: scale(8),
    fontWeight: '500',
    textAlign: 'left',
    width: '45%',
  },
  bottomButton: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
