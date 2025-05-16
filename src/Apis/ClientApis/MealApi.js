import axios from 'axios';
import {GET_MEAL_PLAN} from '../AllAPI/API';

export const FetchMealPlanApi = async id => {
  try {
    const url = `${GET_MEAL_PLAN}/${id}`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
