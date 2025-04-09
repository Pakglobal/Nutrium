import axios from 'axios';
import { BASE_URL } from '../Base_Url/Baseurl';

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


export const GuestLOGin = async data => {

  try {
    const body = {
      fullName: data?.fullName,
      email: data?.email,
      password:data?.password,
      gender: data?.gender,
      country: data?.country,
      dateOfBirth: data?.dateOfBirth,
      phoneNumber: data?.phoneNumber,
      profession: data?.profession,
      workplace: data?.workplace,
      expertise: [
        data?.expertise
      ],
    };
    const url = `${BASE_URL}sign_in`;
    const response = await axios.post(url, body);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};