import axios from 'axios';

export const GetUserApi = async (token) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/getUser`;
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
