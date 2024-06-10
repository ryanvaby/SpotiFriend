import React from 'react';
import './NavBar.css';
import Button from './Button';

const Navbar = ({onProfile, onLeaderboard, onLogout}) => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-brand">
                    <h1>SpotiFriend</h1>
                </div>
                <div className="navbar-profile">
                    <Button onClick={onProfile} text="Profile"/>
                </div>
                <div className="navbar-leaderboards">
                    <Button onClick={onLeaderboard} text="Leaderboards"/>
                </div>
            </div>
            <div className="navbar-logout">
                <Button onClick={onLogout} text="Logout"/>
            </div>
        </nav>
    );
};

export default Navbar;
