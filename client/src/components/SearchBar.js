// import React, {useContext, useState} from "react";
// import {FaSearch} from "react-icons/fa";
// import {Button} from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import "./SearchBar.css";
// import SearchContext from "./SearchContext";
//
// const config = require('../config.json');
//
// export const SearchBar = () => {
//     const [input, setInput] = useState("");
//     const [searchType, setSearchType] = useState("Movie");
//     // const navigate = useNavigate();
//     const { results, setResults, isLoading, setIsLoading, searched, setSearched } = useContext(SearchContext);
//
//     const fetchData = () => {
//         if (input) {
//             // Set isLoading to true before making the fetch request
//             setIsLoading(true);
//
//             fetch(`http://${config.server_host}:${config.server_port}/search?searchTerm=${input.toLowerCase()}&requestDataType=${searchType.toLowerCase()}`)
//                 .then((response) => response.json())
//                 .then((json) => {
//                     setResults(json);
//                     // Set isLoading and Searched to false after the results have been set
//                     setIsLoading(false);
//                     setSearched(true);
//                 });
//         }
//     };
//
//     const handleChanges = (value) => {
//         setInput(value);
//     }
//
//     const toggleSearchType = () => {
//         setSearchType(prevType => prevType === "Movie" ? "Person" : "Movie");
//     }
//
//     return (
//         <div className="Input-wrapper">
//             <div className="input-container">
//                 <Button onClick={toggleSearchType}>{searchType}</Button>
//                 <input
//                     placeholder="Type here to search..."
//                     value = {input}
//                     onChange={(e) => handleChanges(e.target.value)}
//                 />
//                 <Button onClick={fetchData}>Search</Button>
//                 <FaSearch id = "search-icon"/>
//             </div>
//         </div>
//     );
// };

// import React, {useState} from "react";
// import {FaSearch} from "react-icons/fa";
// import {Button} from "@mui/material";
// import { useHistory } from "react-router-dom";
// import "./SearchBar.css";
// import {SearchButton} from "./SearchButton";
//
// export const SearchBar = ({setResults}) => {
//     const [input, setInput] = useState("");
//     const history = useHistory();
//
//     const fetchData = () => {
//         if (input) {
//             fetch(http://${config.server_host}:${config.server_port}/search?searchTerm=${input}&requestDataType=movie)
//                 .then((response) => response.json())
//                 .then((json) => {
//                     setResults(json);
//                 });
//         }
//     };
//
//     const handleChanges = (value) => {
//         setInput(value);
//     }
//
//     return (
//         <div className="Input-wrapper">
//             <div className="input-container">
//                 <input
//                     placeholder="Type here to search..."
//                     value = {input}
//                     onChange={(e) => handleChanges(e.target.value)}
//                 />
//                 <SearchButton onClick={fetchData} />
//             </div>
//         </div>
//     );
// };

// import React, {useState} from "react";
// import {FaSearch} from "react-icons/fa";
// import "./SearchBar.css";
// import config from "../config.json";
// import {Button} from "@mui/material";
//
// export const SearchBar = ({setResults}) => {
//     const [input, setInput] = useState("");
//     const [searchType, setSearchType] = useState("Movie");
//
//     const fetchData = (value) => {
//         fetch(http://${config.server_host}:${config.server_port}/search?searchTerm=${value}&requestDataType=${searchType.toLowerCase()})
//             .then((response) => response.json())
//             .then((json) => {
//                 setResults(json);
//             });
//     };
//
//     const handleChanges = (value) => {
//         setInput(value);
//         fetchData(value);
//     }
//
//     const toggleSearchType = () => {
//         setSearchType(prevType => prevType === "Movie" ? "Person" : "Movie");
//     }
//     // const fetchData = (value) => {
//     //     fetch("https://jsonplaceholder.typicode.com/users")
//     //         .then((response) => response.json())
//     //         .then((json) => {
//     //             const results = json.filter((user) => {
//     //                 return (
//     //                     value &&
//     //                     user &&
//     //                     user.name &&
//     //                     user.name.toLowerCase().includes(value)
//     //                 );
//     //             });
//     //             setResults(results);
//     //     });
//     // };
//
//     return (
//         <div className="Input-wrapper">
//             <div className="input-container">
//                 <Button onClick={toggleSearchType}>{searchType}</Button>
//                 <input
//                     placeholder={Type here to search for a ${searchType.toLowerCase()}...}
//                     value = {input}
//                     onChange={(e) => handleChanges(e.target.value)}
//                 />
//                 <FaSearch id = "search-icon"/>
//             </div>
//         </div>
//     );
// };
