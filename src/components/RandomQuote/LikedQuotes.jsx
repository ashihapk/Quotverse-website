// LikedQuotesPage.jsx
import React from 'react';

const LikedQuotesPage = ({ likedQuotes }) => {
  return (
    <div>
      <h1>Your Liked Quotes</h1>
      <ul>
        {likedQuotes.map((quote, index) => (
          <li key={index}>
            <blockquote>{quote.content}</blockquote>
            <p>- {quote.author} -</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LikedQuotesPage;
