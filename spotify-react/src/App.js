/*
    App.js is the main source of logic for the Spotifriend web application.
    It calls various endpoints of the Spotify Web API to get necessary data
    for each function of the application, and communicates with React to create 
    components for the UI.
*/

// import statements for React components
import React from 'react'
import './App.css';
import Leaderboard from './components/Leaderboard';
import NavBar from './components/NavBar';
import Button from './components/Button';
import Table from './components/Table';
import Modal from './components/Modal';
import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

// the main method that performs all functions for the application
function App() {
    // information used when authorizing and calling Spotify API
    const CLIENT_ID = "2f4886cb98814cdb94ea0f9d5078901b"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-read-private user-top-read user-read-playback-state";

    // states assigned throughout App() that are used to communicate with React components
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    var [playback, setPlayback] = useState("");
    var [playbackArtist, setPlaybackArtist] = useState("");
    var [type, setType] = useState("");
    const [artistData, setArtistData] = useState([]);
    const [artistLeaderboard, setArtistLeaderboard] = useState(new Map());
    const [trackData, setTrackData] = useState([]);
    const [trackLeaderboard, setTrackLeaderboard] = useState(new Map());
    const [modalVisible, setModalVisible] = useState(false);
    var [modalContent, setModalContent] = useState([]);
    var[leaderboardPage, setLeaderboardPage] = useState(true);
    var [profilePage, setProfilePage] = useState(false);

    // artistsPool provides random artists for generateRandomData to choose from
    const artistsPool = useMemo(() => ([
        "Taylor Swift", "Drake", "Billie Eilish", "Ariana Grande", "Ed Sheeran",
        "Post Malone", "Beyoncé", "Justin Bieber", "Conan Gray", "Kanye West",
        "Rihanna", "Adele", "Bruno Mars", "Kendrick Lamar", "The Weeknd",
        "Dua Lipa", "Harry Styles", "Olivia Rodrigo", "Shawn Mendes", "Travis Scott",
        "Sabrina Carpenter", "Lil Nas X", "Halsey", "Selena Gomez", "Laufey",
        "SZA", "Lana Del Rey", "Camila Cabello", "Gracie Abrams", "Miley Cyrus"
    ]), []);

    // tracksPool provides random tracks for generateRandomData to choose from
    const tracksPool = useMemo(() => ([
        "Blinding Lights", "Watermelon Sugar", "Levitating", "Save Your Tears", "Good 4 U",
        "Peaches", "Smile Flower", "drivers license", "Stay", "Imperfect love",
        "Bad Habits", "Easy On Me", "Shivers", "Take My Breath", "Deja Vu",
        "Industry Baby", "Boyfriends", "34+35", "Dynamite", "Doesn't Matter",
        "But Sometimes", "Willow", "Therefore I Am", "Butter", "Heat Waves",
        "Don't Start Now", "Circles", "Rockstar", "Someone You Loved", "Truth Hurts"
    ]), []);

    // generateRandomData creates an array of 20 artists or tracks
    const generateRandomData = useCallback((type) => {
        const randomArray = [];
        
        // create appropriate array based on type of data needed, preventing duplicates
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

    /*
        populateLeaderboard takes the user data structure and uses
        a comparison algorithm to assign a score to each user based 
        on similarity to the current user's data.
    */
    const populateLeaderboard = useCallback((arrayData, type) => {
        var typeData = arrayData;
        var similarityData = [0];
        const currentUserArray = arrayData[1][0]
        const newLeaderboard = new Map();

        // loop through the array of user's data arrays
        for (let i = 1; i < arrayData[0].length; i++){
            let score = 0;
            var comparingArray = arrayData[1][i]
            var userSimilarity = [];

            // loop through the data array and check if it includes each element
            // of the current user's data array
            for (let k = 0; k < currentUserArray.length; k++){
                const temp = currentUserArray[k]

                // increment score if there is a common element and add to
                //array of similar elements
                if (comparingArray.includes(temp)) {
                    score++;
                    userSimilarity.push(temp)
                }
            }
            newLeaderboard.set(arrayData[0][i], score)
            similarityData.push(userSimilarity)
        }
        
        // add the scores as a new row into the user data structure
        typeData.push(similarityData)

        // assign the data structure to the appropriate type state
        if (type === "artists"){
            setArtistData(typeData);
            setArtistLeaderboard(newLeaderboard); 
        }
        else if (type === "tracks"){
            setTrackData(typeData);
            setTrackLeaderboard(newLeaderboard); 
        }
    }, [])

    /*  
        populateUserData creates a data structure of users and their top
        artists/tracks for easy access when interacting with React components.
        It takes the current user's data as parameters to fill the first
        column of the structure.
    */
    const populateUserData = useCallback((name, dataArray0, type) => {
        // get 4 arrays, each with 20 artists or tracks based on type 
        var dataArray1 = generateRandomData(type);
        var dataArray2 = generateRandomData(type);
        var dataArray3 = generateRandomData(type);
        var dataArray4 = generateRandomData(type);

        // fill data structure with data based on user
        let userData = [
            [name, "Joe", "Katherine", "Andy", "Amanda"],
            [dataArray0, dataArray1, dataArray2, dataArray3, dataArray4]
        ];
        
        // pass user data to be used to create a leaderboard
        populateLeaderboard(userData, type)
    }, [generateRandomData, populateLeaderboard])

    /*
        getTopArtists calls the Spotify Web API to obtain the current
        user's top 20 most listened to artists
    */
    const getTopArtists = useCallback(async (userName) => {
        console.log('artists called');
        
        // Spotify API call
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
            
            // add each artist to the array
            for (let i = 0; i < 20; i++) {
                userTop20A.push(data.items[i].name);
            }
            
            // send the current user's data to be included in the large data structure
            populateUserData(userName, userTop20A, "artists");
        })
        .catch(function (error) { 
            console.log(error);
        });

    }, [populateUserData, token])

    /*
        getTopTracks calls the Spotify Web API to obtain the current
        user's top 20 most listened to tracks
    */
    const getTopTracks = useCallback(async (userName) => {
        console.log('tracks called');
        
        // Spotify API call
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

            // add each track to the array
            for (let i = 0; i < 20; i++) {
                userTop20T.push(data.items[i].name);
            }

            // send the current user's data to be included in the large data structure
            populateUserData(userName, userTop20T, "tracks");
        })
        .catch(function (error) { 
            console.log(error);
        });

    }, [populateUserData, token])

    /*
        getPlaybackState calls the Spotify Web API to get information on 
        the track the user is currently listening to
    */
    const getPlaybackState = useCallback(async () => {
        console.log("playback state called");
        
        // Spotify API call
        axios.get("https://api.spotify.com/v1/me/player",  {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(function (response) {
            // extract the track title and artist from the response
            const { data } = response;
            const currentTrack = data.item.name
            const currentArtist = data.item.album.artists[0].name

            // assign the data to the matching state values
            setPlayback(currentTrack)
            setPlaybackArtist(currentArtist)
        })
        .catch(function (error) { 
            console.log(error);
        });
    }, [token]);

    /*
        getUserProfile calls the Spotify Web API to get information
        about the current user's profile
    */
    const getUserProfile = useCallback(async () => {
        console.log("profile called");
        
        // Spotify API call
        axios.get("https://api.spotify.com/v1/me",  {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(function (response) {
            // extract the user's name and profile picture
            // and assign them to the matching state values
            const { data } = response;
            setUserName(data.display_name);
            setProfileImage(data.images[1].url)

            // send the user's name to be included in the data structure
            getTopArtists(userName);
            getTopTracks(userName);
        })
        .catch(function (error) { 
            console.log(error);
        });

    }, [getTopArtists, getTopTracks, userName, token])

    /*
        useEffect() assures the token is valid before the rest of the
        application's function run
    */
    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        console.log(token)
        console.log(hash)

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        // calls functioncs once token is valid
        if (token) {
            setToken(token)
            getUserProfile()
            getPlaybackState()
        }

    }, [getUserProfile, getPlaybackState])

    // redirect to Spotify authorization page when login button is clicked
    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
    };

    // opens a modal pop-up to display similarites between users
    const openModal = (selectedUser, type) => {
        var column;
        var similarities;

        // extract array of similar items based on user selected and type of item
        if (type === "Artists"){
            column = artistData[0].indexOf(selectedUser)
            similarities = artistData[2][column]
        }
        else if (type === "Tracks"){
            column = trackData[0].indexOf(selectedUser)
            similarities = trackData[2][column]
        }

        // assign data to matching state values to be displayed
        setType(type);
        setModalContent(similarities.join(', '));
        setModalVisible(true);
    }

    // closes the modal pop-up when the x is clicked
    const closeModal= () => setModalVisible(false);

    // displays the profile page by changing state value
    const renderProfile = () => {
        setProfilePage(true);
        setLeaderboardPage(false);
    }

    // displays the leaderboard page by changing state value
    const renderLeaderboard = () => {
        setLeaderboardPage(true)
        setProfilePage(false)
    }

    // display login page and reset token
    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    };

    /* 
        render components to create the UI of the applicaion using
        state values to communicate with the React components
    */
    return (
        <div className="App">
            <header className="App-header">
            
            {/*display the login page if the token is empty*/}
            {!token ? (
                <>
                    <h1 style={{ fontSize: '80px' }}>Welcome to SpotiFriend</h1>
                    <Button onClick={handleLogin} text="Login with Spotify"/>
                </>
            ) : (
                <>  
                    {/* if token is valid, default display after login is the leaderboard page
                        if leaderboard button page is clicked, the leaderboard page is displayed*/}
                    {leaderboardPage ? (
                        <>
                            {/*The leaderboard page includes a navigation bar and 2 leaderboards for artist/tracks*/}
                            <NavBar onProfile={renderProfile} onLeaderboard={renderLeaderboard} onLogout={logout}/>
                            <Leaderboard data={artistLeaderboard} type={"Artists"} onScoreClick={openModal} />
                            <Leaderboard data={trackLeaderboard} type={"Tracks"} onScoreClick={openModal} />
                        </>
                    ) : (
                        <>
                            {/*if the profile button is clicked, the profile page is displayed*/}
                            {profilePage ? (
                                <>  
                                    {/*The leaderboard page includes a navigation bar, the user's profile picture, the
                                    track the user is currently listening to, and 2 tables for the user's top 20 artists/tracks*/}
                                    <NavBar onProfile={renderProfile} onLeaderboard={renderLeaderboard} onLogout={logout}/>
                                    <img src={profileImage} alt="Profile" width="300" height="300" style={{ marginTop: '50px' }}/>
                                    <h1>{userName}</h1>
                                    <div style={{backgroundColor: '#4CAF50', color: 'white', padding: '0px 12px', textAlign: 'center', borderRadius: '8px'}}>
                                        <p style={{ fontSize: '16px' }}>Currently listening to: {playback} by {playbackArtist}</p>
                                    </div>
                                    <div>
                                        <td><Table data={artistData[1][0]} type="Artists"/></td>
                                        <td><Table data={trackData[1][0]} type="Tracks"/></td>
                                    </div>
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
            {/*the modal component renders when a user's score is clicked*/}
            <Modal show={modalVisible} onClose={closeModal} type= {type} array={modalContent}/>
        </div>
    );
}

// export the App to be rendered on the webpage
export default App;
