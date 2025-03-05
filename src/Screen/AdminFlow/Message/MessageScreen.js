import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../assets/colors/Colors';
import {useNavigation} from '@react-navigation/native';

const MessageScreen = ({selected, setSelected}) => {
  const navigation = useNavigation();

  const options = [
    {
      id: 0,
      label: 'OPEN',
    },
    {
      id: 1,
      label: 'ARCHIVED',
    },
  ];

  const messages = [
    {
      id: 0,
      name: 'Example client',
      conversation: 'Example conversation',
      openMessage:
        'Hi Snk! You can check here all the messages sent by your clients between appointments.',
      time: '11:11 AM',
      archivedMessage: 'You: New appointment',
      avatar: 'https://via.placeholder.com/50',
    },
  ];

  const handleSelctedOption = id => {
    setSelected(id);
  };

  const handleMessageCard = () => {
    navigation.navigate('Chat');
  };

  return (
    <SafeAreaView>
      <View style={styles.optionContainer}>
        {options?.map(item => (
          <TouchableOpacity
            key={item?.id}
            onPress={() => handleSelctedOption(item?.id)}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                item?.id === selected ? Color.primaryGreen : Color.primary,
            }}>
            <Text
              style={{
                color: item?.id === selected ? Color.primary : Color.black,
                fontSize: scale(14),
              }}>
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selected === 0 && (
        <View>
          {messages.map(item => (
            <TouchableOpacity
              style={styles.messageCard}
              onPress={handleMessageCard}
              key={item?.id}>
              <View style={styles.messageCardContainer}>
                <Image source={{uri: item?.avatar}} style={styles.avatar} />
                <View>
                  <Text style={styles.clientName}>{item?.name}</Text>
                  <Text style={styles.conversation}>{item?.conversation}</Text>
                </View>
                <Text style={styles.time}>{item?.time}</Text>
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.messageText}>{item?.openMessage}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selected === 1 && (
        <View>
          {messages?.map(item => (
            <TouchableOpacity
              style={styles.messageCard}
              key={item?.id}
              onPress={handleMessageCard}>
              <View style={styles.messageCardContainer}>
                <Image source={{uri: item?.avatar}} style={styles.avatar} />
                <View>
                  <Text style={styles.clientName}>{item?.name}</Text>
                  <Text style={styles.conversation}>{item?.conversation}</Text>
                </View>
                <Text style={styles.time}>{item?.time}</Text>
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.messageText}>{item?.archivedMessage}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: scale(45),
  },
  messageCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    paddingVertical: verticalScale(15),
  },
  messageCard: {
    backgroundColor: '#fff',
    marginTop: scale(10),
    borderRadius: scale(5),
  },
  avatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: 25,
    marginRight: scale(10),
    backgroundColor: Color.primaryGreen,
  },
  clientName: {
    fontWeight: 'bold',
    fontSize: scale(14),
  },
  conversation: {
    fontSize: scale(12),
    color: '#777',
  },
  messageText: {
    fontSize: scale(14),
    color: '#555',
    paddingVertical: 5,
  },
  time: {
    fontSize: scale(12),
    color: '#888',
    position: 'absolute',
    right: scale(10),
    top: scale(10),
    fontWeight: '600',
  },
  messageContent: {
    padding: scale(10),
    backgroundColor: Color.lightGreen,
    marginBottom: scale(10),
    borderLeftColor: Color.primaryGreen,
    borderLeftWidth: 2,
  },
});

export default MessageScreen;
