

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Color } from '../assets/styles/Colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale, verticalScale } from 'react-native-size-matters';
import { Font } from '../assets/styles/Fonts';
import { color } from 'react-native-reanimated';
import CustomShadow from './CustomShadow';
import { shadowStyle } from '../assets/styles/Shadow';

const CustomeDropDown = ({
    items = [],
    selectedItem,
    onSelect,
    textStyle,
    dropdownStyle,
    inputStyle,
    shadowRadius
}) => {
    const [showDropDown, setShowDropDown] = useState(false);

    return (
        <View>
            <CustomShadow radius={shadowRadius || 2} style={shadowStyle}>

                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.inputContainer,inputStyle]}
                    onPress={() => setShowDropDown(!showDropDown)}
                >
                    <Text style={[styles.selectedText, textStyle]}>
                        {selectedItem || 'Select'}
                    </Text>
                    <MaterialIcons
                        name={showDropDown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={20}
                        color={Color.primaryColor}
                    />
                </TouchableOpacity>
            </CustomShadow>

            {showDropDown && (
                <View style={styles.dropdown}>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setShowDropDown(false);
                                onSelect(item);
                            }}
                            style={[
                                styles.dropdownItem,
                                dropdownStyle,
                                selectedItem === (item?.value || item) && {
                                    backgroundColor: Color.primaryColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    {
                                        color: Color.textColor,
                                        fontFamily:Font?.Poppins
                                    },
                                    selectedItem === (item?.value || item) && {
                                        color: Color.white,
                                    },
                                ]}
                            >
                                {item?.value || item}
                            </Text>

                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default CustomeDropDown;

const styles = StyleSheet.create({
    inputContainer: {
        borderRadius: 8,
        paddingHorizontal: scale(10),
        // borderColor: Color.primaryColor,
        // borderWidth: 1,
        height: verticalScale(38),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Color.white,
        // marginVertical: verticalScale(6),
        width: '98%',
        alignSelf: 'center'
    },
    selectedText: {
        fontWeight: '500',
        letterSpacing: 1,
        fontFamily: Font.PoppinsMedium,
        color: Color.textColor,
    },
    dropdown: {
        borderRadius: scale(4),
        borderWidth: 1,
        borderColor: Color.borderColor,
        backgroundColor: Color.white,
        marginTop: verticalScale(4),
        // elevation: 2,
        // zIndex: 10,
        marginTop: scale(5),
        width: '98%',
        alignSelf: "center"
    },
    dropdownItem: {
        padding: scale(10),
        // borderBottomWidth: 1,
        // borderBottomColor: Color.borderColor,
    },
});
