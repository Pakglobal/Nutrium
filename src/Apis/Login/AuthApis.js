import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';

export const Login = async data => {

  try {
    const body = {
      email: data?.email,
      password: data?.password,
      deviceToken: data?.deviceToken,
    };

    const url = `${BASE_URL}sign_in`;
    const response = await axios.post(url, body);

    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const GoogleLogin = async data => {
  try {
    const body = {
      googleId: data?.googleId,
      email: data?.email,
      deviceToken: data?.deviceToken,
    };
    const url = `${BASE_URL}verify-google`;
    const response = await axios.post(url, body);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const GuestLoGin = async data => {
  try {
    const body = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      password: data?.password,
      goal: data?.goal,
      profession: data?.profession,
      gender: data?.gender,
      country: data?.country,
      phoneNumber: data?.phoneNumber,
      dateOfBirth: data?.dateOfBirth,
      deviceToken: data?.deviceToken,
      isDemoClient: true,
    };
    const url = `${BASE_URL}demo-auth`;
    const response = await axios.post(url, body);
    
    return response;
  } catch (error) {

    return error?.response?.data;
  }
};


export const ForgotPasswordApi = async(data) => {
  
  try {
    const body = {
      email: data?.email,
    };
  // /setPassword/vatsal.r.lakhani2626+83@gmail.com
    console.log(body, '=====');
    const url = `${BASE_URL}forget-password`;
    const response = await axios.post(url, body);

    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}


export const SetNewPassword = async() => {
  
  try {
    const body = {
      "newPassword":"password123#",
      "confirmPassword":"password123#"
  };
  // /setPassword/vatsal.r.lakhani2626+83@gmail.com
    console.log(body, '=====');
    const url = `${BASE_URL}forget-password`;
    const response = await axios.put(url, body);

    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
}

