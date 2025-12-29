import React from 'react';

const ArticleCard = ({ article }) => {
  return (
    <div className="article-card">
      <div className="card-header">
        <span className={`status-badge ${article.isUpdated ? 'badge-ai' : 'badge-original'}`}>
          {article.isUpdated ? 'AI Enhanced' : 'Original'}
        </span>
        <span className="date-tag">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
      <h3 className="article-title">{article.title}</h3>
      <p className="article-excerpt">
        {article.content.substring(0, 120)}...
      </p>
      <div className="card-footer">
        <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
          Source Original
        </a>
        <button className="view-btn">View Details</button>
      </div>
    </div>
  );
};

export default ArticleCard;
