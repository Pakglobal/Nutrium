import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../../Components/Header'
import { scale } from 'react-native-size-matters'

const ChallengeDetailsScreen = () => {
    return (
        <SafeAreaView>
            <Header screenheader={true} rightHeaderButton={false} screenName={'Challenge Details'} />

       
            <View style={styles.container}>
                <Text>b uybn h</Text>
            </View>

        </SafeAreaView>
    )
}

export default ChallengeDetailsScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: scale(15),
        width: '90%',
        alignSelf: 'center',
        borderRadius: scale(20),
        marginTop: scale(20),
        borderWidth: 1,
        borderTopColor: '#4CAF50', // Green border color
        borderColor:'white',
        borderTopWidth: scale(5),
    }
})