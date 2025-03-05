import axios from 'axios';

export const GetMeasurementData = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/client/measurements/${id}`;
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
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/client/update-measurements/${id}`;
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
