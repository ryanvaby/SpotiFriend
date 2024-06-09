import React from 'react';
import './Button.css';

const Button = ({ onClick, text, type = "button" }) => {
    return (
        <button className="custom-button" onClick={onClick} type={type}>
            {text}
        </button>
    );
};

export default Button;
