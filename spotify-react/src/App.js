import React from 'react'
import './App.css';
import Leaderboard from './components/Leaderboard';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
    const CLIENT_ID = "2f4886cb98814cdb94ea0f9d5078901b"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-read-private user-top-read";

    const [token, setToken] = useState("")
    //const [searchKey, setSearchKey] = useState("")
    //const [artists, setArtists] = useState([])
    const [userName, setUserName] = useState("");
    const [unsortedLeaderboard, setUnsortedLeaderboard] = useState(new Map());
    //const [displayName, setDisplayName] = useState("");
    //var userName;
    //var userTopArtists;
    //var userData = [];
    //var sortedLeaderboard = new Map();


    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
        console.log(token)
        setToken(token)

    }, [])

    /*const searchArtists = async (e) => {
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })

        setArtists(data.artists.items)
    }

    const renderArtists = () => {
        console.log(artists);
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                {artist.name}
            </div>
        ))
    }*/

    const getUserProfile = async (e) => {
        console.log("called")
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            // params: {
            //     q: searchKey,
            //     type: "userN"
            // }
        });
        
        const userName = data.display_name;
        console.log(userName);
        getTopArtists(userName)
    }

    const getTopArtists = async (userName) => {
        console.log('artists called')
        const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists?limit=20", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            // params: {
            //     q: searchKey,
            //     type: "artist"
            // }
        });
        
        const userTop20A = [];

        for (let i = 0; i < 20; i++) {
            userTop20A.push(data.items[i].name);
        }
        
        console.log(userTop20A)
        populateUserData(userName, userTop20A);
    }

    const artistsPool = [
        "Taylor Swift", "Drake", "Billie Eilish", "Ariana Grande", "Ed Sheeran",
        "Post Malone", "Beyoncé", "Justin Bieber", "Conan Gray", "Kanye West",
        "Rihanna", "Adele", "Bruno Mars", "Kendrick Lamar", "The Weeknd",
        "Dua Lipa", "Harry Styles", "Olivia Rodrigo", "Shawn Mendes", "Travis Scott",
        "Sabrina Carpenter", "Lil Nas X", "Halsey", "Selena Gomez", "Laufey",
        "SZA", "Lana Del Rey", "Camila Cabello", "Gracie Abrams", "Miley Cyrus"
    ];
    

    function generateRandomArtists() {
            const randomArtists = [];
            for (let i = 0; i < 20; i++) {
                const randomIndex = Math.floor(Math.random() * artistsPool.length);
                randomArtists.push(artistsPool[randomIndex]);
            }
            return randomArtists;
    }
  
    function populateUserData(name, artistsArray0) {
        const artistsArray1 = generateRandomArtists();
        const artistsArray2 = generateRandomArtists();
        const artistsArray3 = generateRandomArtists();
        const artistsArray4 = generateRandomArtists();

        let userData = [
            [name, "Joe", "Katherine", "Andy", "Amanda"],
            [artistsArray0, artistsArray1, artistsArray2, artistsArray3, artistsArray4]
        ];

        populateLeaderboard(userData)
    }

    function populateLeaderboard(arrayData) {
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
        
    }

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>SpotiFriend</h1>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login
                        to Spotify</a>
                    :
                    <>
                        <form onSubmit={getUserProfile}>
                            {/*<input type="text" onChange={e => setSearchKey(e.target.value)} />*/}
                            <button type="submit"> Get User Profile </button>
                        </form> 
                        <button onClick={logout}>Logout</button>
                    </>
                }

                <Leaderboard data={unsortedLeaderboard}/>
            </header>
            {/*{renderArtists()}*/}
            
        </div>
        
    );
}

export default App;
