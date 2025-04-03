import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NutriumLogo from '../../assets/Icon/NutriumLogo.svg';
import Color from '../../assets/colors/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin, Login } from '../../Apis/Login/AuthApis';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {
  loginData,
  profileData,
  setGuestMode,
  setIsGuest,
  setToken,
} from '../../redux/user';
import {GetAdminProfileData} from '../../Apis/AdminScreenApi/ProfileApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../../Components/CustomAlert';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [login, setLogin] = useState([]);

  const handlePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const FCMtoken = useSelector(state => state?.user?.fcmToken);

  const validateEmail = value => {
    setEmail(value);
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (!value) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(value)) {
      setEmailError('Enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = value => {
    setPassword(value);
    if (!value) {
      setPasswordError('Password is required');
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

    let emailError = '';
    let passwordError = '';

    if (!email) {
      emailError = 'Email is required';
    }
    if (!password) {
      passwordError = 'Password is required';
    }

    if (email && !emailRegex.test(email)) {
      emailError = 'Enter a valid email';
    }
    if (password && password.length < 8) {
      passwordError = 'Password must be at least 8 characters';
    }

    setEmailError(emailError);
    setPasswordError(passwordError);

    if (emailError || passwordError) {
      return;
    }

    const body = {
      email: email,
      password: password,
      deviceToken: FCMtoken,
    };

    try {
      setLoading(true);
      const response = await Login(body);
      setLogin(response);

      const storeTokenId = {
        token: response?.token,
        id: response?.userData?._id,
      };

      if (response?.message == 'Login successful' || response?.token) {
        dispatch(loginData(response));
        dispatch(setToken(storeTokenId));

        if (response) {
          const token = response?.token;
          const getProfileData = await GetAdminProfileData(token);

          dispatch(profileData(getProfileData));
          setLoading(false);
        }
        setLoading(false);
      } else {
        setAlertVisible(true);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  GoogleSignin.configure({
    webClientId:
      '737792334349-eefln2o4gd1ovb2vs0kdct1hgfg5raf9.apps.googleusercontent.com',
    iosClientId:
      '737792334349-qeadje2231rg3g49s78vo7mh8rsq613j.apps.googleusercontent.com',
  });

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo) {
        await GoogleSignin.revokeAccess();
      }

      const googleId = userInfo?.data?.user?.id;
      const email = userInfo?.data?.user?.email;

      const body = {
        googleId: googleId,
        email: email,
        deviceToken: FCMtoken,
      };

      const response = await GoogleLogin(body);
      setLogin(response);

      const storeTokenId = {
        token: response?.token,
        id: response?.user?._id,
      };

      if (response?.message == 'Login successfully' || response?.token) {
        dispatch(loginData(response));
        dispatch(setToken(storeTokenId));

        if (response) {
          const token = response?.token;
          const getProfileData = await GetAdminProfileData(token);

          dispatch(profileData(getProfileData));
        }
      } else {
        setAlertVisible(true);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    dispatch(setGuestMode(true));
    navigation.navigate('guestLogin');}

  // const signInWithFacebook = () => {
  //   console.log('Click FB');

  // }


  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert
        visible={alertVisible}
        message={login?.message}
        onClose={() => setAlertVisible(false)}
        singleButton={true}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <NutriumLogo
            style={styles.logo}
            width={scale(280)}
            height={verticalScale(50)}
          />
        </View>

        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            placeholder="Enter email"
            onChangeText={validateEmail}
            placeholderTextColor={Color.gray}
            style={[
              styles.input,
              { borderColor: !email ? 'black' : emailError ? 'red' : 'green' },
            ]}
          />
        </View>
        {emailError ? (
          <Text style={styles.errorMessage}>{emailError}</Text>
        ) : null}

        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            placeholder="Enter password"
            onChangeText={validatePassword}
            placeholderTextColor={Color.gray}
            style={[
              styles.input,
              {
                borderColor: !password
                  ? 'black'
                  : passwordError
                    ? 'red'
                    : 'green',
              },
            ]}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={handlePassword}
            style={styles.eyeIconContainer}>
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              color="#777"
              size={24}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorMessage}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              {borderColor: isAgree ? Color.secondary : Color.black},
              {backgroundColor: isAgree ? '#FFFFFF' : '#FFFFFF'},
            ]}
            onPress={() => setIsAgree(!isAgree)}>
            {isAgree && (
              <View style={styles.checkedBox}>
                <AntDesign name="check" color={Color.secondary} size={16} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I accept the{' '}
            <Text style={styles.highlightedText}>
              Terms and Conditions of Use
            </Text>{' '}
            and the <Text style={styles.highlightedText}>Privacy Policy</Text>{' '}
            of Nutrium.
          </Text>
        </View>

        <TouchableOpacity
          disabled={!isAgree}
          onPress={handleLogin}
          style={[
            styles.signInButton,
            { backgroundColor: isAgree ? Color.secondary : '#E0E0E0' },
          ]}>
          {loading ? (
            <ActivityIndicator size="small" color={Color.white} />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={[
                  styles.signInText,
                  { color: isAgree ? '#FFFFFF' : '#9E9E9E' },
                ]}>
                Sign in
              </Text>
              <AntDesign
                name="arrowright"
                color={isAgree ? '#FFFFFF' : '#9E9E9E'}
                size={16}
                style={{ marginLeft: scale(8) }}
              />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGuestLogin}
          style={[
            styles.signInButton,
            {
              backgroundColor: Color.secondary,
              marginTop: verticalScale(10),
            },
          ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.signInText, { color: '#FFFFFF' }]}>
              Guest mode
            </Text>
            <AntDesign
              name="arrowright"
              color={'#FFFFFF'}
              size={16}
              style={{ marginLeft: scale(8) }}
            />
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => {
              navigation.navigate('registrationType');
            }}>
          <Text style={styles.noAccountText}>I don't have an account</Text>
        </TouchableOpacity> */}

        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={signInWithGoogle}>
          <Image
            source={require('../../assets/Icon/google.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[styles.googleButton,{marginVertical:verticalScale(25)}]}
          onPress={signInWithFacebook}>
            <AntDesign name="facebook-square" color={'blue'} size={16} style={styles.googleIcon} />
          <Text style={styles.googleText}>Sign in with facebook</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  scrollView: {
    paddingHorizontal: scale(16),
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(48),
  },
  inputLabel: {
    fontSize: scale(14),
    color: Color.black,
    marginBottom: verticalScale(7),
    marginTop: verticalScale(15),
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: verticalScale(35),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
    fontSize: scale(14),
    color: Color.gray,
    width: '100%',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: scale(16),
    top: scale(8),
  },
  errorMessage: {
    color: '#F44336',
    fontSize: scale(13),
    marginTop: verticalScale(4),
  },
  forgotText: {
    color: '#757575',
    fontSize: scale(13),
    fontWeight: '600',
    marginTop: verticalScale(22),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(22),
  },
  checkbox: {
    width: scale(22),
    height: scale(22),
    borderWidth: 1,
    borderRadius: scale(4),
    marginRight: scale(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    color: Color.black,
    fontSize: scale(13),
    lineHeight: verticalScale(18),
  },
  highlightedText: {
    color: Color.secondary,
    fontWeight: '600',
  },
  signInButton: {
    flexDirection: 'row',
    height: verticalScale(38),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(38),
  },
  signInText: {
    fontSize: scale(15),
    fontWeight: '600',
  },
  noAccountText: {
    color: Color.secondary,
    fontSize: scale(13),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: verticalScale(22),
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(22),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    color: '#757575',
    paddingHorizontal: scale(15),
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    height: verticalScale(38),
    borderRadius: scale(24),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  googleIcon: {
    width: scale(22),
    height: scale(22),
    marginRight: 8,
  },
  googleText: {
    color: '#757575',
    fontSize: scale(14),
    fontWeight: '600',
  },
});

export default LoginScreen;




// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   ToastAndroid,
//   TouchableOpacity,
//   View,
//   Image,
// } from 'react-native';
// import { scale, verticalScale } from 'react-native-size-matters';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import NutriumLogo from '../../assets/Icon/NutriumLogo.svg';
// import Color from '../../assets/colors/Colors';
// import { useDispatch, useSelector } from 'react-redux';
// import { GoogleLogin, Login } from '../../Apis/Login/AuthApis';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
// } from '@react-native-google-signin/google-signin';
// import {
//   loginData,
//   profileData,
//   setGuestMode,
//   setIsGuest,
//   setToken,
// } from '../../redux/user';
// import { GetAdminProfileData } from '../../Apis/AdminScreenApi/ProfileApi';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import CustomAlert from '../../Components/CustomAlert';
// import LoginImage from '../../assets/Images/loginImage.svg'

// const LoginScreen = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const [loading, setLoading] = useState(false);
//   const [isAgree, setIsAgree] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [login, setLogin] = useState([]);

//   const handlePassword = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const FCMtoken = useSelector(state => state?.user?.fcmToken);

//   const validateEmail = value => {
//     setEmail(value);
//     const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
//     if (!value) {
//       setEmailError('Email is required');
//     } else if (!emailRegex.test(value)) {
//       setEmailError('Enter a valid email');
//     } else {
//       setEmailError('');
//     }
//   };

//   const validatePassword = value => {
//     setPassword(value);
//     if (!value) {
//       setPasswordError('Password is required');
//     } else if (value.length < 8) {
//       setPasswordError('Password must be at least 8 characters');
//     } else {
//       setPasswordError('');
//     }
//   };

//   const handleLogin = async () => {
//     const emailRegex = /^\w+([\.+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

//     let emailError = '';
//     let passwordError = '';

//     if (!email) {
//       emailError = 'Email is required';
//     }
//     if (!password) {
//       passwordError = 'Password is required';
//     }

//     if (email && !emailRegex.test(email)) {
//       emailError = 'Enter a valid email';
//     }
//     if (password && password.length < 8) {
//       passwordError = 'Password must be at least 8 characters';
//     }

//     setEmailError(emailError);
//     setPasswordError(passwordError);

//     if (emailError || passwordError) {
//       return;
//     }

//     const body = {
//       email: email,
//       password: password,
//       deviceToken: FCMtoken,
//     };

//     try {
//       setLoading(true);
//       const response = await Login(body);
//       setLogin(response);

//       const storeTokenId = {
//         token: response?.token,
//         id: response?.userData?._id,
//       };

//       if (response?.message == 'Login successful' || response?.token) {
//         dispatch(loginData(response));
//         dispatch(setToken(storeTokenId));

//         if (response) {
//           const token = response?.token;
//           const getProfileData = await GetAdminProfileData(token);

//           dispatch(profileData(getProfileData));
//           setLoading(false);
//         }
//         setLoading(false);
//       } else {
//         setAlertVisible(true);
//         setLoading(false);
//       }
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//     }
//   };

//   GoogleSignin.configure({
//     webClientId:
//       '737792334349-eefln2o4gd1ovb2vs0kdct1hgfg5raf9.apps.googleusercontent.com',
//     iosClientId:
//       '737792334349-qeadje2231rg3g49s78vo7mh8rsq613j.apps.googleusercontent.com',
//   });

//   const signInWithGoogle = async () => {
//     try {
//       setLoading(true);
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();

//       if (userInfo) {
//         await GoogleSignin.revokeAccess();
//       }

//       const googleId = userInfo?.data?.user?.id;
//       const email = userInfo?.data?.user?.email;

//       const body = {
//         googleId: googleId,
//         email: email,
//         deviceToken: FCMtoken,
//       };

//       const response = await GoogleLogin(body);
//       setLogin(response);

//       const storeTokenId = {
//         token: response?.token,
//         id: response?.user?._id,
//       };

//       if (response?.message == 'Login successfully' || response?.token) {
//         dispatch(loginData(response));
//         dispatch(setToken(storeTokenId));

//         if (response) {
//           const token = response?.token;
//           const getProfileData = await GetAdminProfileData(token);

//           dispatch(profileData(getProfileData));
//         }
//       } else {
//         setAlertVisible(true);
//         setLoading(false);
//       }
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//     }
//   };

//   const handleGuestLogin = async () => {
//     dispatch(setGuestMode(true));
//     navigation.navigate('guestLogin');
//   }


//   return (
//     <SafeAreaView style={styles.container}>
//       <CustomAlert
//         visible={alertVisible}
//         message={login.message}
//         onClose={() => setAlertVisible(false)}
//         singleButton={true}
//       />
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}>

//         <View style={{marginTop:scale(10)}} >
//           <LoginImage height={verticalScale(300)} width={scale(300)} style={{ alignSelf:'center' }} />
//         </View>

//         {/* <Text style={styles.inputLabel}>Email</Text> */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             value={email}
//             placeholder="Username"
//             onChangeText={validateEmail}
//             placeholderTextColor={Color.textColor}
//             style={[
//               styles.input,
//               { borderColor: !email ? Color?.primaryColor : emailError ? 'red' : 'green' },
//             ]}
//           />
//         </View>
//         {emailError ? (
//           <Text style={styles.errorMessage}>{emailError}</Text>
//         ) : null}

//         <View style={styles.inputContainer}>
//           <TextInput
//             value={password}
//             placeholder="Password"
//             onChangeText={validatePassword}
//             placeholderTextColor={Color.textColor}
//             style={[
//               styles.input,
//               {
//                 borderColor: !password
//                   ? Color?.primaryColor
//                   : passwordError
//                     ? 'red'
//                     : 'green',
//               },
//             ]}
//             secureTextEntry={!passwordVisible}
//           />
//           <TouchableOpacity
//             onPress={handlePassword}
//             style={styles.eyeIconContainer}>
//             <Ionicons
//               name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
//               color={Color?.primaryColor}
//               size={24}
//             />
//           </TouchableOpacity>
//         </View>
//         {passwordError ? (
//           <Text style={styles.errorMessage}>{passwordError}</Text>
//         ) : null}

//         <TouchableOpacity>
//           <Text style={styles.forgotText}>Forgot Password ?</Text>
//         </TouchableOpacity>

//         <View style={styles.termsContainer}>
//           <TouchableOpacity
//             style={[
//               styles.checkbox,
//               { borderColor: isAgree ? Color.primaryColor : Color.black },
//               { backgroundColor: isAgree ? '#FFFFFF' : '#FFFFFF' },
//             ]}
//             onPress={() => setIsAgree(!isAgree)}>
//             {isAgree && (
//               <View style={styles.checkedBox}>
//                 <AntDesign name="checksquare" color={Color.primaryColor} size={16} />
//               </View>
//             )}
//           </TouchableOpacity>
//           <Text style={styles.termsText}>
//             I accept the{' '}
//             <Text style={styles.highlightedText}>
//               Terms and Conditions of Use
//             </Text>{' '}
//             and the <Text style={styles.highlightedText}>Privacy Policy</Text>{' '}
//             of Nutrium.
//           </Text>
//         </View>

//         <TouchableOpacity
//           disabled={!isAgree}
//           onPress={handleLogin}
//           style={[
//             styles.signInButton,
//             { backgroundColor: isAgree ? Color.primaryColor : '#E0E0E0' },
//           ]}>
//           {loading ? (
//             <ActivityIndicator size="small" color={Color.white} />
//           ) : (
//             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//               <Text
//                 style={[
//                   styles.signInText,
//                   { color: isAgree ? '#FFFFFF' : '#9E9E9E' },
//                 ]}>
//                 Login
//               </Text>
//             </View>
//           )}
//         </TouchableOpacity>


//         <TouchableOpacity
//           style={styles.googleButton}
//           onPress={signInWithGoogle}>
//           <Image
//             source={require('../../assets/Icon/google.png')}
//             style={styles.googleIcon}
//           />
//           <Text style={styles.googleText}>Sign in with Google</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Color.white,
//   },
//   scrollView: {
//     paddingHorizontal: scale(16),
//   },
//   logoContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: verticalScale(48),
//   },
//   inputLabel: {
//     fontSize: scale(14),
//     color: Color.black,
//     marginBottom: verticalScale(7),
//     marginTop: verticalScale(15),
//   },
//   inputContainer: {
//     position: 'relative',
//     width: '100%',
//     marginTop: scale(20)
//   },
//   input: {
//     height: verticalScale(35),
//     // borderWidth: scale(0.5),
//     borderColor: 'red',
//     borderRadius: scale(5),
//     paddingHorizontal: scale(16),
//     fontSize: scale(14),
//     color: Color.gray,
//     width: '97%',
//     alignSelf: 'center',
//     elevation: 7,
//     shadowColor: Color?.primaryColor,
//     shadowOpacity: 0.8,
//     shadowRadius: 8,
//     shadowOffset: {
//       width: 5,
//       height: 5,
//     },
//     backgroundColor: Color?.white
//   },
//   eyeIconContainer: {
//     position: 'absolute',
//     right: scale(16),
//     top: scale(8),
//   },
//   errorMessage: {
//     color: '#F44336',
//     fontSize: scale(13),
//     marginTop: verticalScale(4),
//   },
//   forgotText: {
//     color: Color?.textColor,
//     fontSize: scale(13),
//     fontWeight: '600',
//     marginTop: verticalScale(10),
//     alignSelf: "flex-end"
//   },
//   termsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: verticalScale(22),
//   },
//   checkbox: {
//     width: scale(22),
//     height: scale(22),
//     borderWidth: 1,
//     borderRadius: scale(4),
//     marginRight: scale(11),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkedBox: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   termsText: {
//     flex: 1,
//     color: Color.black,
//     fontSize: scale(13),
//     lineHeight: verticalScale(18),
//   },
//   highlightedText: {
//     color: Color.primaryColor,
//     fontWeight: '600',
//   },
//   signInButton: {
//     flexDirection: 'row',
//     height: verticalScale(38),
//     borderRadius: scale(8),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: verticalScale(15),
//   },
//   signInText: {
//     fontSize: scale(17),
//     fontWeight: '500',
//   },
//   noAccountText: {
//     color: Color.secondary,
//     fontSize: scale(13),
//     fontWeight: '600',
//     textAlign: 'center',
//     marginTop: verticalScale(22),
//   },
//   orContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: verticalScale(22),
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#E0E0E0',
//   },
//   orText: {
//     color: '#757575',
//     paddingHorizontal: scale(15),
//     fontWeight: '600',
//   },
//   googleButton: {
//     flexDirection: 'row',
//     height: verticalScale(38),
//     borderRadius: scale(8),
//     borderWidth: 1,
//     borderColor: Color?.primaryColor,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: verticalScale(10),
//     marginTop: scale(15),
//   },
//   googleIcon: {
//     width: scale(22),
//     height: scale(22),
//     marginRight: 8,
//   },
//   googleText: {
//     color: Color.primaryColor,
//     fontSize: scale(14),
//     fontWeight: '600',
//   },
// });

// export default LoginScreen;


