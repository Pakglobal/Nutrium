import axios from 'axios';
import { BASE_URL } from '../Base_Url/Baseurl';
export const getAllChallenge = async token => {
  try {
    const url = `${BASE_URL}challenge/public`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching challenge range', error);
  }
};
export const getAllChallengeJoinDatawithId = async (token, userId) => {
  try {
    const url = `${BASE_URL}challenge/accepted-challenges/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const getAllChallengePendingRequest = async (token, userId) => {
  try {
    const url = `${BASE_URL}challenge/private/${userId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const challengeAcceptAndRejectedApi = async (
  token,
  challengeId,
  userId,
  action,
) => {
  try {
    const url = `${BASE_URL}challenge/respond/${userId}/${challengeId}`;
    const response = await axios.post(url, action, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.log('errorerrorerrorerrorerror', error);

    throw error;
  }
};

export const getChallengeLederBoardData = async (token, chllangeId) => {
  try {
    const url = `${BASE_URL}leaderboard/${chllangeId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const joinPublicChallenge = async (token, userId, challengeId) => {
  try {
    const url = `${BASE_URL}challenge/public/join/${userId}/${challengeId}`;
    const response = await axios.post(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const createChallenge = async (token, userId, data) => {
  try {
    const url = `${BASE_URL}challenge/create/${userId}`;
    const response = await axios.post(url, data, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
export const getChallengeType = async token => {
  try {
    const url = `${BASE_URL}challenge-master`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching get appointment by client', error);
  }
};

export const getChallengeRange = async (token, id) => {
  console.log('ididid', id);
  try {
    const url = `${BASE_URL}challenge-master/reward-ranges-dropdown/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching challenge range', error);
  }
};

export const getAllUser = async (token, pageNo, limit, search) => {
  try {
    const url = `${BASE_URL}clients?page=${pageNo}&limit=${limit}&search=${search}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching challenge range', error);
  }
};
