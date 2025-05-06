import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';
import { GET_FOOD_AVOID_DATA, GET_GOALS, GET_RECOMMENDATION_DATA } from '../AllAPI/API';

export const GetRecommendationApiData = async (token, id) => {
  try {
    const url = `${GET_RECOMMENDATION_DATA}/${id}`;
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
    const url = `${GET_FOOD_AVOID_DATA}/${id}`;
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
    const url = `${GET_GOALS}/${id}`;
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
