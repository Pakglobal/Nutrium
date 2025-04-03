import axios from 'axios';

export const FetchMealPlanApi = async id => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/meal-plan/67e26e7c3cb13b54bcd9f22f`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
