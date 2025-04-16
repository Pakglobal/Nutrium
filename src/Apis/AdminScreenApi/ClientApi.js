import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';

export const GetAllClientData = async token => {
  try {
    const url = `${BASE_URL}client`;
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
    const url = `${BASE_URL}client/${id}`;
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
