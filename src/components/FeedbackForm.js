import React, { useState, useEffect, useRef } from 'react';
import SubmitButton from './SubmitButton.js';
import StarRating from './StarRating.js';
import './FeedbackForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import vectorImage from './vector1.jpg';
import axios from 'axios';

const config = require('../ApiConfig.js');


const FeedbackForm = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [responses, setResponses] = useState({});
    const [direction, setDirection] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false); // New state for modal visibility
    const [remarks, setRemarks] = useState(''); // State for remarks input
    const [patientName, setPatientName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [date, setDate] = useState('');
    const [SIDNo, setSIDNo] = useState('');
    const [Plan, setPlan] = useState('');
    const [gender, setGender] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const maxTime =  30; 
    const [timer, setTimer] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null); 
    const [audioBase64, setaudioBase64l] = useState(null); 

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const encodedData = queryParams.get('data');

        if (encodedData) {
            try {
                const decodedData = JSON.parse(atob(encodedData));
                setSIDNo(decodedData.SIDNo);
                setPlan(decodedData.plan);
                setDate(decodedData.Date);
                setGender(decodedData.gender)
            } catch (error) {
                console.error("Error decoding data:", error);
                alert("Invalid or corrupted data.");
            }
        } else {
            alert("No patient data found.");
        }
    }, [location.search]);

    // console.log(patientName, phoneNo)

    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/feedback`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body: JSON.stringify({attributeheader_code:Plan,descriptions:gender})
                });
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchFeedbackData();
    }, [Plan,gender]);

    const handleResponseChange = (question, value) => {
        setResponses(prevResponses => {
            const updatedResponses = { ...prevResponses, [question]: value };
            console.log(updatedResponses);
            return updatedResponses;
        });
    };

    const handleNext = () => {
        currentQuestions.forEach(question => {
            if (responses[question.Questions] === undefined) {
                setResponses(prevResponses => ({
                    ...prevResponses,
                    [question.Questions]: 0,  
                }));
            }
        });
    
        setDirection('next');
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleClose = () => {
        window.close();
        setIsSubmitted(false)
    }

    const handlePrevious = () => {
        setDirection('prev');
        setCurrentPage(prevPage => prevPage - 1);
    };
    
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
    
        const updatedResponses = { ...responses };
    
        currentQuestions.forEach((question) => {
            if (updatedResponses[question.Questions] === undefined) {
                updatedResponses[question.Questions] = 0;
            }
        });
    
        const feedbackData = Object.entries(updatedResponses).map(([key, value]) => ({
            checkup_date: date,
            SID_no: SIDNo,
            plans: Plan,
            department: key,
            rating: value || 0,
        }));
    
        let commentData = {
            checkup_date: date,
            SID_no: SIDNo,
            plans: Plan,
            department: 'Comments',
            feedback_comments: remarks,
            audio_comment: null,
        };
    
        if (audioBlob) {
            try {
                const base64Audio = await convertBlobToBase64(audioBlob);
                commentData.audio_comment = base64Audio;
            } catch (error) {
                console.error("Error converting audio to base64:", error);
                toast.error("Error processing the audio.");
                return;
            }
        }
    
        feedbackData.push(commentData);
    
        try {
            const jsonData = JSON.stringify({ savedData: feedbackData });
    
            const response = await fetch(`${config.apiBaseUrl}/addFeedbackFormtest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            });
    
            if (response.ok) {
                setIsSubmitted(true);
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || 'Failed to save your feedback data');
                console.error(errorResponse.details || errorResponse.message);
            }
        } catch (error) {
            console.error('Error inserting data:', error);
            toast.error('Error inserting data: ' + error.message);
        }
    };
    
    
const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract only the base64 string without metadata
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
};

    
    if (!questions.length) return <div>Loading questions...</div>;
    const startIdx = currentPage * 2;
    const endIdx = startIdx + 2;
    const currentQuestions = questions.slice(startIdx, endIdx);
    const myStyle = {
        backgroundImage: `url(${vectorImage})`,
        marginTop: "-70px",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                setAudioBlob(audioBlob); 

                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url); 
                audioChunks.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            setTimer(
                setInterval(() => {
                    setRecordingTime((prevTime) => {
                        if (prevTime >= maxTime) {
                            stopRecording(); 
                            return maxTime;
                        }
                        return prevTime + 1;
                    });
                }, 1000)
            );
        } catch (error) {
            console.error('Error accessing the microphone:', error);
            alert('Microphone access is required for recording.');
        }
    };


    const stopRecording = () => {
        setIsRecording(false);
        clearInterval(timer);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    return (
        <div >
        <div className="feedback-form">
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="progress-indicator">
                {startIdx + 1} - {Math.min(endIdx, questions.length)} of {questions.length}
            </div>
            <form onSubmit={handleFinalSubmit} className={`form-container ${direction}`}>
                {currentQuestions.map((question, index) => (
                    <div key={question.Question_No} className={`question ${direction}`}>
                        <p>{question.Questions}</p>
                        <StarRating
                            rating={responses[question.Questions] || 0}
                            onChange={(value) => handleResponseChange(question.Questions, value)}
                        />
                    </div>
                ))}
               {currentPage === Math.ceil(questions.length / 2) - 1 && (
                    <div className="remarks-container">
                        <div className="mic-container ">
                            <div className='col-4'>
                            <div className="recording-time">
                                <p>{isRecording ? `${formatTime(recordingTime)}` : ''}</p>
                            </div>
                            <div  className={`circle ms-2 ${isRecording ? 'active' : ''}`} onClick={toggleRecording}>
                            <FontAwesomeIcon className='icon' icon={faMicrophone} size='3x'/>
                            </div>
                            </div>
                        </div>

                        {audioUrl && (
                            <div className="audio-preview">
                                <p>Recorded Audio:</p>
                                <audio controls src={audioUrl} type="audio/webm"></audio>
                            </div>
                        )}
                            <>
                                <label htmlFor="remarks" className="comments-label">Comments:</label>
                                <textarea
                                    id="remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows="4"
                                    placeholder="Enter your comments here..."
                                    className="remarks-textarea"
                                />
                            </>
                    </div>
                )}
                <div className="d-flex justify-content-between gap-2 ">
                      <div className='d-flex justify-content-start'>{currentPage > 0 && (
                      
                        <div  className="btn btn-primary Submitbutton  p-2" onClick={handlePrevious}> Back</div>
                    
                    )}    </div>
                     <div className='d-flex justify-content-end'>{currentPage < Math.ceil(questions.length / 2) - 1 ? (
                        
                        
                        <div
                            
                            className="btn btn-primary Submitbutton p-2 "
                            onClick={handleNext}
                            disabled={currentQuestions.some(q => responses[q.Questions] === undefined)}
                        > Next</div>
                    ) : (
                        <div
                            
                            className="btn btn-primary Submitbutton p-2"
                            onClick={handleFinalSubmit}
                            disabled={questions.some(q => !responses[q.Questions])}
                        > Submit</div>
                      
                    )}  </div>
                </div>
            </form>
            {isSubmitted && (
                <div className="thank-you-modal p-3">
                    <div className="modal-content2 p-3" style={myStyle}>
                        <div className=' p-3'>
                            <h2 align="center" style={{ color: "black" }}>Thank You!</h2>
                            <p style={{ color: "black" }}>Your feedback has been submitted successfully.</p>
                            <button align="center" className="p-2 btn btn-primary" onClick={handleClose}>Close</button>
                        </div></div>
                </div>
            )}
        </div>
        </div>
    );
};
export default FeedbackForm;