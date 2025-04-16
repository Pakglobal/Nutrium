import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';

export const GetWaterintakeLimitData = async (token, id) => {
  try {
    const url = `${BASE_URL}getWaterIntakeLimit/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const GetWaterIntakeDetails = async (token, id) => {
  try {
    const url = `${BASE_URL}getWaterIntake/${id}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const SetWaterIntakeDetails = async payload => {
  try {
    const {clientId, token, amount, time, date} = payload;

    const url = `${BASE_URL}setwaterintake/${clientId}`;
    const body = {
      waterIntake: amount,
      time: time,
      date: date,
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

export const DeleteWaterIntake = async payload => {
  try {
    const {waterIntakeId, waterRecordId, waterIntakeAmountId, token} = payload;
    const url = `${BASE_URL}deletewaterintake/${waterIntakeId}/${waterRecordId}/${waterIntakeAmountId}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const UpdateWaterIntake = async payload => {
  try {
    const {
      waterIntakeId,
      waterRecordId,
      waterIntakeAmountId,
      token,
      time,
      date,
      amount,
    } = payload;
    const url = `${BASE_URL}updatewaterintake/${waterIntakeId}/${waterRecordId}/${waterIntakeAmountId}`;
    const body = {
      waterIntake: amount,
      time: time,
      date: date,
    };

    const response = await axios.put(url, body, {
      headers: {
        Authorization: token,
      },
    });

    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};
