import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  AppState,
  Linking,
  Platform,
} from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
  isAvailable,
} from 'react-native-health-connect';
import BackgroundService from 'react-native-background-actions';

const StepCounter = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initializeHealthConnect = async () => {
      try {
        // const available = await isAvailable();
        // console.log('available', available)
        // if (!available) {
        //   setErrorMessage(
        //     'Health Connect is not available on this device. Please install the Health Connect app.',
        //   );
        //   return;
        // }

        const result = await initialize();
        console.log('result', result)
        if (result) {
          console.log('Health Connect initialized successfully');
          setIsInitialized(true);
          await requestHealthPermissions();
        } else {
          setErrorMessage('Failed to initialize Health Connect');
        }
      } catch (error) {
        console.error('Failed to initialize Health Connect:', error);
        setErrorMessage(`Health Connect error: ${error.message || 'Unknown error'}`);
      }
    };

    initializeHealthConnect();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && isMonitoring) {
        fetchStepData();
      }
    });

    console.log('subscription', subscription)

    return () => {
      subscription.remove();
      if (isMonitoring) {
        stopBackgroundMonitoring();
      }
    };
  }, [isMonitoring]);

  const requestHealthPermissions = async () => {
    try {
      const granted = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
        { accessType: 'write', recordType: 'Steps' },
      ]);
      console.log('granted', granted)
      if (granted.length > 0) {
        console.log('Health permissions granted');
        setHasPermissions(true);
      } else {
        console.log('Health permissions denied');
        setErrorMessage('Step counting permissions were denied');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setErrorMessage(`Permission error: ${error.message}`);
    }
  };

  const openHealthConnectSettings = async () => {
    try {
      if (Platform.OS === 'android') {
        await Linking.openURL('package:com.google.android.apps.healthdata').catch(() => {
          Linking.openURL(
            'https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata',
          );
        });
      }
    } catch (error) {
      console.error('Failed to open Health Connect settings:', error);
      setErrorMessage('Failed to open Health Connect settings');
    }
  };

  const fetchStepData = async () => {
    if (!isInitialized || !hasPermissions) {
      console.log('Cannot fetch data: not initialized or no permissions');
      return 0;
    }

    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const stepData = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay.toISOString(),
          endTime: endOfDay.toISOString(),
        },
      });

      console.log('stepData', stepData)

      if (!stepData.records || stepData.records.length === 0) {
        console.log('No step data available');
        setErrorMessage(
          'No step data found. Ensure a step-tracking app or device is synced with Health Connect.',
        );
        setStepCount(0);
        return 0;
      }

      const totalSteps = stepData.records.reduce((sum, record) => sum + (record.count || 0), 0);
      console.log('totalSteps', totalSteps);
      setStepCount(totalSteps);
      setErrorMessage('');
      return totalSteps;
    } catch (error) {
      console.error('Error fetching step data:', error);
      setErrorMessage(`Failed to fetch steps: ${error.message}`);
      setStepCount(0);
      return 0;
    }
  };

  const backgroundTask = async taskData => {
    const { delay } = taskData;

    console.log('Starting background task with delay:', delay);

    await new Promise(resolve => {
      const backgroundFetchInterval = setInterval(async () => {
        console.log('Running background fetch...');
        if (isInitialized && hasPermissions) {
          try {
            const steps = await fetchStepData();
            console.log('steps', steps);
          } catch (error) {
            console.error('Background fetch error:', error);
          }
        } else {
          console.log('Skipping background fetch: not initialized or no permissions');
        }
      }, delay);

      BackgroundService.addEventListener('expired', () => {
        console.log('Background task expired');
        clearInterval(backgroundFetchInterval);
        resolve();
      });
    });
  };

  const startBackgroundMonitoring = async () => {
    const options = {
      taskName: 'StepCounter',
      taskTitle: 'Step Counter Active',
      taskDesc: 'Monitoring your steps in the background',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'yourapp://stepcounter',
      parameters: {
        delay: 60000, // 1 minute
      },
    };
    console.log('options', options)

    try {
      await BackgroundService.start(backgroundTask, options);
      console.log('Background service started');
      setIsMonitoring(true);
      fetchStepData();
    } catch (error) {
      console.error('Failed to start background service:', error);
      setErrorMessage(`Failed to start monitoring: ${error.message}`);
    }
  };

  const stopBackgroundMonitoring = async () => {
    try {
      await BackgroundService.stop();
      console.log('Background service stopped');
      setIsMonitoring(false);
    } catch (error) {
      console.error('Failed to stop background service:', error);
      setErrorMessage(`Failed to stop monitoring: ${error.message}`);
    }
  };

  const retryInitialization = async () => {
    setErrorMessage('');
    setIsInitialized(false);
    setHasPermissions(false);
    setStepCount(0);
    if (isMonitoring) {
      await stopBackgroundMonitoring();
    }
    initializeHealthConnect();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Counter</Text>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Button title="Retry" onPress={retryInitialization} />
          <Button title="Open Health Connect" onPress={openHealthConnectSettings} />
        </View>
      ) : !isInitialized ? (
        <Text style={styles.status}>Initializing Health Connect...</Text>
      ) : !hasPermissions ? (
        <View>
          <Text style={styles.status}>Permissions required</Text>
          <Button title="Grant Permissions" onPress={requestHealthPermissions} />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.stepCount}>{stepCount}</Text>
          <Text style={styles.stepLabel}>STEPS TODAY</Text>
          {stepCount === 0 && (
            <Text style={styles.warningText}>
              No steps recorded. Ensure a step-tracking app is synced with Health Connect.
            </Text>
          )}
          <View style={styles.buttonContainer}>
            {!isMonitoring ? (
              <Button title="Start Monitoring" onPress={startBackgroundMonitoring} />
            ) : (
              <Button title="Stop Monitoring" onPress={stopBackgroundMonitoring} color="red" />
            )}
            <Button title="Refresh Steps" onPress={fetchStepData} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  status: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  stepLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    color: '#cc0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
    gap: 10,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  errorText: {
    color: '#cc0000',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default StepCounter;