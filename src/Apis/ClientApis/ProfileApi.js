import axios from 'axios';

export const GetUserApi = async token => {
  try {
    const url = `https://nutrium-back-end-1.onrender.com/api/v1/getUser`;
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

    const url = `https://nutrium-back-end-1.onrender.com/api/v1/client/${id}`;

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
