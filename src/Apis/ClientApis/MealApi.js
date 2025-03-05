import axios from 'axios';

export const FetchMealPlanApi = async (id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/meal-plan/67ade66d8bd6f24270772af4`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    console.error('Error fetching water intake data', error);
  }
};