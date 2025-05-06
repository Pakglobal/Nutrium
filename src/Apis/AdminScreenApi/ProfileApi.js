import axios from 'axios';
import {GET_PROFILE_DATA} from '../AllAPI/API';

export const GetAdminProfileData = async token => {
  try {
    const url = GET_PROFILE_DATA;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching get admin profile data', error);
  }
};
