// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'

// const CustomeDropDown = ({
//     onPress,
//     textStyle,
//     item,
//     keyitem,
//     dropdownStyle,
//     multipleSelect,
//     singleSelected
// }) => {
//     return (
//         <View>
//             <TouchableOpacity
//                 key={keyitem}
//                 style={dropdownStyle}
//                 onPress={singleSelected == true ? onPress : multipleSelect}>
//                 <Text
//                     style={textStyle}>
//                     {item}
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     )
// }

// export default CustomeDropDown

// const styles = StyleSheet.create({})



import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomeDropDown = ({
    onPress,
    textStyle,
    item,
    keyitem,
    dropdownStyle,
    multipleSelect,
    singleSelected,
    selectedItems = []
}) => {

    const isSelected = selectedItems.includes(item);

    return (
        <View>
            <TouchableOpacity
                key={keyitem}
                style={[
                    dropdownStyle,
                    (singleSelected === true && isSelected) && { backgroundColor: '#2196F3' },
                    (multipleSelect && isSelected) && { backgroundColor: '#2196F3' },
                ]}
                onPress={(item) => {
                    if (singleSelected) {
                        onPress();
                    } else if (multipleSelect) {
                        multipleSelect(item);
                    }
                }}>
                <Text
                    style={[
                        textStyle,
                        isSelected && { color: '#fff' }
                    ]}>
                    {item}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default CustomeDropDown

const styles = StyleSheet.create({})
