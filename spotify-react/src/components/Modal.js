/*
    The Modal Component takes props of show and close events
    and a data array. It displays a pop-up that lists common
    artists/tracks between the clicked user and the current user.
*/

import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, type, array}) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Common {type}</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <h2>{array}</h2>
                </div>
            </div>
        </div>
    );
};

export default Modal;
