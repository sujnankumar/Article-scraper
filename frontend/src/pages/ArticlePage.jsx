import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../services/articleService';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ExternalLink, Bot, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enhanced'); // 'enhanced' | 'original'

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const data = await getArticleById(id);
      // Backend returns { success: true, data: article } or just article
      setArticle(data.data || data); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching article:', error);
      setLoading(false);
    }
  };

  const getProcessedContent = () => {
    if (!article) return { title: '', content: '' };

    if (activeTab === 'original' || !article.isUpdated) {
        // For original content, we just use the raw text. 
        // If we want to clean up gaps, we can do it here, but usually plain text is fine.
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

  if (loading) return <div className="loader full-screen">Loading Intelligence...</div>;
  if (!article) return <div className="error-msg full-screen">Article not found</div>;

  const { title: displayTitle, content: displayContent } = getProcessedContent();

  return (
    <motion.div 
      className="article-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="article-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div className="view-toggles">
          {article.isUpdated && (
            <button 
              className={`toggle-btn ${activeTab === 'enhanced' ? 'active' : ''}`}
              onClick={() => setActiveTab('enhanced')}
            >
              <Bot size={16} />
              AI Enhanced
            </button>
          )}
          <button 
            className={`toggle-btn ${activeTab === 'original' ? 'active' : ''}`}
            onClick={() => setActiveTab('original')}
          >
            <FileText size={16} />
            Original
          </button>
        </div>
      </header>

      <div className="article-container">
        <div className="article-hero">
            <span className="article-date">
                {new Date(article.createdAt).toLocaleDateString()}
            </span>
            <h1 className="main-title">{displayTitle}</h1>
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link-lg">
                View Source <ExternalLink size={14} />
            </a>
        </div>

        <div className="article-content markdown-body">
            {activeTab === 'enhanced' && article.isUpdated ? (
                <ReactMarkdown>{displayContent}</ReactMarkdown>
            ) : (
                // Clean rendering for original content
                displayContent.split('\n')
                    .filter(p => p.trim() !== '')
                    .map((p, i) => <p key={i}>{p}</p>)
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ArticlePage;
