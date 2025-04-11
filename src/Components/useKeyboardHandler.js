import {  useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardHandler = () => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);

     useEffect(() => {
       const keyboardDidShowListener = Keyboard.addListener(
         'keyboardDidShow',
         () => {
           setKeyboardVisible(true);
         },
       );
       const keyboardDidHideListener = Keyboard.addListener(
         'keyboardDidHide',
         () => {
           setKeyboardVisible(false);
         },
       );
   
       return () => {
         keyboardDidShowListener.remove();
         keyboardDidHideListener.remove();
       };
     }, []);
};

export default useKeyboardHandler;