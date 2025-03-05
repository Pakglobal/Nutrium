import {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Color from '../assets/colors/Colors';

const NTextInput = ({
  onChangeText,
  values,
  placeholder,
  textContainerStyle,
  eyeIcon,
  errorMessage,
  textInputStyle,
  isTextRight,
  rightText,
  OnInputClick,
  pressble,
  valuesOnText,
  amPm,
  inputPlaceHolder
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <View style={textContainerStyle}>
      <Text style={styles.topText}>{placeholder}</Text>
      {pressble ? (
        <TouchableOpacity
          style={[styles.input, {...textInputStyle, justifyContent: 'center'}]}
          onPress={OnInputClick}>
          <Text
            style={{
              fontSize: verticalScale(12),
              fontWeight: '500',
              color: Color.black,
            }}>
            {valuesOnText} {amPm}
          </Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={[styles.input, {...textInputStyle}]}
          onChangeText={onChangeText}
          value={values}
          secureTextEntry={eyeIcon ? !isPasswordVisible : false}
          placeholder={inputPlaceHolder}
        />
      )}

      {eyeIcon ? (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            color={Color.txt}
            size={verticalScale(18)}
          />
        </TouchableOpacity>
      ) : null}
      {isTextRight ? (
        <Text style={[styles.eyeIcon, {color: Color?.gray, fontWeight: '500'}]}>
          {rightText}
        </Text>
      ) : null}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default NTextInput;

const styles = StyleSheet.create({
  topText: {
    color: Color.gray,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: scale(5),
  },
  input: {
    height: scale(38),
    borderColor: Color.borderColor,
    borderWidth: 1,
    paddingHorizontal: scale(10),
    borderRadius: scale(50),
  },
  eyeIcon: {
    position: 'absolute',
    right: verticalScale(10),
    top: verticalScale(35),
  },
  errorMessage: {
    color: 'red',
    fontSize: scale(14),
    marginTop: verticalScale(5),
  },
});
