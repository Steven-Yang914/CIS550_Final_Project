// // import {SearchResultsList} from "../components/SearchResultsList";
// import { useLocation } from 'react-router-dom';
// import {SearchBar} from "../components/SearchBar";
// import {useContext, useEffect} from 'react';
// import React, { useState } from 'react';
// import SearchContext from "../components/SearchContext";
// import SearchResultsTable from "../components/SearchResultsTable";
//
// const config = require('../config.json');
//
// const SearchResultsPage = () => {
//     // const [results, setResults] =  useState([]);
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const searchTerm = params.get('searchTerm');
//     const searchType = params.get('requestDataType');
//     const { results, setResults } = useContext(SearchContext);
//
//     return (
//         <container>
//         <div className="search-page">
//             <div className="search-bar-container">
//                 <SearchBar />
//             </div>
//             {if () {
//                 <SearchResultsTable results={results} searchDataType={searchType} />
//             } else {
//                 <SearchResultsLis />
//             }}
//         </div>
//         </container>
//     );
// };
//
// export default SearchResultsPage;

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
