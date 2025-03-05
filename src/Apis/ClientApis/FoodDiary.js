import axios from 'axios';

export const FetchFoodDiary = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/food-diary/12123`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching get weight measurement data', error);
  }
};
