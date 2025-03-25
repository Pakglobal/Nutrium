import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  LogBox,
  StyleSheet,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TypesCard from './TypesCard';
import Color from '../../assets/colors/Colors';
import SighnUpHeader from '../../Components/SighnUpHeader';
LogBox.ignoreAllLogs();

const data = [
  {
    id: 0,
    title: 'My organization has access to Nutrium Care benefits',
  },
  {
    id: 1,
    title: 'I have an invitation code',
  },
  {
    id: 2,
    title: 'I have Gympass access',
  },
  {
    id: 3,
    title: 'My dietitian or practitioner works with Nutrium',
  },
  {
    id: 4,
    title: 'None of the above',
  },
];

const SelectRegistrationType = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = option => {
    setSelectedOption(option);
  };

  const onNavigate = () => {
    if (
      selectedOption ===
        'My organization has access to Nutrium Care benefits' ||
      selectedOption === 'I have an invitation code'
    ) {
      navigation.navigate('registration');
    } else if (selectedOption === 'I have Gympass access') {
      navigation.navigate('unlockAccess');
    } else if (
      selectedOption === 'My dietitian or practitioner works with Nutrium'
    ) {
      navigation.navigate('getAccess');
    } else if (selectedOption === 'None of the above') {
      navigation.navigate('helpForRegistration');
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.primary}}>
      <SighnUpHeader onPressBack={() => navigation.goBack()} />
      <ScrollView
        style={{marginHorizontal: 15}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.queTxt}>What brings you to Nutrium?</Text>
        <View style={{marginTop: verticalScale(10)}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={({item, index}) => (
              <TypesCard
                item={item}
                selectedOption={selectedOption}
                onSelect={handleSelect}
              />
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
        <Button
          onPress={onNavigate}
          disabled={!selectedOption ? true : false}
          backgroundColor={
            !selectedOption ? Color.borderColor : Color.secondary
          }
          txtColor={!selectedOption ? Color.txt : Color.primary}
          iconColor={!selectedOption ? Color.txt : Color.primary}
          marginTop={verticalScale(20)}
          text={'Next'}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectRegistrationType;
const styles = StyleSheet.create({
  queTxt: {
    fontSize: verticalScale(20),
    color: Color.black,
    fontWeight: '500',
    marginTop: verticalScale(50),
  },
  btnContainer: {
    width: '100%',
    height: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    marginTop: verticalScale(20),
  },
});
