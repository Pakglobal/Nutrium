import axios from 'axios';

export const GetAppointmentByClientId = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/getAppointmentsByClientId/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching get appointment by client', error);
  }
};

export const UpdateAppointmentStatus = async (token, appointmentId, data) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/updateAppointmentStatus/${appointmentId}`;
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
    console.error('Error fetching update physical activity', error);
  }
};
