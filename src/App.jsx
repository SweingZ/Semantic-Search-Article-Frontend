import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import axios from "axios";

const ArticleApp = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchRandomArticles();
  }, []);

  const fetchRandomArticles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/random-articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching random articles:', error.message);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchRandomArticles();
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/search', {
        query: searchQuery,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Error searching articles:', error.message);
    }
  };
  
  const fetchRecommendations = async (title) => {
    try {
      const response = await axios.get(`http://localhost:8000/recommend-articles`, {
        params: { title },
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error.message);
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    fetchRecommendations(article.title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Search Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 p-3 border border-gray-200 rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full mx-auto">
          {selectedArticle ? (
            // Article Detail View
            <div className="w-full">
              <button
                onClick={() => setSelectedArticle(null)}
                className="mb-6 bg-white px-6 py-3 rounded-xl shadow-md flex items-center gap-3 group transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <ArrowLeft 
                  size={20} 
                  className="text-blue-500 group-hover:-translate-x-1 transition-transform duration-200" 
                />
                <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  Back to articles
                </span>
              </button>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">{selectedArticle.title}</h1>
                <div className="text-gray-600 mb-6 flex items-center gap-2">
                  <span className="font-medium">By {selectedArticle.author}</span>
                  <span className="text-gray-400">•</span>
                  <span>{selectedArticle.published_date}</span>
                </div>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedArticle.content}</p>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Recommended Articles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((article, index) => (
                      <div
                        key={index}
                        onClick={() => handleArticleClick(article)}
                        className="bg-white p-6 rounded-xl shadow-md cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <h3 className="font-bold mb-3 text-lg text-gray-900 hover:text-blue-600 transition-colors duration-200">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          By {article.author}
                        </p>
                        <p className="text-gray-700 line-clamp-3">{article.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Article Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div
                  key={index}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white p-6 rounded-xl shadow-md cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h2 className="text-xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    By {article.author} | {article.published_date}
                  </p>
                  <p className="text-gray-700 line-clamp-3">{article.content}</p>
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
