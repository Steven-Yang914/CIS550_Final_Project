import React, { useState, useEffect } from 'react';
import TopAvgRateMoviesTable from '../components/TopAvgRateMoviesTable';
import RandomDirectorMovies from '../components/RandomDirectorMovies';
import {SearchBar} from "../components/SearchBar";
import TopMoviesTable from "../components/TopMoviesTable";

function SearchPage() {
    const [showTopMovies, setShowTopMovies] = useState(false);

    useEffect(() => {
        // Generate a random boolean
        const randomBoolean = Math.random() < 0.5;
        setShowTopMovies(randomBoolean);
    }, []);

    return (
        <div className="search-page">
            <div className="search-bar-container">
                <SearchBar />
            </div>
            {showTopMovies ? <TopAvgRateMoviesTable /> : <RandomDirectorMovies />}
        </div>
    );
}

export default SearchPage;