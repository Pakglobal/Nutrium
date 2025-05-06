import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';
import {FORGOT_PASSWORD, GOOGLE_LOGIN, GUEST_LOGIN, LOGIN} from '../AllAPI/API';

export const Login = async data => {
  try {
    const body = {
      email: data?.email,
      password: data?.password,
      deviceToken: data?.deviceToken,
    };

    const url = LOGIN;
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
    const url = GOOGLE_LOGIN;
    const response = await axios.post(url, body);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const HandleGuestLOGIN = async data => {
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
    const url = GUEST_LOGIN;
    const response = await axios.post(url, body);

    return response;
  } catch (error) {
    return error?.response?.data;
  }
};

export const ForgotPasswordApi = async data => {
  try {
    const body = {
      email: data?.email,
    };

    const url = FORGOT_PASSWORD;
    const response = await axios.post(url, body);

    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
