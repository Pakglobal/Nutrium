import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {scale, verticalScale} from 'react-native-size-matters';
import {Color} from '../assets/styles/Colors';

const BackHeader = ({
  onPressBack,
  titleName,
  onPress,
  onSave,
  backText,
  showRightButton = true,
  loading,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={onPressBack}>
            <AntDesign
              name="arrowleft"
              color={Color.black}
              size={verticalScale(18)}
            />
          </TouchableOpacity>
          <Text style={styles.backTxt}>{backText}</Text>
        </View>

        {showRightButton && (
          <>
            {onSave ? (
              <TouchableOpacity onPress={onPress}>
                {loading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator
                      size="small"
                      color={Color.primaryColor}
                    />
                  </View>
                ) : (
                  <Text style={styles.save}>Save</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.plus} onPress={onPress}>
                <AntDesign
                  name="plus"
                  color={Color.white}
                  size={verticalScale(16)}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <Text style={styles.titleTxt}>{titleName}</Text>
    </View>
  );
};

export default BackHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.common,
    paddingVertical: verticalScale(15),
  },
  subContainer: {
    marginHorizontal: scale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  titleTxt: {
    fontSize: scale(20),
    color: Color.black,
    fontWeight: '600',
    marginTop: verticalScale(25),
    marginStart: scale(15),
  },
  plus: {
    padding: scale(5),
    backgroundColor: Color.primaryColor,
    borderRadius: scale(20),
  },
  save: {
    color: Color.primaryColor,
    fontWeight: '600',
    fontSize: scale(15),
  },
  backTxt: {
    marginLeft: scale(10),
    fontWeight: '600',
    fontSize: scale(14),
    color: Color.black,
  },
});
