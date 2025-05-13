import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from './Colors';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

export const LeftIcon = ({onGoBack}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          alignSelf: 'flex-start',
          position: 'absolute',
          zIndex: 1000,
          top: scale(16),
        },
      ]}
      onPress={onGoBack}>
      <View style={styles.button}>
        <FontAwesome6 name="arrow-left" size={22} color={Color.white} />
      </View>
    </TouchableOpacity>
  );
};

export const RightIcon = ({onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          alignSelf: 'flex-end',
          position: 'absolute',
          bottom: scale(0),
          right: scale(0),
        },
      ]}
      onPress={onPress}>
      <View style={styles.button}>
        <FontAwesome6 name="arrow-right" size={22} color={Color.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primaryColor,
    borderRadius: scale(25),
    height: scale(32),
    width: scale(32),
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: scale(12),
    padding: scale(4),
  },
});
