import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';

export const FetchFoodDiary = async (token, id) => {
  try {
    const url = `${BASE_URL}food-diary/12123`;
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
    const url = `${BASE_URL}food-diary-add-meal/12123`;
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
    const url = `${BASE_URL}search-foods`;
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

    const url = `${BASE_URL}food-diary/12123/delete-meal-schedule`;
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
    const url = `${BASE_URL}food-diary/12123/delete-food`;

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
