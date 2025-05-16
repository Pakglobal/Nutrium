import axios from 'axios';
import {GET_PROFILE_IMAGE, GET_USER, UPDATE_PROFILE_IMAGE} from '../AllAPI/API';

export const GetUserApi = async token => {
  try {
    const url = `${GET_USER}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching get user', error);
  }
};

export const UpdateImage = async (token, id, imageUrl) => {
  try {
    if (!imageUrl || !imageUrl?.uri) {
      throw new Error('Invalid image data');
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageUrl?.uri,
      name: imageUrl?.fileName || 'image.jpg',
      type: imageUrl?.type || 'image/jpeg',
    });

    const url = `${UPDATE_PROFILE_IMAGE}/${id}`;

    const response = await axios.put(url, formData, {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    return error?.message?.data;
  }
};

export const GetProfileImageApi = async (token, id) => {
  try {
    const url = `${GET_PROFILE_IMAGE}/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching get profile image', error);
  }
};
