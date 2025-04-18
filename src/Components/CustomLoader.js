import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Color } from '../assets/styles/Colors'

const CustomLoader = () => {
    return (
        <View>
            <ActivityIndicator size={"large"} color={ Color.primaryColor} />
        </View>
    )
}

export default CustomLoader

const styles = StyleSheet.create({})