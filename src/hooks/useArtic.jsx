import { useState, useEffect } from 'react';
import { z } from 'zod';

const articleSchema = z.object({
  author: z.string().nullable(),
  title: z.string(),
  source: z.object({
    name: z.string(),
  }),
  publishedAt: z.string(),
  url: z.string(),
});

const responseSchema = z.object({
  articles: z.array(articleSchema),
});

const useArticles = (query = "trump", totalPages = 5, pageSize = 20) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchAllArticles = async () => {
      let allArticles = [];

      for (let page = 1; page <= totalPages; page++) {
        try {
          const res = await fetch(
            `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=${pageSize}&apiKey=YOUR_API_KEY`
          );

          if (!res.ok) {
            console.error(`HTTP error on page ${page}: ${res.status}`);
            continue;
          }

          const data = await res.json();
          const parsed = responseSchema.safeParse(data);

          if (parsed.success) {
            allArticles = [...allArticles, ...parsed.data.articles];
          } else {
            console.error("Validation failed", parsed.error);
          }

        } catch (err) {
          console.error(`Error fetching page ${page}:`, err);
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
