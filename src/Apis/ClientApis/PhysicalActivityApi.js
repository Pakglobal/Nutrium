import axios from 'axios';

export const SetPhysicalActivityDetails = async payload => {
  try {
    const {id, time, token, activity, byactivity, timeunit} = payload;
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/clientSidePhysicalActivity/${id}`;
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
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/client-physical-activity/${id}`;
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
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/delete-physical-activity/${clientId}/${activityId}`;

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
    const {clientId, time, token, timeunit, activityId, byactivity, date} =
      payload;
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/update-physical-activity/${clientId}/${activityId}`;
    const body = {
      time: time,
      timeunit: timeunit,
      byactivity: byactivity,
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

export const GetPhysicalActivities = async () => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/activities`;
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const GetQuickAccess = async (token, id) => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/get-quick-access-activity/${id}`;
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
    const {
      id,
      time,
      token,
      timeunit,
      byactivity,
      activity,
    } = payload;
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/recommendations/${id}`;
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
