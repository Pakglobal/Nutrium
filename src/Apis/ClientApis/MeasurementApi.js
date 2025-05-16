import axios from 'axios';
import {GET_MEASUREMENT_DATA} from '../AllAPI/API';

export const GetMeasurementData = async (token, id) => {
  try {
    const url = `${GET_MEASUREMENT_DATA}/${id}`;
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

export const SetMeasurementData = async payload => {
  try {
    const {token, id, value, date, unit, measurementtype} = payload;
    const url = `${BASE_URL}client/update-measurements/${id}`;
    const body = {
      date: date,
      value: value,
      unit: unit,
      measurementtype: measurementtype,
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
