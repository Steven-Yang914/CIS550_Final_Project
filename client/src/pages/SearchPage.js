import {SearchBar} from "../components/SearchBar";
import {SearchResultsList} from "../components/SearchResultsList";

import React, { useState } from 'react';

const SearchPage = () => {
    const [results, setResults] =  useState([]);

    return (
        <div className="search-page">
            <div className="search-bar-container">
                <SearchBar setResults = {setResults} />
                {results && results.length > 0 && <SearchResultsList results={results} />}
            </div>
        </div>
    );
};

export default SearchPage;
