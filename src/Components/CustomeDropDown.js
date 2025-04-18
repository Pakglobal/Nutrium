import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomeDropDown = ({
    onPress,
    textStyle,
    item,
    keyitem,
    dropdownStyle
}) => {
    return (
        <View>
            <TouchableOpacity
                key={keyitem}
                style={dropdownStyle}
                onPress={onPress}>
                <Text
                    style={textStyle}>
                    {item}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomeDropDown

const styles = StyleSheet.create({})