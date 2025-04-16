import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';

export const GetAppointmentData = async token => {
  try {
    const url = `${BASE_URL}scheduleApointment`;
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
