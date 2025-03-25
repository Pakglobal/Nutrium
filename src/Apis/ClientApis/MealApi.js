import axios from 'axios';

export const FetchMealPlanApi = async id => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/meal-plan/${id}`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
