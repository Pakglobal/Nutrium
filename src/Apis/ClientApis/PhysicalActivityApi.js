import axios from 'axios';
import {BASE_URL} from '../Base_Url/Baseurl';
import {
  DELETE_PHYSICAL_ACTIVITY,
  GET_PHYSICAL_ACTIVITY_DETAILS,
  GET_PHYSICAL_ACTIVITY_LIST,
  GET_QUICK_ACCESS_DATA,
  SET_PHYSICAL_ACTIVITY_DETAILS,
  SET_QUICK_ACCESS_DATA,
  UPDATE_PHYSICAL_ACTIVITY,
} from '../AllAPI/API';

export const SetPhysicalActivityDetails = async payload => {
  try {
    const {id, time, token, activity, byactivity, timeunit} = payload;
    const url = `${SET_PHYSICAL_ACTIVITY_DETAILS}/${id}`;
    const body = {
      physicalActivity: [
        {
          byactivity: byactivity,
          activity: activity,
          time: time,
          timeunit: timeunit,
        },
      ],
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

export const GetPhysicalActivityDetails = async (token, id) => {
  try {
    const url = `${GET_PHYSICAL_ACTIVITY_DETAILS}/${id}`;
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

export const DeletePhysicalActivity = async payload => {
  try {
    const {clientId, activityId, token} = payload;
    const url = `${DELETE_PHYSICAL_ACTIVITY}/${clientId}/${activityId}`;

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

export const UpdatePhysicalActivity = async payload => {
  try {
    const {
      clientId,
      time,
      token,
      timeunit,
      activityId,
      byactivity,
      date,
      activity,
    } = payload;

    const url = `${UPDATE_PHYSICAL_ACTIVITY}/${clientId}/${activityId}`;
    const body = {
      time: time,
      timeunit: timeunit,
      byactivity: byactivity,
      date: date,
      activity: activity,
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

export const GetPhysicalActivities = async () => {
  try {
    const url = `${GET_PHYSICAL_ACTIVITY_LIST}`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const GetQuickAccess = async (token, id) => {
  try {
    const url = `${GET_QUICK_ACCESS_DATA}/${id}`;
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

export const SetQuickAccess = async payload => {
  try {
    const {id, time, token, timeunit, byactivity, activity} = payload;
    const url = `${SET_QUICK_ACCESS_DATA}/${id}`;
    const body = {
      physicalActivity: [
        {
          time: time,
          timeunit: timeunit,
          byactivity: byactivity,
          activity: activity,
        },
      ],
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
