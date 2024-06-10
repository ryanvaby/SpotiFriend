import React from 'react';
import './Table.css';



const Table = ({ data, type, }) => {
    return (
        <div className="table">
            <h1>Your Top {type}</h1>
            <table>
                <thead>
                    <tr>
                        <th className="header-left">Rank</th>
                        <th className="header-right">Artist</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((name, index) => (
                        <tr key={name}>
                            <td>{index + 1}</td>
                            <td>{name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;