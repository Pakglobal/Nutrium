import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';
import { ADD_MEAL_IN_FOOD, DELETE_MEAL_IN_FOOD, DELETE_SPECIFIC_MEAL_IN_FOOD, GET_FOOD_DIARY, SEARCH_FOOD } from '../AllAPI/API';

export const FetchFoodDiary = async (token, id) => {
  try {
    const url = `${GET_FOOD_DIARY}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching food diary data', error);
  }
};

export const AddMealInFoodDiary = async payload => {
  try {
    const {token, registrationDate, mealType, time, foodId, comments} = payload;
    const url = `${ADD_MEAL_IN_FOOD}`;
    const body = {
      registrationDate: registrationDate,
      mealType: mealType,
      time: time,
      foodId: foodId,
      comments: comments,
    };

    const response = await axios.post(url, body, {
      headers: {
        Authorization: token,
      },
    });

    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const SearchFoodApi = async token => {
  try {
    const url = `${SEARCH_FOOD}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching search food data', error);
  }
};

export const DeleteMealInFoodDiary = async payload => {
  try {
    const {token, registrationDate, scheduleId} = payload;

    const url = `${DELETE_MEAL_IN_FOOD}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: token,
      },
      data: {
        scheduleId: scheduleId,
        registrationDate: registrationDate,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const DeleteSpecificMealInFoodDiary = async payload => {
  try {
    const {token, registrationDate, scheduleId, foodIndex} = payload;
    const url = `${DELETE_SPECIFIC_MEAL_IN_FOOD}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: token,
      },
      data: {
        registrationDate: registrationDate,
        scheduleId: scheduleId,
        foodIndex: foodIndex,
      },
    });

    return response?.data;
  } catch (error) {
    console.error('Error deleting meal:', error);
    return error?.response?.data;
  }
};
