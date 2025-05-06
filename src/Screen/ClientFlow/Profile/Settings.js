import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Color} from '../../../assets/styles/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {updateUnits} from '../../../redux/unit';
import {useDispatch} from 'react-redux';
import Glass from '../../../assets/Images/glass.svg';
import Bottle from '../../../assets/Images/bottel.svg';
import Header from '../../../Components/Header';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState(true);
  const [mealNotifications, setMealNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [waterNotifications, setWaterNotifications] = useState(true);
  const [pressContainer, setPressContainer] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState({
    name: '1 glass',
    volume: '200 mL',
    image: Glass,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [units, setUnits] = useState({
    Height: 'Centimeter',
    Weight: 'Kilogram',
    Volume: 'Liter',
    Energy: 'Kilocalorie',
    Distance: 'Kilometer',
  });

  const containerOptions = [
    {
      name: '1 glass',
      volume: '200 ml',
      image: Glass,
    },
    {
      name: '1 bottle',
      volume: '300 ml',
      image: Bottle,
    },
    {
      name: '1 bottle',
      volume: '500 ml',
      image: Bottle,
    },
  ];

  const unitOptions = {
    Height: ['Centimeter', 'Foot & Inch'],
    Weight: ['Kilogram', 'Pound', 'Stone'],
    Volume: ['Liter', 'Fluid Ounce'],
    Energy: ['Kilocalorie', 'Kilojoule'],
    Distance: ['Kilometer', 'Mile'],
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
      return () => {};
    }, []),
  );

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [
    notifications,
    mealNotifications,
    messageNotifications,
    waterNotifications,
    selectedContainer,
    units,
  ]);

  const loadSettings = async () => {
    try {
      const settingsJson = await AsyncStorage.getItem('userSettings');
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);

        setNotifications(settings.notifications);
        setMealNotifications(settings.mealNotifications);
        setMessageNotifications(settings.messageNotifications);
        setWaterNotifications(settings.waterNotifications);

        if (settings.selectedContainer) {
          const containerName = settings.selectedContainer.name;
          const containerVolume = settings.selectedContainer.volume;

          const container = containerOptions.find(
            c => c.name === containerName && c.volume === containerVolume,
          );

          if (container) {
            setSelectedContainer(container);
          }
        }

        setUnits(settings.units);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const serializableContainer = {
        name: selectedContainer.name,
        volume: selectedContainer.volume,
      };

      const settings = {
        notifications,
        mealNotifications,
        messageNotifications,
        waterNotifications,
        selectedContainer: serializableContainer,
        units,
      };

      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const openModal = unitType => {
    setSelectedUnit(unitType);
    setModalVisible(true);
  };

  const selectUnit = unitValue => {
    const updatedUnits = {...units, [selectedUnit]: unitValue};
    setUnits(updatedUnits);

    dispatch(updateUnits(updatedUnits));

    setModalVisible(false);
    setUnits(prev => ({...prev, [selectedUnit]: unitValue}));
    setModalVisible(false);
  };

  const handleSelectContainer = container => {
    setSelectedContainer(container);
    setPressContainer(false);
  };

  const handleNotificationsToggle = value => {
    setNotifications(value);
    if (!value) {
      setMealNotifications(false);
      setMessageNotifications(false);
      setWaterNotifications(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header screenheader={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: scale(16)}}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.settingTitle]}>Notifications</Text>
            <Text style={[styles.settingDescription]}>
              You want to receive notifications
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={handleNotificationsToggle}
          />
        </View>

        <Text style={styles.sectionTitle}>Meal notifications</Text>
        <View style={styles.settingRow}>
          <View>
            <Text
              style={[styles.settingTitle, !notifications && {opacity: 0.5}]}>
              Meal notifications
            </Text>
            <Text
              style={[
                styles.settingDescription,
                !notifications && {opacity: 0.5},
              ]}>
              You will be notified with your meals
            </Text>
          </View>
          <Switch
            value={mealNotifications}
            onValueChange={value => setMealNotifications(value)}
            disabled={!notifications}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text
              style={[
                styles.settingTitle,
                !notifications && {opacity: 0.5},
                !mealNotifications && {opacity: 0.5},
              ]}>
              Meal notification time
            </Text>
            <Text
              style={[
                styles.settingDescription,
                !notifications && {opacity: 0.5},
                !mealNotifications && {opacity: 0.5},
              ]}>
              You will be notified at meal time
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Professional message notifications
        </Text>
        <View style={styles.settingRow}>
          <View>
            <Text
              style={[styles.settingTitle, !notifications && {opacity: 0.5}]}>
              Professional message notifications
            </Text>
            <Text
              style={[
                styles.settingDescription,
                !notifications && {opacity: 0.5},
              ]}>
              You will be notified when your professional{'\n'}sends you a
              message
            </Text>
          </View>
          <Switch
            value={messageNotifications}
            onValueChange={value => setMessageNotifications(value)}
            disabled={!notifications}
          />
        </View>

        <Text style={styles.sectionTitle}>Water intake notifications</Text>
        <View style={styles.settingRow}>
          <View>
            <Text
              style={[styles.settingTitle, !notifications && {opacity: 0.5}]}>
              Water intake notifications
            </Text>
            <Text
              style={[
                styles.settingDescription,
                !notifications && {opacity: 0.5},
              ]}>
              Notifications are enabled
            </Text>
          </View>
          <Switch
            value={waterNotifications}
            onValueChange={value => setWaterNotifications(value)}
            disabled={!notifications}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text
              style={[
                styles.settingTitle,
                !notifications && {opacity: 0.5},
                !waterNotifications && {opacity: 0.5},
              ]}>
              Notifications time
            </Text>
            <Text
              style={[
                styles.settingDescription,
                !notifications && {opacity: 0.5},
                !waterNotifications && {opacity: 0.5},
              ]}>
              Notifications schedule is according to the meal plan schedule
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.settingRow}
          onPress={() => setPressContainer(true)}>
          <View>
            <Text style={styles.settingTitle}>Container</Text>
            <Text style={styles.settingDescription}>
              {selectedContainer?.name} {selectedContainer?.volume}
            </Text>
          </View>
        </Pressable>

        <Modal
          visible={pressContainer}
          onRequestClose={() => setPressContainer(false)}
          transparent={true}>
          <TouchableWithoutFeedback onPress={() => setPressContainer(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <View style={{marginHorizontal: scale(20)}}>
                  <Text
                    style={{
                      fontSize: scale(15),
                      color: Color.gray,
                      marginBottom: verticalScale(10),
                    }}>
                    Container
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    {containerOptions.map((container, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleSelectContainer(container)}
                        style={{alignItems: 'center'}}>
                        {typeof container.image === 'function' ? (
                          <container.image
                            height={scale(30)}
                            width={scale(30)}
                          />
                        ) : (
                          <Image source={container.image} />
                        )}
                        <Text style={styles.modalTxt}>{container?.name}</Text>
                        <Text style={styles.modalTxt}>{container?.volume}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Text style={styles.sectionTitle}>Units</Text>
        <View style={styles.settingRow}>
          <Pressable onPress={() => openModal('Height')}>
            <Text style={styles.settingTitle}>Height unit</Text>
            <Text style={styles.settingDescription}>
              The height unit is {units?.Height}
            </Text>
          </Pressable>
        </View>

        <View style={styles.settingRow}>
          <Pressable onPress={() => openModal('Weight')}>
            <Text style={styles.settingTitle}>Weight unit</Text>
            <Text style={styles.settingDescription}>
              The weight unit is {units?.Weight}
            </Text>
          </Pressable>
        </View>

        <View style={styles.settingRow}>
          <Pressable onPress={() => openModal('Volume')}>
            <Text style={styles.settingTitle}>Volume unit</Text>
            <Text style={styles.settingDescription}>
              The volume unit is {units?.Volume}
            </Text>
          </Pressable>
        </View>

        <View style={styles.settingRow}>
          <Pressable onPress={() => openModal('Energy')}>
            <Text style={styles.settingTitle}>Energy unit</Text>
            <Text style={styles.settingDescription}>
              The energy unit is {units?.Energy}
            </Text>
          </Pressable>
        </View>

        <View style={styles.settingRow}>
          <Pressable onPress={() => openModal('Distance')}>
            <Text style={styles.settingTitle}>Distance unit</Text>
            <Text style={styles.settingDescription}>
              The distance unit is {units?.Distance}
            </Text>
          </Pressable>
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 20,
                  borderRadius: 10,
                  width: '80%',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: verticalScale(10),
                    color: Color.black,
                  }}>
                  {selectedUnit} Unit
                </Text>

                {unitOptions[selectedUnit]?.map((unit, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => selectUnit(unit)}
                    style={{
                      padding: 10,
                      borderBottomWidth:
                        index !== unitOptions[selectedUnit]?.length - 1 ? 1 : 0,
                      borderColor: '#ddd',
                    }}>
                    <Text style={{fontSize: 14, color: Color.black}}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  sectionTitle: {
    fontSize: scale(15),
    fontWeight: '700',
    color: Color.gray,
    marginTop: verticalScale(14),
    marginBottom: verticalScale(8),
  },
  settingRow: {
    backgroundColor: Color.white,
    padding: scale(8),
    borderRadius: scale(8),
    marginBottom: verticalScale(10),
    shadowColor: Color.black,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTitle: {
    fontSize: scale(14),
    fontWeight: '500',
    color: Color.black,
  },
  settingDescription: {
    fontSize: scale(12),
    color: Color.gray,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '85%',
    paddingVertical: verticalScale(15),
    backgroundColor: Color.white,
    borderRadius: scale(10),
  },
  modalTxt: {
    fontSize: scale(12),
    color: Color.black,
  },
  modalImg: {
    width: scale(30),
    height: scale(30),
    marginBottom: verticalScale(10),
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(10),
  },
});

export default SettingsScreen;
