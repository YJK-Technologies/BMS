import React from 'react';
import './dashboard.css';

const RatingStars = ({ setSelectedRating }) => {
  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star"
          onClick={() => handleStarClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
