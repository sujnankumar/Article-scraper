import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, CheckCircle, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/articles/stats');
                setStats(data.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loader">Loading Analytics...</div>;

    const statCards = [
        { 
            title: 'Total Articles', 
            value: stats?.total || 0, 
            icon: FileText, 
            color: '#6366f1' 
        },
        { 
            title: 'AI Enhanced', 
            value: stats?.enhanced || 0, 
            icon: CheckCircle, 
            color: '#10b981' 
        },
        { 
            title: 'Pending Process', 
            value: stats?.pending || 0, 
            icon: Clock, 
            color: '#f59e0b' 
        }
    ];

    return (
        <div className="analytics-page">
            <header className="page-header">
                <h1>Analytics Dashboard</h1>
                <p>Real-time insights into content processing</p>
            </header>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="stat-card"
                    >
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="last-updated-card"
            >
                <h3>System Status</h3>
                <div className="status-row">
                    <span>Last Article Update:</span>
                    <strong>{stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}</strong>
                </div>
                <div className="status-row">
                    <span>Active Services:</span>
                    <strong style={{ color: '#10b981' }}>Operational</strong>
                </div>
            </motion.div>
        </div>
    );
};

export default AnalyticsPage;
