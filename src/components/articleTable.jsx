import React from 'react';

const ArticleTable = ({ articles }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th style={headerStyle}>Title</th>
        <th style={headerStyle}>Author</th>
        <th style={headerStyle}>Source</th>
        <th style={headerStyle}>Published At</th>
      </tr>
    </thead>
    <tbody>
      {articles.map((article, index) => (
        <tr key={index}>
          <td style={cellStyle}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </td>
          <td style={cellStyle}>{article.author || 'Unknown'}</td>
          <td style={cellStyle}>{article.source.name}</td>
          <td style={cellStyle}>{new Date(article.publishedAt).toLocaleString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const headerStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  backgroundColor: '#f0f0f0',
  textAlign: 'left',
};

const cellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
};

export default ArticleTable;
