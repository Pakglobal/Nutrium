import axios from 'axios';
import {
  DELETE_WATER_INTAKE,
  GET_WATER_INTAKE_DETAILS,
  GET_WATER_INTAKE_LIMIT,
  SET_WATER_INTAKE_DETAILS,
  UPDATE_WATER_INTAKE,
} from '../AllAPI/API';

export const GetWaterintakeLimitData = async (token, id) => {
  try {
    const url = `${GET_WATER_INTAKE_LIMIT}/${id}`;
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
    const url = `${GET_WATER_INTAKE_DETAILS}/${id}`;

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

    const url = `${SET_WATER_INTAKE_DETAILS}/${clientId}`;
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
    const url = `${DELETE_WATER_INTAKE}/${waterIntakeId}/${waterRecordId}/${waterIntakeAmountId}`;

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
    const url = `${UPDATE_WATER_INTAKE}/${waterIntakeId}/${waterRecordId}/${waterIntakeAmountId}`;
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
