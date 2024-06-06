import React from 'react';
import './Leaderboard.css';



const Leaderboard = ({ data }) => {
    const dataArray = Object.keys(data).map(name => ({
        name: name,
        score: data[name]
    }));
    
    const sortedData = dataArray.sort((a, b) => b.score - a.score);

    return (
        <div className="leaderboard">
            <h1>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
