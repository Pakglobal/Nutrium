import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';
import {GET_APPOINTMENT_DATA} from '../AllAPI/API';

export const GetAppointmentData = async token => {
  try {
    const url = GET_APPOINTMENT_DATA;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching appointment data', error);
  }
};
