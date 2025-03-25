import axios from 'axios';

export const GetAllClientData = async token => {
  try {
    const url = 'https://nutrium-back-end-1.onrender.com/api/v1/client';
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const GetClientData = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/client/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
