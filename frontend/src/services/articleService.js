import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/articles`;

export const getArticles = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getArticleById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const getArticleStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const triggerScraper = async () => {
    const response = await axios.post(`${API_BASE_URL}/api/process`);
    return response.data;
};

export const scrapeNewArticles = async () => {
    const response = await axios.post(`${API_URL}/scrape`);
    return response.data;
};
