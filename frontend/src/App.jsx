import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/articles')
      setArticles(response.data.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching articles:', error)
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>BeyondChats Articles</h1>
      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <div className="article-grid">
          {articles.map(article => (
            <div key={article._id} className="article-card">
              <h2>{article.title}</h2>
              <p>{article.content.substring(0, 150)}...</p>
              <span className={`badge ${article.isUpdated ? 'updated' : 'original'}`}>
                {article.isUpdated ? 'AI Enhanced' : 'Original'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
