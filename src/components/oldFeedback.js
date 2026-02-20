import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import SubmitButton from './SubmitButton.js';
import StarRating from './StarRating.js'; 
import './FeedbackForm.css';

const FeedbackForm = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [responses, setResponses] = useState({}); // Store all responses here
    const [direction, setDirection] = useState(''); 
    const [questions, setQuestions] = useState([]); 

    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                const response = await axios.get('http://192.168.1.142:3000/feedback'); 
                setQuestions(response.data.questions);
                setResponses(response.data.responses || {}); 
            } catch (error) {
                console.error("Error fetching feedback data:", error);
            }
        };

        fetchFeedbackData();
    }, []);

    const handleResponseChange = (questionId, value) => {
        setResponses(prevResponses => ({ ...prevResponses, [questionId]: value }));
    };

    const handleNext = () => {
        if (responses[questions[currentPage]?.id]) { 
            setDirection('next'); 
            setCurrentPage(prevPage => Math.min(prevPage + 1, questions.length - 1));
        }
    };

    const handlePrevious = () => {
        setDirection('prev'); 
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://192.168.1.142:3000/submit', responses); 
            alert("Thank you for your feedback!");
            // Optionally reset form or navigate to another page here
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            alert("There was an issue submitting your feedback. Please try again.");
        }
    };

    if (!questions.length) return <div>Loading questions...</div>; 

    return (
        <div className="feedback-form">
            <div className="progress-indicator">{currentPage + 1} of {questions.length}</div>

            <form onSubmit={handleFinalSubmit} className={`form-container ${direction}`} >
                <div className={`question ${direction}`}>
                    <p>{questions[currentPage]?.text}</p>
                    <StarRating
                        rating={responses[questions[currentPage]?.id]}
                        onChange={(value) => handleResponseChange(questions[currentPage].id, value)}
                    />
                </div>

                <div className="button-group">
                    {currentPage > 0 && (
                        <button type="button" className="btn-secondary" onClick={handlePrevious}>Back</button>
                    )}
                    {currentPage < questions.length - 1 ? (
                        <SubmitButton 
                            label="Next" 
                            disabled={!responses[questions[currentPage]?.id]} 
                            onClick={handleNext} 
                        />
                    ) : (
                        <SubmitButton 
                            label="Submit" 
                            disabled={!responses[questions[currentPage]?.id]} 
                        />
                    )}
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;  
