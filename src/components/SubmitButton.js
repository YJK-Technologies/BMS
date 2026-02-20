import React from 'react';

const SubmitButton = ({ label, disabled, onClick }) => {
    return (
        <button type="button" className="submit-button" disabled={disabled} onClick={onClick}>
            {label}
        </button>
    );
};

export default SubmitButton;
