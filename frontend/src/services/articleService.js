import axios from 'axios';

const API_URL = 'http://localhost:5000/api/articles';

export const getArticles = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getArticleById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
