import axios from 'axios';
import { BASE_URL } from '../Base_Url/Baseurl';
import { CHALLENGE_ACCEPT_REJECT, CREATE_CHALLENGE, GET_ALL_CHALLENGE, GET_ALL_USER, GET_CHALLENGE_DATA_WITHID, GET_CHALLENGE_PENDING_REQUEST, GET_CHALLENGE_RANGE, GET_CHALLENGE_TYPE, JOIN_PUBLIC_CHALLENGE, LEADERBOARD_DATA } from '../AllAPI/API';

export const getAllChallenge = async token => {
  try {
    const url = GET_ALL_CHALLENGE;
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
    const url = `${GET_CHALLENGE_DATA_WITHID}/${userId}`;
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
    const url = `${GET_CHALLENGE_PENDING_REQUEST}/${userId}`;
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
    const url = `${CHALLENGE_ACCEPT_REJECT}/${userId}/${challengeId}`;
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
    const url = `${LEADERBOARD_DATA}/${chllangeId}`;
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
    const url = `${JOIN_PUBLIC_CHALLENGE}/${userId}/${challengeId}`;
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
    const url = `${CREATE_CHALLENGE}/${userId}`;
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
    const url = `${GET_CHALLENGE_TYPE}`;
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
    const url = `${GET_CHALLENGE_RANGE}/${id}`;
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
    const url = `${GET_ALL_USER}?page=${pageNo}&limit=${limit}&search=${search}`;
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
