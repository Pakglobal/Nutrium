import axios from 'axios';
export const getAllChallenge = async (token) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/challenge/public`;
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        console.error('Error fetching challenge range', error);
    }
}
export const getAllChallengeJoinDatawithId = async (token, userId) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/challenge/accepted-challenges/${userId}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        throw error
    }
}
export const getAllChallengePendingRequest = async (token, userId) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/challenge/private/${userId}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        throw error
    }
}

export const challengeAcceptAndRejectedApi = async (token, challengeId, userId, action) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/challenge/respond/${userId}/${challengeId}`;
        const response = await axios.post(url, action, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        console.log("errorerrorerrorerrorerror", error);

        throw error
    }
}

export const getChallengeLederBoardData = async (token, chllangeId) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/leaderboard/${chllangeId}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        throw error
    }
}
export const joinPublicChallenge = async (token, userId, challengeId) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/challenge/public/join/${userId}/${challengeId}`;
        const response = await axios.post(url, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        throw error;
    }
}
export const createChallenge = async (token, userId, data) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/challenge/create/${userId}`;
        const response = await axios.post(url, data, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        throw error;
    }
}
export const getChallengeType = async (token) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/challenge-master`;
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
    console.log("ididid", id);
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/challenge-master/reward-ranges-dropdown/${id}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        console.error('Error fetching challenge range-------', error);
    }
}



export const getAllUser = async (token, pageNo, limit, search) => {
    try {
        const url = `https://nutrium-back-end-1.onrender.com/api/v1/clients?page=${pageNo}&limit=${limit}&search=${search}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: token,
            },
        });
        return response?.data;
    } catch (error) {
        console.error('Error fetching challenge range', error);
    }
}
