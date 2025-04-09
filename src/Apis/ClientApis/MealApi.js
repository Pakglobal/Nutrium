import axios from 'axios';
import { BASE_URL } from '../Base_Url/Baseurl';

export const FetchMealPlanApi = async id => {
  try {
    const url = `${BASE_URL}meal-plan/${id}`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
