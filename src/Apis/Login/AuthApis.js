import axios from 'axios';

export const Login = async data => {
  try {
    const body = {
      email: data?.email,
      password: data?.password,
      deviceToken: data?.deviceToken,
    };

    const url = 'https://nutrium-back-end-1.onrender.com/api/v1/sign_in';
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
    const url = 'https://nutrium-back-end-1.onrender.com/api/v1/verify-google';
    const response = await axios.post(url, body);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
