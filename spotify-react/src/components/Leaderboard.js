/*
    The Leaderboard component takes props of a data array
    and score click function. It sorts the data to be in 
    descending order and displays through a table.
*/

import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ data, type, onScoreClick }) => {
    const sortedMap = new Map([...data.entries()].sort((a, b) => b[1] - a[1]));
    return (
        <div className="leaderboard">
            <h1>{type} Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th className="header-left">Rank</th>
                        <th>Name</th>
                        <th className="header-right">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {[...sortedMap.entries()].map(([name, score], index) => (
                        <tr key={name}>
                            <td>{index + 1}</td>
                            <td>{name}</td>
                            <td onClick={() => onScoreClick(name, type)}>{score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
