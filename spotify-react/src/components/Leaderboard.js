import React from 'react';
import './Leaderboard.css';



const Leaderboard = ({ data }) => {
    const sortedMap = new Map([...data.entries()].sort((a, b) => b[1] - a[1]));
    console.log(sortedMap)

    return (
        <div className="leaderboard">
            <h1>Artist Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {[...sortedMap.entries()].map(([name, score], index) => (
                        <tr key={name}>
                            <td>{index + 1}</td>
                            <td>{name}</td>
                            <td>{score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
