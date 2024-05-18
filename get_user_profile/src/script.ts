// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId = "e667cde587c544508d5926555e9bfc39";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
    const topArtist = await fetchTopArtist(accessToken);
    populateUI2(topArtist);
    
}


async function fetchProfile(code: string): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}

async function fetchTopArtist(code: string): Promise<TopArtist> {
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=1h&offset=0&time_range=long_term", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}


function populateUI(profile: UserProfile) {
    console.log('hello');
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("avatar")!.setAttribute("src", profile.images[0].url)
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0].url;
}

function populateUI2(topArtist: TopArtist) {
    console.log(topArtist.items.name)
    document.getElementById("topA")!.innerText = topArtist.items.name;
}

