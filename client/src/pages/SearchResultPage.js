import {SearchResultsList} from "../components/SearchResultsList";
import React from 'react';

const SearchResultsPage = () => {
    const [results, setResults] =  useState([]);

    return (
        <div className="search-page">
            <div className="search-bar-container">
                {results && results.length > 0 && <SearchResultsList results={results} />}
            </div>
        </div>
    );
};

export default SearchResultsPage;

// import {SearchBar} from "../components/SearchBar";
// import {SearchResultsList} from "../components/SearchResultsList";
//
// import React, { useState } from 'react';
//
// const SearchPage = () => {
//     const [results, setResults] =  useState([]);
//
//     return (
//         <div className="search-page">
//             <div className="search-bar-container">
//                 <SearchBar setResults = {setResults} />
//             </div>
//         </div>
//     );
// };
