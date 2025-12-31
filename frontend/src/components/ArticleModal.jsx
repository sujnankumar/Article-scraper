import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ArticleModal = ({ article, isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState(article.isUpdated ? 'updated' : 'original');

  if (!isOpen) return null;

  // Helper to extract AI title from markdown if it exists
  const getProcessedContent = () => {
    if (viewMode === 'original' || !article.isUpdated) {
      return { title: article.title, content: article.originalContent };
    }

    const aiContent = article.updatedContent || "";
    const headerMatch = aiContent.match(/^(#+)\s+(.+)$/m);
    
    if (headerMatch) {
      const extractedTitle = headerMatch[2];
      const remainingContent = aiContent.replace(headerMatch[0], '').trim();
      return { title: extractedTitle, content: remainingContent };
    }

    return { title: article.title, content: aiContent };
  };

  const { title, content } = getProcessedContent();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <div className="modal-meta">
            <span className="modal-date">{new Date(article.createdAt).toLocaleDateString()}</span>
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="modal-source-link">
              Source Site
            </a>
          </div>
          
          <div className="modal-toggle-group">
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
        </div>

        <div className="modal-body">
          <div className="full-content markdown-body">
            {viewMode === 'updated' && article.isUpdated ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              content.split('\n')
                .filter(para => para.trim() !== '')
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
