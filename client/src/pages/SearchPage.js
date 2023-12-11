import {SearchBar} from "../components/SearchBar";
import {SearchResultsList} from "../components/SearchResultsList";

import React, { useState } from 'react';

const SearchPage = () => {
    const [results, setResults] =  useState([]);

    return (
        <div className="search-page">
            <div className="search-bar-container">
                <SearchBar setResults = {setResults} />
            </div>
        </div>
    );
};
