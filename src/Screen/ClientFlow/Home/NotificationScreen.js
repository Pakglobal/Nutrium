import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem('notifications');
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsSeen = async id => {
    try {
      const updatedNotifications = notifications.map(notif =>
        notif.id === id ? {...notif, seen: true} : notif,
      );
      setNotifications(updatedNotifications);
      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(updatedNotifications),
      );
    } catch (error) {
      console.error('Error marking notification as seen:', error);
    }
  };

  const handleNotificationPress = notification => {
    if (notification.senderId && notification.receiverId) {
      navigation.navigate('MessageScreen', {
        userId: notification.receiverId,
        otherUserId: notification.senderId,
        userName: notification.title.split('from ')[1] || 'User',
      });
      markAsSeen(notification.id);
    }
  };

  const renderNotification = ({item}) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.seen && styles.unseen]}
      onPress={() => handleNotificationPress(item)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications available</Text>
      ) : (
        <FlatList
          data={notifications.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
          )}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  unseen: {
    backgroundColor: '#e6f3ff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  noNotifications: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationScreen;
