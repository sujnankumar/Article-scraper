import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('updated'); // 'original' or 'updated'

  // Helper to extract AI title from markdown if it exists
  const getProcessedContent = () => {
    if (viewMode === 'original' || !article.isUpdated) {
      return { title: article.title, content: article.originalContent };
    }

    const aiContent = article.updatedContent || "";
    // Match first markdown header: # Title or ### Title
    const headerMatch = aiContent.match(/^(#+)\s+(.+)$/m);
    
    if (headerMatch) {
      const extractedTitle = headerMatch[2];
      const remainingContent = aiContent.replace(headerMatch[0], '').trim();
      return { title: extractedTitle, content: remainingContent };
    }

    return { title: article.title, content: aiContent };
  };

  const { title, content } = getProcessedContent();
  const contentToShow = content;

  return (
    <>
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
        
        <h3 className="article-title">{title}</h3>
        
        <div className="content-container">
          <div className="article-excerpt">
            {viewMode === 'updated' && article.isUpdated ? (
              <ReactMarkdown>
                {contentToShow.substring(0, 200) + '...'}
              </ReactMarkdown>
            ) : (
              <p>{contentToShow.substring(0, 200)}...</p>
            )}
          </div>
        </div>

        <div className="card-footer">
          <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
            Read Full Original
          </a>
          <button className="view-btn" onClick={() => navigate(`/article/${article._id}`)}>
            View Details
          </button>
        </div>
      </div>
    </>
  );
};

export default ArticleCard;
