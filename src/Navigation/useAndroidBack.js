import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import {useCallback} from 'react';

const useAndroidBack = customBackHandler => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (customBackHandler) {
          customBackHandler(); // Call the custom back handler
          return true; // Prevent default back behavior
        }
        navigation.goBack(); // Fallback to default navigation
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation, customBackHandler]),
  );
};

export default useAndroidBack;
