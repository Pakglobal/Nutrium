

// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import { Color } from '../assets/styles/Colors'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { scale, verticalScale } from 'react-native-size-matters';
// import { Font } from '../assets/styles/Fonts';
// import { color } from 'react-native-reanimated';

// const CustomeDropDown = ({
//     items = [],
//     selectedItem,
//     onSelect,
//     textStyle,
//     dropdownStyle
// }) => {
//     const [showDropDown, setShowDropDown] = useState(false);

//     return (
//         <View>
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 style={styles.inputContainer}
//                 onPress={() => setShowDropDown(!showDropDown)}
//             >
//                 <Text style={[styles.selectedText, textStyle]}>
//                     {selectedItem || 'Select'}
//                 </Text>
//                 <MaterialIcons
//                     name={showDropDown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
//                     size={20}
//                     color={Color.primaryColor}
//                 />
//             </TouchableOpacity>

//             {showDropDown && (
//                 <View style={styles.dropdown}>
//                     {items.map((item, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             onPress={() => {
//                                 setShowDropDown(false);
//                                 onSelect(item);
//                             }}
//                             style={[
//                                 styles.dropdownItem,
//                                 dropdownStyle,
//                                 selectedItem === (item?.value || item) && {
//                                     backgroundColor: Color.primaryColor,
//                                 },
//                             ]}
//                         >
//                             <Text
//                                 style={[
//                                     {
//                                         color: Color.textColor,
//                                     },
//                                     selectedItem === (item?.value || item) && {
//                                         color: Color.white,
//                                     },
//                                 ]}
//                             >
//                                 {item?.value || item}
//                             </Text>

//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             )}
//         </View>
//     );
// };

// export default CustomeDropDown;

// const styles = StyleSheet.create({
//     inputContainer: {
//         borderRadius: 8,
//         paddingHorizontal: scale(10),
//         borderColor: Color.primaryColor,
//         borderWidth: 1,
//         height: verticalScale(38),
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: Color.white,
//         marginVertical: verticalScale(6),
//     },
//     selectedText: {
//         fontWeight: '500',
//         letterSpacing: 1,
//         fontFamily: Font.PoppinsMedium,
//         color: Color.textColor,
//     },
//     dropdown: {
//         borderRadius: scale(4),
//         borderWidth: 1,
//         borderColor: Color.borderColor,
//         backgroundColor: Color.white,
//         marginTop: verticalScale(4),
//         elevation: 2,
//         zIndex: 10,
//     },
//     dropdownItem: {
//         padding: scale(10),
//         borderBottomWidth: 1,
//         borderBottomColor: Color.borderColor,
//     },
// });


import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Color } from '../assets/styles/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale, verticalScale } from 'react-native-size-matters';
import { Font } from '../assets/styles/Fonts';
import CustomShadow from './CustomShadow';
import { shadowStyle } from '../assets/styles/Shadow';

const CustomeDropDown = ({
    items = [],
    selectedItem = [],
    onSelect,
    textStyle,
    dropdownStyle,
    isMultiSelect = false, // NEW PROP
}) => {
    const [showDropDown, setShowDropDown] = useState(false);
    const [selectedItems, setSelectedItems] = useState(
        isMultiSelect ? selectedItem : selectedItem ? [selectedItem] : []
    );

    const toggleItem = (item) => {
        const value = item?.value || item;

        if (isMultiSelect) {
            const exists = selectedItems.includes(value);
            const updated = exists
                ? selectedItems.filter(i => i !== value)
                : [...selectedItems, value];
            setSelectedItems(updated);
            onSelect(updated);
        } else {
            setSelectedItems([value]);
            setShowDropDown(false);
            onSelect(value);
        }
    };

    const isSelected = (item) => {
        const value = item?.value || item;
        return selectedItems.includes(value);
    };

    const renderSelectedText = () => {
        if (!selectedItems.length) return 'Select';
        return isMultiSelect ? selectedItems.join(', ') : selectedItems[0];
    };

    return (
        <View>
            <CustomShadow  >
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.inputContainer}
                onPress={() => setShowDropDown(!showDropDown)}
            >
                <Text style={[styles.selectedText, textStyle]}>
                    {renderSelectedText()}
                </Text>
                <MaterialIcons
                    name={showDropDown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
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
                            onPress={() => toggleItem(item)}
                            style={[
                                styles.dropdownItem,
                                dropdownStyle,
                                isSelected(item) && {
                                    backgroundColor: Color.primaryColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    {
                                        color: Color.textColor,
                                    },
                                    isSelected(item) && {
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
        marginVertical: verticalScale(6),
        width:'98%',
        alignSelf:'center'
    },
    selectedText: {
        fontWeight: '500',
        letterSpacing: 1,
        fontFamily: Font.PoppinsMedium,
        color: Color.textColor,
        flex: 1,
    },
    dropdown: {
        borderRadius: scale(4),
        borderWidth: 1,
        borderColor: Color.borderColor,
        backgroundColor: Color.white,
        marginTop: verticalScale(4),
        elevation: 2,
        zIndex: 10,
    },
    dropdownItem: {
        padding: scale(10),
        borderBottomWidth: 1,
        borderBottomColor: Color.borderColor,
    },
});
