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

export const triggerScraper = async () => {
    // Calling the new endpoint we will create in the backend
    const response = await axios.post('http://localhost:5000/api/process');
    return response.data;
};
