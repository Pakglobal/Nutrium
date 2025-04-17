import axios from 'axios';
import { BASE_URL } from '../Base_Url/Baseurl';

export const GetUserApi = async token => {
  console.log(token, 'token');
  
  try {
    const url = `${BASE_URL}getUser`;
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

    const url = `${BASE_URL}client/${id}`;

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
    const url = `${BASE_URL}client/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Error fetching get profile image', error);
  }
}
