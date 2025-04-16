import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import {useCallback} from 'react';

const useAndroidBack = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );
};

export default useAndroidBack;
