import React, { useState } from 'react';

const ArticleCard = ({ article }) => {
  const [viewMode, setViewMode] = useState('updated'); // 'original' or 'updated'
  
  const contentToShow = viewMode === 'updated' && article.updatedContent 
    ? article.updatedContent 
    : article.originalContent;

  return (
    <div className="article-card">
      <div className="card-header">
        <div className="badge-group">
          {article.isUpdated && (
            <button 
              className={`view-toggle ${viewMode === 'updated' ? 'active' : ''}`}
              onClick={() => setViewMode('updated')}
            >
              AI Enhanced
            </button>
          )}
          <button 
            className={`view-toggle ${viewMode === 'original' || !article.isUpdated ? 'active' : ''}`}
            onClick={() => setViewMode('original')}
          >
            Original
          </button>
        </div>
        <span className="date-tag">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <h3 className="article-title">{article.title}</h3>
      
      <div className="content-container">
        <p className="article-excerpt">
          {contentToShow.substring(0, 200)}...
        </p>
      </div>

      <div className="card-footer">
        <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
          Read Full Original
        </a>
        <button className="view-btn">View Details</button>
      </div>
    </div>
  );
};

export default ArticleCard;
