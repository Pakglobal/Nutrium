import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';
import {GET_ALL_CLIENT_DATA, GET_CLIENT_DATA} from '../AllAPI/API';

export const GetAllClientData = async token => {
  try {
    const url = GET_ALL_CLIENT_DATA;
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
    const url = `${GET_CLIENT_DATA}/${id}`;
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
