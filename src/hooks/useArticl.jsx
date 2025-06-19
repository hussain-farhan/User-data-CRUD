import {useState,useEffect} from 'react';
import axios from 'axios';
import {z} from 'zod';

const articleSchema = z.object({
    source: z.object({
        id: z.string().nullable().optional(),
        name: z.string(),
    }),
    author: z.string().nullable().optional(),
    title: z.string(),
    description: z.string().nullable().optional(),
    url: z.string().url(),
    urlToImage: z.string().url().nullable().optional(),
    publishedAt: z.string().datetime(),
    content: z.string().nullable().optional(),
});

const responseSchema = z.object({
    status: z.literal("ok"),
    totalResults: z.number(),
    articles: z.array(articleSchema),
});

const useArticles = (query = "trump", totalPages = 5, pageSize = 20) => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllArticles = async () => {
      let allArticles = [];

      for (let page = 1; page <= totalPages; page++) {
        try {
          const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=${pageSize}&apiKey=4f7a2ecc949c4d8a85226871baf59493`
          );

          const parsed = responseSchema.safeParse(response.data);

          if (!parsed.success) {
            console.error("Validation failed:", parsed.error);
            setError("Invalid data received from API");
            return;
          }

          allArticles = [...allArticles, ...parsed.data.articles];
        } catch (err) {
          console.error(`Error fetching page ${page}:`, err);
          setError(`Error fetching data: ${err.message}`);
        }
      }

      allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      setArticles(allArticles);
    };

    fetchAllArticles();
  }, [query, totalPages, pageSize]);

  return { articles, error };
};

export default useArticles;




