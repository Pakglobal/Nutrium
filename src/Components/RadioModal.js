import React from 'react';
import {View, Text, Modal, Pressable, TouchableOpacity} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '../assets/colors/Colors';

const RadioModal = ({
  visible,
  onRequestClose,
  option,
  title,
  onSelect,
  selectedOption,
}) => {
  const handleSelect = value => {
    onSelect(value);
    onRequestClose();
  };
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onRequestClose}>
      <Pressable
        onPress={onRequestClose}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(100,100,100,0.5)',
        }}>
        <View
          style={{
            width: '90%',
            paddingVertical: verticalScale(20),
            backgroundColor: 'white',
            borderRadius: 10,
          }}>
          <View style={{marginHorizontal: scale(20)}}>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontSize: verticalScale(16),
                    fontWeight: '700',
                    color: Color.txt,
                  }}>
                  {title}
                </Text>
              </View>
              <TouchableOpacity
                style={{width: '10%', alignItems: 'flex-end'}}
                onPress={onRequestClose}>
                <AntDesign
                  name="close"
                  size={verticalScale(20)}
                  color={Color.gray}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: verticalScale(10)}}>
              <View>
                {option.map(option => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: verticalScale(15),
                    }}
                    key={option.id}
                    onPress={() => handleSelect(option.value)}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        height: verticalScale(20),
                        width: verticalScale(20),
                        borderWidth: 2,
                        borderColor:
                          selectedOption === option.value
                            ? Color.secondary
                            : Color.gray,
                      }}>
                      <View
                        style={{
                          borderRadius: 20,
                          height: verticalScale(10),
                          width: verticalScale(10),
                          backgroundColor:
                            selectedOption === option.value
                              ? Color.secondary
                              : Color.primary,
                          borderColor:
                            selectedOption === option.value
                              ? Color.secondary
                              : Color.gray,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontWeight: '700',
                        marginStart: scale(15),
                        fontSize: verticalScale(12),
                        color: Color.txt,
                      }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default RadioModal;
