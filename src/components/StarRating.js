// StarRating.js
import React from 'react';
import './StarRating.css'; // Add your CSS for styling

const StarRating = ({ rating, onChange, maxStars = 5 }) => {
    const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

    return (
        <div className="star-rating">
            {stars.map(star => (
                <span
                    key={star}
                    className={`star ${rating >= star ? 'filled' : ''}`}
                    onClick={() => onChange(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;
