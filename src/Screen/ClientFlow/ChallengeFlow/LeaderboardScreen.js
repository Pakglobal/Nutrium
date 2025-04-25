import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Color } from '../../../assets/styles/Colors'
import LeaderboardBackground from '../../../assets/Images/leaderBoardImg.svg'

const LeaderboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* SVG Background */}
      <View style={styles.svgBackground}>
        <LeaderboardBackground width="100%" height="90%" preserveAspectRatio="xMinMin slice" />
      </View>

      {/* Content over SVG */}
      <View style={styles.content}>
        <Text style={styles.text}>nb</Text>
      </View>
    </SafeAreaView>
  )
}

export default LeaderboardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color?.white,
    // position: 'relative',
  },
  svgBackground: {
    // ...StyleSheet.absoluteFillObject,
    height: '50%',
    // zIndex: 0,
    backgroundColor:"red"
  },

})
