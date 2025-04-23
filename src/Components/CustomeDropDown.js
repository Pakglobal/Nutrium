// // import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// // import React from 'react'

// // const CustomeDropDown = ({
// //     onPress,
// //     textStyle,
// //     item,
// //     keyitem,
// //     dropdownStyle,
// //     multipleSelect,
// //     singleSelected
// // }) => {
// //     return (
// //         <View>
// //             <TouchableOpacity
// //                 key={keyitem}
// //                 style={dropdownStyle}
// //                 onPress={singleSelected == true ? onPress : multipleSelect}>
// //                 <Text
// //                     style={textStyle}>
// //                     {item}
// //                 </Text>
// //             </TouchableOpacity>
// //         </View>
// //     )
// // }

// // export default CustomeDropDown

// // const styles = StyleSheet.create({})



// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import CustomShadow from './CustomShadow';
// import { scale, verticalScale } from 'react-native-size-matters';
// import { Color } from '../assets/styles/Colors';
// import { shadowStyle } from '../assets/styles/Shadow';
// import { TextInput } from 'react-native-gesture-handler';

// const CustomeDropDown = ({
//     onPress,
//     textStyle,
//     item,
//     keyitem,
//     dropdownStyle,
//     multipleSelect,
//     singleSelected,
//     selectedItems = [],
// }) => {

//     const isSelected = selectedItems.includes(item);

//     return (
//         <View>
//             <TouchableOpacity
//                 key={keyitem}
//                 style={[
//                     dropdownStyle,
//                     (singleSelected === true && isSelected) && { backgroundColor: '#2196F3' },
//                     (multipleSelect && isSelected) && { backgroundColor: '#2196F3' },
//                 ]}
//                 onPress={(item) => {
//                     if (singleSelected) {
//                         onPress();
//                     } else if (multipleSelect) {
//                         multipleSelect(item);
//                     }
//                 }}>
//                 <Text
//                     style={[
//                         textStyle,
//                         isSelected && { color: '#fff' }
//                     ]}>
//                     {item}
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// export default CustomeDropDown

// const styles = StyleSheet.create({
//     inputContainer: {
//         borderRadius: 8,
//         paddingHorizontal: scale(10),
//         borderColor: Color.primaryColor,
//         height: verticalScale(38),
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: Color.white,
//         marginVertical: verticalScale(6)
//     },
// })


import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Color } from '../assets/styles/Colors'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale, verticalScale } from 'react-native-size-matters';
import { Font } from '../assets/styles/Fonts';
import { color } from 'react-native-reanimated';
import CustomShadow from './CustomShadow';
import { shadowStyle } from '../assets/styles/Shadow';

const CustomeDropDown = ({
    items = [],
    selectedItem,
    onSelect,
    textStyle,
    dropdownStyle
}) => {
    const [showDropDown, setShowDropDown] = useState(false);

    return (
        <View>
            <CustomShadow radius={1} style={shadowStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.inputContainer}
                    onPress={() => setShowDropDown(!showDropDown)}
                >
                    <Text style={[styles.selectedText, textStyle]}>
                        {selectedItem || 'Select'}
                    </Text>
                    <MaterialIcons
                        name={showDropDown ? "keyboard-arrow-up" : "keyboard-arrow-down"}
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
                            onPress={() => {
                                setShowDropDown(false);
                                onSelect(item);
                            }}
                            style={[
                                styles.dropdownItem,
                                dropdownStyle,
                                selectedItem === (item?.value || item) && {
                                    backgroundColor: Color.primaryColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    {
                                        color: Color.textColor,
                                    },
                                    selectedItem === (item?.value || item) && {
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
        // marginVertical: verticalScale(6),
        width: '98%',
        alignSelf: 'center'
    },
    selectedText: {
        fontWeight: '500',
        letterSpacing: 1,
        fontFamily: Font.PoppinsMedium,
        color: Color.textColor,
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
