import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';

export const GetRecommendationApiData = async (token, id) => {
  try {
    const url = `${BASE_URL}get-other-recommendation/${id}`;
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
    const url = `${BASE_URL}get-food-avoid/${id}`;
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
    const url = `${BASE_URL}client/allGoals/${id}`;
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
