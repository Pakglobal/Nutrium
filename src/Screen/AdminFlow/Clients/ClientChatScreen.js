import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../../assets/colors/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const ClientChatScreen = () => {
  const navigation = useNavigation();
  const [chat, setChat] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" color={Color.white} size={scale(22)} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Example conversation</Text>
        </View>
        <Ionicons
          name="information-circle-outline"
          color={Color.white}
          size={scale(22)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="camera" size={scale(24)} color={Color.black} />
        <TextInput
          value={chat}
          onChangeText={e => setChat(e)}
          placeholder="Type your message here"
          style={styles.input}
          placeholderTextColor="#999"
        />
      </View>
    </SafeAreaView>
  );
};

export default ClientChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(8),
    height: scale(50),
    backgroundColor: Color.primaryColor,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: scale(10),
    fontSize: scale(16),
    fontWeight: 'bold',
    color: Color.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: scale(0),
    left: scale(0),
    right: scale(0),
    backgroundColor: '#f5f5f5',
    borderRadius: scale(10),
    paddingHorizontal: scale(15),
    height: scale(45),
  },
  input: {
    flex: 1,
    marginLeft: scale(10),
    fontSize: scale(14),
    color: '#000',
  },
});
