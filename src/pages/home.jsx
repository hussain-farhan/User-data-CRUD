import React from 'react';
import useArtic from '../hooks/useArtic';
import usePagination from '../hooks/usePagination';
import ArticleTable from '../components/articleTable';
import useArticl from '../hooks/useArticl';

const HomePage = () => {
  const {articles,error} = useArticl();
  const { currentItems, currentPage, totalPages, handlePageChange } = usePagination(articles || []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>
 US Headlines</h1>
      
      <ArticleTable articles={currentItems} />

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={buttonStyle}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={buttonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  margin: '0 5px',
  padding: '8px 12px',
  cursor: 'pointer',
};

export default HomePage;



  //   axios
  //     .get(
  //       'https://newsapi.org/v2/top-headlines?q=trump&apiKey=4f7a2ecc949c4d8a85226871baf59493'
  //     )
  //     .then((response) => {
  //       setArticles(response.data.articles); 
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching news:', error);
  //     });
  // }, []);