import React, { useState } from 'react';
import { 
  Zap, 
  RefreshCw, 
  Download,
  AlertCircle
} from 'lucide-react';
import { triggerScraper, scrapeNewArticles } from '../services/articleService';

const SettingsPage = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isScraping, setIsScraping] = useState(false);

    const handleRunScraper = async () => {
      try {
        setIsProcessing(true);
        await triggerScraper();
        alert('AI Processing Started! Check the console/logs for progress.');
      } catch (error) {
        console.error(error);
        alert('Failed to start processing.');
      } finally {
        setIsProcessing(false);
      }
    };
  
    const handleFetchArticles = async () => {
      try {
        setIsScraping(true);
        const result = await scrapeNewArticles();
        const count = result.count || 0;
        alert(`Fetched ${count} new articles! Refresh the dashboard.`);
      } catch (error) {
        console.error(error);
        alert('Failed to fetch articles.');
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
                        <p>Crawls BeyondChats blog for the latest headers.</p>
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
                        <h3>Run AI Analysis</h3>
                        <p>Enriches pending articles with competitive intelligence.</p>
                        <button 
                            className="settings-btn primary"
                            onClick={handleRunScraper} 
                            disabled={isProcessing}
                        >
                            <RefreshCw size={18} className={isProcessing ? 'spin' : ''} />
                            <span>{isProcessing ? 'Processing...' : 'Run Worker'}</span>
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
        </div>
    );
};

export default SettingsPage;
