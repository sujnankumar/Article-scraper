import React, { useState, useEffect } from 'react';
import { getArticles } from '../services/articleService';
import ArticleCard from '../components/ArticleCard';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Is the backend running?');
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Loading Articles...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Article Dashboard</h1>
        <p>Enhancing BeyondChats Content with AI Intelligence</p>
        <button className="refresh-btn" onClick={loadArticles}>
          Refresh Articles
        </button>
      </header>

      <div className="article-grid">
        {articles.length > 0 ? (
          articles.map(article => (
            <ArticleCard key={article._id} article={article} />
          ))
        ) : (
          <div className="no-data">
            <p>No articles found in the database.</p>
            <button className="view-btn" onClick={loadArticles}>Check Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
