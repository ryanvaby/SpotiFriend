import React from 'react'
import './App.css';
import Leaderboard from './components/Leaderboard';
import NavBar from './components/NavBar';
import Button from './components/Button';
import Modal from './components/Modal';
import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';


function App() {
    const CLIENT_ID = "2f4886cb98814cdb94ea0f9d5078901b"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-read-private user-top-read user-read-playback-state";

    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    var [playback, setPlayback] = useState("");
    var [type, setType] = useState("");
    const [artistData, setArtistData] = useState([]);
    const [artistLeaderboard, setArtistLeaderboard] = useState(new Map());
    const [trackData, setTrackData] = useState([]);
    const [trackLeaderboard, setTrackLeaderboard] = useState(new Map());
    const [modalVisible, setModalVisible] = useState(false);
    var [modalContent, setModalContent] = useState([]);
    var[leaderboardPage, setLeaderboardPage] = useState(true);
    var [profilePage, setProfilePage] = useState(false);

    const artistsPool = useMemo(() => ([
        "Taylor Swift", "Drake", "Billie Eilish", "Ariana Grande", "Ed Sheeran",
        "Post Malone", "Beyoncé", "Justin Bieber", "Conan Gray", "Kanye West",
        "Rihanna", "Adele", "Bruno Mars", "Kendrick Lamar", "The Weeknd",
        "Dua Lipa", "Harry Styles", "Olivia Rodrigo", "Shawn Mendes", "Travis Scott",
        "Sabrina Carpenter", "Lil Nas X", "Halsey", "Selena Gomez", "Laufey",
        "SZA", "Lana Del Rey", "Camila Cabello", "Gracie Abrams", "Miley Cyrus"
    ]), []);

    const tracksPool = useMemo(() => ([
        "Blinding Lights", "Watermelon Sugar", "Levitating", "Save Your Tears", "Good 4 U",
        "Peaches", "Smile Flower", "drivers license", "Stay", "Imperfect love",
        "Bad Habits", "Easy On Me", "Shivers", "Take My Breath", "Deja Vu",
        "Industry Baby", "Boyfriends", "34+35", "Dynamite", "Doesn't Matter",
        "But Sometimes", "Willow", "Therefore I Am", "Butter", "Heat Waves",
        "Don't Start Now", "Circles", "Rockstar", "Someone You Loved", "Truth Hurts"
    ]), []);

    const generateRandomData = useCallback((type) => {
        const randomArray = [];

        if (type === "artists") {
            var usedIndices = new Set();
            for (let i = 0; i < 20; i++) {
                const randomIndex = Math.floor(Math.random() * artistsPool.length);
                if (!usedIndices.has(randomIndex)) {
                    randomArray.push(artistsPool[randomIndex]);
                    usedIndices.add(randomIndex);
                }
            }
        }
        else if(type === "tracks"){
            var usedIndicesT = new Set();
            for (let i = 0; i < 20; i++) {
                const randomIndex = Math.floor(Math.random() * tracksPool.length);
                if (!usedIndicesT.has(randomIndex)) {
                    randomArray.push(tracksPool[randomIndex]);
                    usedIndicesT.add(randomIndex);
                }
            }
        }
   
        return randomArray;
    }, [artistsPool, tracksPool])

    const populateLeaderboard = useCallback((arrayData, type) => {
        var typeData = arrayData;
        var similarityData = [0];

        const currentUserArray = arrayData[1][0]
        const newLeaderboard = new Map();

        for (let i = 1; i < arrayData[0].length; i++){
            let score = 0;
            var comparingArray = arrayData[1][i]
            var userSimilarity = [];

            for (let k = 0; k < currentUserArray.length; k++){
                const temp = currentUserArray[k]
                if (comparingArray.includes(temp)) {
                    score++;
                    userSimilarity.push(temp)
                }
            }
            newLeaderboard.set(arrayData[0][i], score)
            similarityData.push(userSimilarity)
        }

        typeData.push(similarityData)
        //console.log(newLeaderboard);
        if (type === "artists"){
            setArtistData(typeData);
            setArtistLeaderboard(newLeaderboard); 
        }
        else if (type === "tracks"){
            setTrackData(typeData);
            setTrackLeaderboard(newLeaderboard); 
        }
    }, [])

    const populateUserData = useCallback((name, dataArray0, type) => {
        var dataArray1 = generateRandomData(type);
        var dataArray2 = generateRandomData(type);
        var dataArray3 = generateRandomData(type);
        var dataArray4 = generateRandomData(type);

        let userData = [
            [name, "Joe", "Katherine", "Andy", "Amanda"],
            [dataArray0, dataArray1, dataArray2, dataArray3, dataArray4]
        ];

        populateLeaderboard(userData, type)
    }, [generateRandomData, populateLeaderboard])

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
            const { data } = response;

            const userTop20A = [];

            for (let i = 0; i < 20; i++) {
                userTop20A.push(data.items[i].name);
            }
            
            console.log(userTop20A)
            populateUserData(userName, userTop20A, "artists");
        })
        .catch(function (error) { 
            console.log(error);
        });

    }, [populateUserData, token])

    const getTopTracks = useCallback(async (userName) => {
        console.log('tracks called');

        axios.get("https://api.spotify.com/v1/me/top/tracks?limit=20", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                type: "track",
                limit: 20
            }
        })
        .then(function (response) {
            const { data } = response;

            const userTop20T = [];

            for (let i = 0; i < 20; i++) {
                userTop20T.push(data.items[i].name);
            }
            console.log(userTop20T)
            populateUserData(userName, userTop20T, "tracks");
        })
        .catch(function (error) { 
            console.log(error);
        });

    }, [populateUserData, token])

    const getPlaybackState = useCallback(async () => {
        console.log("playback state called");
    
        axios.get("https://api.spotify.com/v1/me/player",  {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(function (response) {
            const { data } = response;
            const currentTrack = data.item.name
            setPlayback(currentTrack)
        })
        .catch(function (error) { 
            console.log(error);
        });
    }, [token]);

    const getUserProfile = useCallback(async () => {
        console.log("profile called");

        axios.get("https://api.spotify.com/v1/me",  {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(function (response) {
            const { data } = response;
            setUserName(data.display_name);
            setProfileImage(data.images[1].url)
            getTopArtists(userName);
            getTopTracks(userName);
        })
        .catch(function (error) { 
            console.log(error);
        });

    }, [getTopArtists, getTopTracks, userName, token])

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
            getPlaybackState()
        }

    }, [getUserProfile, getPlaybackState])

    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
    };

    const openModal = (selectedUser, type) => {
        var column;
        var similarities;

        if (type === "Artists"){
            column = artistData[0].indexOf(selectedUser)
            similarities = artistData[2][column]
        }
        else if (type === "Tracks"){
            column = trackData[0].indexOf(selectedUser)
            similarities = trackData[2][column]
        }

        setType(type);
        setModalContent(similarities.join(', '));
        setModalVisible(true);
    }

    const closeModal= () => setModalVisible(false);

    const renderProfile = () => {
        setProfilePage(true);
        setLeaderboardPage(false);
    }

    const renderLeaderboard = () => {
        setLeaderboardPage(true)
        setProfilePage(false)
    }

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    };

    return (
        <div className="App">
            <header className="App-header">
                
            {!token ? (
                <>
                    <h1>Welcome to SpotiFriend</h1>
                    <Button onClick={handleLogin} text="Login with Spotify"/>
                </>
            ) : (
                <> 
                    {leaderboardPage ? (
                        <>
                            <NavBar onProfile={renderProfile} onLeaderboard={renderLeaderboard} onLogout={logout}/>
                            <Leaderboard data={artistLeaderboard} type={"Artists"} onScoreClick={openModal} />
                            <Leaderboard data={trackLeaderboard} type={"Tracks"} onScoreClick={openModal} />
                        </>
                    ) : (
                        <>
                            {profilePage ? (
                                <>
                                    <NavBar onProfile={renderProfile} onLeaderboard={renderLeaderboard} onLogout={logout}/>
                                    <img src={profileImage} alt="Profile" width="300" height="300"/>
                                    <h1>{userName}</h1>
                                    <p>Currently listening to: {playback}</p>
                                    <p>Top 20 Artists: {artistData[1][0].join(', ')}</p>
                                    <p>Top 20 Tracks: {trackData[1][0].join(', ')}</p>
                                </>
                            ) : (
                                <>

                                </>
                            )}
                        </>
                    )}  
                </>
            )}

            </header>
            <Modal show={modalVisible} onClose={closeModal} type= {type} array={modalContent}/>
        </div>
    );
}

export default App;
