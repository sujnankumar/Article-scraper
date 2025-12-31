import React, { useState } from 'react';
import { 
  Zap, 
  RefreshCw, 
  Download,
  AlertCircle
} from 'lucide-react';
import { triggerScraper, scrapeNewArticles } from '../services/articleService';
import Modal from '../components/Modal';

const SettingsPage = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isScraping, setIsScraping] = useState(false);
    
    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: '', message: '', type: 'success' });

    const showModal = (title, message, type = 'success') => {
        setModalData({ title, message, type });
        setModalOpen(true);
    };

    const handleRunScraper = async () => {
      try {
        setIsProcessing(true);
        const response = await triggerScraper();
        const data = response.data || response;
        
        if (data.success) {
          const results = data.data || {};
          showModal(
            'Enhancement Complete', 
            `${results.enhanced || 0} articles enhanced, ${results.skipped || 0} skipped.`, 
            'success'
          );
        } else {
          showModal('Enhancement Failed', data.message || 'Unknown error occurred.', 'error');
        }
      } catch (error) {
        console.error(error);
        showModal('Enhancement Failed', 'Could not complete enhancement. Check if the backend is running.', 'error');
      } finally {
        setIsProcessing(false);
      }
    };
  
    const handleFetchArticles = async () => {
      try {
        setIsScraping(true);
        const result = await scrapeNewArticles();
        const count = result.count || 0;
        showModal('Fetch Complete', `Successfully fetched ${count} articles from the source. Refresh the Articles page to see them.`, 'success');
      } catch (error) {
        console.error(error);
        showModal('Fetch Failed', 'Could not fetch new articles. Please verify the blog URL and try again.', 'error');
      } finally {
        setIsScraping(false);
      }
    };

    return (
        <div className="settings-page">
            <header className="page-header">
                <h1>Settings</h1>
                <p>Manage application configuration and pipelines</p>
            </header>

            <div className="settings-section">
                <div className="section-header">
                    <Zap size={24} className="section-icon" />
                    <h2>Content Pipeline</h2>
                </div>
                <p className="section-desc">
                    Manually trigger the scraper to find new articles or run the AI enrichment process.
                </p>

                <div className="actions-grid">
                    <div className="action-card">
                        <h3>Fetch New Articles</h3>
                        <p>Crawls BeyondChats blog for the latest posts.</p>
                        <button 
                            className="settings-btn secondary"
                            onClick={handleFetchArticles} 
                            disabled={isScraping}
                        >
                            <Download size={18} className={isScraping ? 'bounce' : ''} />
                            <span>{isScraping ? 'Fetching...' : 'Fetch Now'}</span>
                        </button>
                    </div>

                    <div className="action-card">
                        <h3>Enhance with AI</h3>
                        <p>Enriches pending articles with competitive intelligence.</p>
                        <button 
                            className="settings-btn primary"
                            onClick={handleRunScraper} 
                            disabled={isProcessing}
                        >
                            <RefreshCw size={18} className={isProcessing ? 'spin' : ''} />
                            <span>{isProcessing ? 'Enhancing...' : 'Enhance with AI'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="settings-section danger">
                <div className="section-header">
                    <AlertCircle size={24} className="section-icon" />
                    <h2>Danger Zone</h2>
                </div>
                <p className="section-desc">Irreversible actions for database management.</p>
                
                <div className="actions-grid">
                     <div className="action-card">
                        <h3>Reset Database</h3>
                        <p>Clears all articles and resets the system.</p>
                        <button className="settings-btn danger" disabled title="Not implemented yet">
                            Reset All Data
                        </button>
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalData.title}
                message={modalData.message}
                type={modalData.type}
            />
        </div>
    );
};

export default SettingsPage;
