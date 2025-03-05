import axios from 'axios';

export const GetAdminProfileData = async token => {
  try {
    const url = 'https://nutrium-back-end-1.onrender.com/api/v1/professionals';
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
