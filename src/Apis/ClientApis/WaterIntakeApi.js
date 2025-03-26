import axios from 'axios';

export const GetWaterintakeLimitData = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/getWaterIntakeLimit/${id}`;
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
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/getWaterIntake/${id}`;

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

    const url = `https://nutrium-back-end-1.onrender.com/api/v1/setwaterintake/${clientId}`;
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
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/deletewaterintake/${waterIntakeId}/${waterRecordId}/${waterIntakeAmountId}`;

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
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/updatewaterintake/${waterIntakeId}/${waterRecordId}/${waterIntakeAmountId}`;
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
