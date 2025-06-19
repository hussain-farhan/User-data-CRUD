import { useState, useEffect } from 'react';
import axios from 'axios';

const useArticles = (query = "trump", totalPages = 5, pageSize = 20) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchAllArticles = async () => {
      let allArticles = [];

      for (let page = 1; page <= totalPages; page++) {
        try {
          const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=${pageSize}&apiKey=4f7a2ecc949c4d8a85226871baf59493`
          );
          allArticles = [...allArticles, ...response.data.articles];
        } catch (error) {
          console.error(`Error fetching page ${page}:`, error);
        }
      }

      allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setArticles(allArticles);
    };

    fetchAllArticles();
  }, [query, totalPages, pageSize]);

  return articles;
};

export default useArticles;
