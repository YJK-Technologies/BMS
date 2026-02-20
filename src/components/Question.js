import React from 'react';
import './Question.css'; 

const Question = ({ name, text, options, onChange }) => {
    return (
        <div className="question">
            <h5>{text}</h5>
            <div className="options-container">
                {options.map(option => (
                    <label key={option} className="option-label">
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            onChange={() => onChange(option)}
                        />
                        {option}
                    </label>
                ))}
            </div>
            
        </div>
    );
};

export default Question;
