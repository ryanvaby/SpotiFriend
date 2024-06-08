import React from 'react'
import './App.css';
import Leaderboard from './components/Leaderboard';
import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';


function App() {
    const CLIENT_ID = "2f4886cb98814cdb94ea0f9d5078901b"
    const REDIRECT_URI = "http://192.168.86.41:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-read-private user-top-read";

    const [token, setToken] = useState("")
    const [unsortedLeaderboard, setUnsortedLeaderboard] = useState(new Map());

    const artistsPool = useMemo(() => ([
        "Taylor Swift", "Drake", "Billie Eilish", "Ariana Grande", "Ed Sheeran",
        "Post Malone", "Beyoncé", "Justin Bieber", "Conan Gray", "Kanye West",
        "Rihanna", "Adele", "Bruno Mars", "Kendrick Lamar", "The Weeknd",
        "Dua Lipa", "Harry Styles", "Olivia Rodrigo", "Shawn Mendes", "Travis Scott",
        "Sabrina Carpenter", "Lil Nas X", "Halsey", "Selena Gomez", "Laufey",
        "SZA", "Lana Del Rey", "Camila Cabello", "Gracie Abrams", "Miley Cyrus"
    ]), []);

    const generateRandomArtists = useCallback(() => {
        const randomArtists = [];
        for (let i = 0; i < 20; i++) {
            const randomIndex = Math.floor(Math.random() * artistsPool.length);
            randomArtists.push(artistsPool[randomIndex]);
        }
        return randomArtists;
    }, [artistsPool])

    const populateLeaderboard = useCallback((arrayData) => {
        const currentUserArtists = arrayData[1][0]
        const newLeaderboard = new Map();

        for (let i = 1; i < arrayData[0].length; i++){
            let score = 0;
            var comparingArray = arrayData[1][i]

            for (let k = 0; k < currentUserArtists.length; k++){
                const temp = currentUserArtists[k]
                if (comparingArray.includes(temp)) {
                    score++;
                }
            }
            newLeaderboard.set(arrayData[0][i], score)
        }

        console.log(newLeaderboard);
        setUnsortedLeaderboard(newLeaderboard);
    }, [])

    const populateUserData = useCallback((name, artistsArray0) => {
        const artistsArray1 = generateRandomArtists();
        const artistsArray2 = generateRandomArtists();
        const artistsArray3 = generateRandomArtists();
        const artistsArray4 = generateRandomArtists();

        let userData = [
            [name, "Joe", "Katherine", "Andy", "Amanda"],
            [artistsArray0, artistsArray1, artistsArray2, artistsArray3, artistsArray4]
        ];

        populateLeaderboard(userData)
    }, [generateRandomArtists, populateLeaderboard])

    const getTopArtists = useCallback(async (userName) => {
        console.log('artists called');

        axios.get("https://api.spotify.com/v1/me/top/artists?limit=20", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                type: "artist",
                limit: 20
            }
        })
        .then(function (response) {
            console.log(response);
            const { data } = response;

            const userTop20A = [];

            for (let i = 0; i < 20; i++) {
                userTop20A.push(data.items[i].name);
            }
            
            populateUserData(userName, userTop20A);
        })
        .catch(function (error) { 
            console.log(error);
        });

    }, [populateUserData, token])

    const getUserProfile = useCallback(async () => {
        console.log("called");

        axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(function (response) {
            const { data } = response;
            console.log(response);
            const userName = data.display_name;
            getTopArtists(userName);
        })
        .catch(function (error) { 
            console.log(error);
        });

    }, [getTopArtists, token])

    useEffect(() => {
        console.log("in useeffect")
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        console.log(token)
        console.log(hash)

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        if (token) {
            setToken(token)
            getUserProfile()
        }

    }, [getUserProfile])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>SpotiFriend</h1>
                {!token ?
                    <a href={
                        `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
                        >Login to Spotify</a>
                    :
                    <>
                        <Leaderboard data={unsortedLeaderboard}/>
                        <button onClick={logout}>Logout</button>
                    </>
                }
            </header>            
        </div>
    );
}

export default App;
