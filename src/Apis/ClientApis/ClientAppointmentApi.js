import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';

export const GetAppointmentByClientId = async (token, id) => {
  try {
    const url = `${BASE_URL}getAppointmentsByClientId/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });

    return response?.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return [];
    } else if (error?.response?.status === 401) {
      return [];
    } else {
      console.error('Error fetching get appointment by client:', error);
      throw error;
    }
  }
};

export const UpdateAppointmentStatus = async (token, appointmentId, data) => {
  try {
    const url = `${BASE_URL}updateAppointmentStatus/${appointmentId}`;
    const body = {
      status: data?.status,
    };

    const response = await axios.put(url, body, {
      headers: {
        Authorization: token,
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Error fetching update appointment status', error);
  }
};
