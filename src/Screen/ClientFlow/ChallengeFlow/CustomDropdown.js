import React from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {Color} from './yourColorConfig'; // Adjust the color import as needed

const CustomDropdown = ({
  label,
  options,
  visible,
  setVisible,
  selectedValue,
  setSelectedValue,
  multiple = false,
}) => {
  const toggleOption = value => {
    if (multiple) {
      setSelectedValue(prev =>
        prev.includes(value)
          ? prev.filter(item => item !== value)
          : [...prev, value],
      );
    } else {
      setSelectedValue(value);
      setVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setVisible(true)}>
        <Text style={styles.dropdownLabel}>{label}</Text>
        <View style={styles.dropdownSelector}>
          <Text style={styles.dropdownText}>
            {multiple
              ? selectedValue.length > 0
                ? selectedValue
                    .map(sel => options.find(o => o.value === sel)?.label)
                    .join(', ')
                : `Select ${label}`
              : selectedValue
              ? options.find(o => o.value === selectedValue)?.label
              : `Select ${label}`}
          </Text>
          <Ionicons name="chevron-down" size={20} color={Color.gray} />
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#FFFFFF', '#F0F0F0']}
            style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={Color.black} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => toggleOption(item.value)}>
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                  {multiple && selectedValue.includes(item.value) && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Color.secondary}
                    />
                  )}
                  {!multiple && selectedValue === item.value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Color.secondary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
            {multiple && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setVisible(false)}>
                <Text style={styles.doneButtonText}>Confirm</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownLabel: {
    fontSize: 16,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  doneButton: {
    marginTop: 10,
    backgroundColor: Color.primary,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomDropdown;
