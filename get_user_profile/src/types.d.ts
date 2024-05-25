interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: { spotify: string; };
    followers: { href: string; total: number; };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

interface TopArtist {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: ArtistItem[];
}

interface TopTrack {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: Item[];
}

interface Image {
    url: string;
    height: number;
    width: number;
}

interface ArtistItem {
    external_urls: { spotify: string; };
    followers: { href: string; total: number; };
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

interface TrackItem {
    album: {
        album_type: string;
        total_tracks: number;
        availabe_markets: string[]
        external_urls: {
            spotify: string;
        }
        href: string;
        id: string;
        images: Image[];
        name: string;
        release_date: string;
        release_date_precision: string;
        type: string;
        uri: string;
        
    }
}