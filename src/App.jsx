import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// Main App Component
const ArticleApp = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch initial random articles
  useEffect(() => {
    fetchRandomArticles();
  }, []);

  // Fetch random articles
  const fetchRandomArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/random-articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching random articles:', error);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchRandomArticles();
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error searching articles:', error);
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async (title) => {
    try {
      const response = await fetch(`http://localhost:8000/recommend-articles?title=${encodeURIComponent(title)}`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  // Handle article selection
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    fetchRecommendations(article.title);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 p-2 border rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
        <div className="w-full mx-auto">
          {selectedArticle ? (
            // Article Detail View
            <div className="w-full">
              <button
                onClick={() => setSelectedArticle(null)}
                className="mb-4 text-blue-500 hover:underline flex items-center gap-2"
              >
                ← Back to articles
              </button>
              
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold mb-4 text-black">{selectedArticle.title}</h1>
                <div className="text-gray-600 mb-4">
                  By {selectedArticle.author} | {selectedArticle.published_date}
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedArticle.content}</p>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-black">Recommended Articles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((article, index) => (
                      <div
                        key={index}
                        onClick={() => handleArticleClick(article)}
                        className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <h3 className="font-bold mb-2 text-lg text-black">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          By {article.author}
                        </p>
                        <p className="text-gray-800 line-clamp-3">{article.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Article Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article, index) => (
                <div
                  key={index}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-bold mb-2 text-black">{article.title}</h2>
                  <p className="text-gray-600 text-sm mb-2">
                    By {article.author} | {article.published_date}
                  </p>
                  <p className="text-gray-800 line-clamp-3">{article.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleApp;
