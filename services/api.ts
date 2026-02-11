export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchTrendingMovies = async ({ query }: { query: string }) => {
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${TMDB_CONFIG.BASE_URL}/trending/movie/day?language=en-US`;



    const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`)
    }

    const data = await response.json();

    return data.results;
}

export const fetchMovieDetails = async (id: number) => {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${id}?language=en-US`, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export const fetchMovieCredits = async (id: number) => {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${id}/credits?language=en-US`, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movie credits: ${response.statusText}`);
    }

    const data = await response.json();
    return data.cast;
}

export const fetchSimilarMovies = async (id: number) => {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${id}/similar?language=en-US&page=1`, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch similar movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
}
