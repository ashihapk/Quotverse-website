import React, { useEffect, useState } from 'react';
import './RandomQuote.css';
import commentIcon from '../assets/comment_icon.png';
import likeIcon from '../assets/like_icon.png';
import likedIcon from '../assets/liked_icon.png';
import shareIcon from '../assets/share_icon.png';
import homeIcon from '../assets/home.png';
import likedeIcon from '../assets/li1.png';
import trendingIcon from '../assets/trending_icon.png';
import axios from 'axios';

const API_BASE_URL = 'https://api.quotable.io';
const RANDOM_QUOTES_ENDPOINT = '/quotes/random';
const RANDOM_QUOTES_LIMIT = 4;

function App() {
  const [quotes, setQuotes] = useState([]);
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchId, setSearchId] = useState('');
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [showLikedQuotes, setShowLikedQuotes] = useState(false);
  const [showTrendingTopics, setShowTrendingTopics] = useState(false);
  const [selectedTrendingTopic, setSelectedTrendingTopic] = useState(null);
  const [trendingQuotes, setTrendingQuotes] = useState([]);
 
   
  useEffect(() => {
    axios.get(`${API_BASE_URL}/search/authors?query=${searchAuthor}`)
      .then(response => {
        const data = response.data;
        setQuotes(data.map(quote => ({ ...quote, showCommentBox: false, liked: false, comments: [] })));
      })
      .catch(error => {
        console.error('Error fetching random quotes:', error);
      });
  
   
  }, [searchAuthor])
  

  useEffect(() => {
    fetchRandomQuotes();
    fetchTrendingTopics();
  }, []);

  const fetchRandomQuotes = () => {
    axios.get(`${API_BASE_URL}${RANDOM_QUOTES_ENDPOINT}?limit=${RANDOM_QUOTES_LIMIT}`)
      .then(response => {
        const data = response.data;
        setQuotes(data.map(quote => ({ ...quote, showCommentBox: false, liked: false, comments: [] })));
      })
      .catch(error => {
        console.error('Error fetching random quotes:', error);
      });
  };

  const fetchTrendingTopics = () => {
    const trendingTopicsData = ['#Technology', '#Science', '#History', '#love', '#Happiness','#wisdome','#smile'];
    setTrendingTopics(trendingTopicsData);
  };

  const handleLike = (id) => {
    console.log(id)
    setQuotes(prevQuotes => prevQuotes.map(quote => {
      if (quote._id === id) {
        const updatedQuote = { ...quote, liked: !quote.liked };
        if (updatedQuote.liked) {
          setLikedQuotes(prevLikedQuotes => [...prevLikedQuotes, updatedQuote]);
        } else {
          setLikedQuotes(prevLikedQuotes => prevLikedQuotes.filter(q => q._id !== updatedQuote._id));
        }
        return updatedQuote;
      } else {
        return quote;
      }
    }));
  };

  const handleComment = (id) => {
    setQuotes(prevQuotes => prevQuotes.map(quote => {
      if (quote._id === id) {
        return { ...quote, showCommentBox: !quote.showCommentBox };
      } else {
        return { ...quote, showCommentBox: false }; // Close comment box for other quotes
      }
    }));
  };

  const handlePostComment = (id, comment) => {
    setQuotes(prevQuotes => prevQuotes.map(quote => {
      if (quote._id === id) {
        const updatedComments = [...quote.comments, comment];
        return { ...quote, comments: updatedComments };
      } else {
        return quote;
      }
    }));
  };

  const handleShare = (id) => {
    const quote = quotes.find(q => q._id === id);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(quote.content + ' - ' + quote.author)}`;
    window.open(url, '_blank');
  };

  const handleAuthorSearch = (e) => {
    setSearchAuthor(e.target.value);
  };

  const handleIdSearch = (e) => {
    setSearchId(e.target.value);
  };

  const handleTrendingTopicClick = (tag) => {
    const newtag=(tag.slice(1))

    axios.get(`${API_BASE_URL}/quotes?tags=${newtag}`)
      .then(response => {
        
        const data = response.data.results;
        setTrendingQuotes(data.map(quote => ({ ...quote, showCommentBox: false, liked: false, comments: [] })));
        setSelectedTrendingTopic(tag);
        setShowTrendingTopics(true);
      })
      .catch(error => {
        console.error('Error fetching quotes for trending topic:', error);
      });
  };

  const handleLikedQuotesClick = () => {
    setShowLikedQuotes(true);
    setShowTrendingTopics(false);
  };

  const handleHomeClick = () => {
    setShowLikedQuotes(false);
    setShowTrendingTopics(false);
    fetchRandomQuotes();
  };

  const filteredQuotes = showLikedQuotes ? likedQuotes : quotes.filter(quote => {
    if (searchAuthor && !searchId) {
      return quote.author.toLowerCase().includes(searchAuthor.toLowerCase());
    } else if (!searchAuthor && searchId) {
      return quote._id.toLowerCase().includes(searchId.toLowerCase());
    } else if (searchAuthor && searchId) {
      return quote.author.toLowerCase().includes(searchAuthor.toLowerCase()) && quote._id.toLowerCase().includes(searchId.toLowerCase());
    } else {
      return true;
    }
  });

  return (
    <div className="App">
      <div className="sidebar">
        <ul>
          <li onClick={handleHomeClick}>
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </li>
          <li onClick={handleLikedQuotesClick}>
            <img src={likedeIcon} alt="Liked Quotes" />
            <span>Liked Quotes</span>
          </li>
          <li onClick={() => setShowTrendingTopics(!showTrendingTopics)}>
            <img src={trendingIcon} alt="Trending Topics" />
            <span>Trending Topics</span>
          </li>
        </ul>
        {showTrendingTopics && (
          <ul>
            {trendingTopics.map((topic, index) => (
              <li key={index} onClick={() => handleTrendingTopicClick(topic)}>{topic}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="main-content">
        <div className="search">
          <input type="text" placeholder="Search by author" value={searchAuthor} onChange={handleAuthorSearch} />
          <input type="text" placeholder="Search by ID" value={searchId} onChange={handleIdSearch} />
        </div>
        {showTrendingTopics && (
          <TrendingQuotes
            quotes={trendingQuotes}
            topic={selectedTrendingTopic}
          />
        )}
        {filteredQuotes.map((quote) => (
          <div className="quote" key={quote._id}>
            <h2>{quote.content}</h2>
            <small>- {quote.author} -</small>
            <div className="actions">
              {quote.liked ? (
                <img src={likedIcon} alt="Liked" className="icon" onClick={() => handleLike(quote._id)} />
              ) : (
                <img src={likeIcon} alt="Like" className="icon" onClick={() => handleLike(quote._id)} />
              )}
              <img src={commentIcon} alt="Comment" className="icon" onClick={() => handleComment(quote._id)} />
              <img src={shareIcon} alt="Share" className="icon" onClick={() => handleShare(quote._id)} />
            </div>
            {quote.showCommentBox && (
              <CommentBox
                id={quote._id}
                comments={quote.comments}
                onPostComment={handlePostComment}
              />
            )}
          </div>
        ))}
        <br />
        <button className="btn" onClick={fetchRandomQuotes}>Generate New Quotes</button>
      </div>
    </div>
  );
}

const CommentBox = ({ id, comments, onPostComment }) => {
  const [commentText, setCommentText] = useState('');

  const handlePost = () => {
    if (commentText.trim() !== '') {
      onPostComment(id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="comment-box">
      <textarea
        placeholder="Enter your comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button onClick={handlePost}>Post</button>
      <div className="comments">
        <h3>Comments:</h3>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>{comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const TrendingQuotes = ({ quotes, topic }) => {
  return (
    <div className="trending-quotes">
      <h2>{topic}</h2>
      <div className="quotes-container">
        {quotes.map((quote) => (
          <div className="quote" key={quote._id}>
            <h3>{quote.content}</h3>
            <p>- {quote.author} -</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
