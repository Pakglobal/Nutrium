import axios from 'axios';

export const GetRecommendationApiData = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/get-other-recommendation/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Error fetching recommendation data', error);
  }
};

export const GetFoodAvoidApiData = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/get-food-avoid/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching avoid food data', error);
  }
};

export const GetGoalsApiData = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/client/allGoals/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching goals data', error);
  }
};
