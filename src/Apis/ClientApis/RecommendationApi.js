import axios from 'axios';

export const GetRecommendationApiData = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/get-other-recommendation/${id}`;
    // const url = `https://nutrium-back-end-1.onrender.com/api/v1/get-other-recommendation/67ade66d8bd6f24270772af4`;
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
    // const url = `https://nutrium-back-end-1.onrender.com/api/v1/get-food-avoid/67ade66d8bd6f24270772af4`;
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

export const GetGoalsApiData = async (token, id) => {  
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/client/allGoals/${id}`;
    // const url = `https://nutrium-back-end-1.onrender.com/api/v1/client/allGoals/67ade66d8bd6f24270772af4`;
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
