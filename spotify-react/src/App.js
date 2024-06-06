import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
    const CLIENT_ID = "2f4886cb98814cdb94ea0f9d5078901b"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])
    const [displayName, setDisplayName] = useState("");
    var top20Artists = {}; 


    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

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
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "displayName"
            }
        })
        
        setDisplayName(data.display_name)
    }

    const getTopArtists = async (e) => {
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists?limit=20", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })
        
        const topA = [];

        for (let i = 0; i < 20; i++) {
            topA.push(data.items[i].name);
        }
        
        top20Artists[displayName] = topA;
    }

    function populateLeaderboard(allUsers, currentUser, currentUserArtists) {
        for (var i=0; i < 20; i++) {
            currentList = allUsers[0][i]
        }
    }

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify React</h1>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=streaming%20user-read-email%20user-read-private%20user-top-read%20user-read-currently-playing`}>Login
                        to Spotify</a>
                    :<><form onSubmit={searchArtists}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)} />
                        <button type={"submit"}>Search</button>
                    </form><button onClick={logout}>Logout</button></>}
            </header>
            {renderArtists()}
        </div>
    );
}

export default App;
