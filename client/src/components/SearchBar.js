import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import {Button} from "@mui/material";
import { useHistory } from "react-router-dom";
import "./SearchBar.css";

export const SearchBar = ({setResults}) => {
    const [input, setInput] = useState("");
    const history = useHistory();

    const fetchData = () => {
        if (input) {
            fetch(`http://${config.server_host}:${config.server_port}/search?searchTerm=${input}&requestDataType=movie`)
                .then((response) => response.json())
                .then((json) => {
                    setResults(json);
                    history.push('/search/results');
                });
        }
    };

    const handleChanges = (value) => {
        setInput(value);
    }

    return (
        <div className="Input-wrapper">
            <div className="input-container">
                <input
                    placeholder="Type here to search..."
                    value = {input}
                    onChange={(e) => handleChanges(e.target.value)}
                />
                <Button onClick={fetchData}>Search</Button>
                <FaSearch id = "search-icon"/>
            </div>
        </div>
    );
};

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
//             fetch(`http://${config.server_host}:${config.server_port}/search?searchTerm=${input}&requestDataType=movie`)
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
//         fetch(`http://${config.server_host}:${config.server_port}/search?searchTerm=${value}&requestDataType=${searchType.toLowerCase()}`)
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
//                     placeholder={`Type here to search for a ${searchType.toLowerCase()}...`}
//                     value = {input}
//                     onChange={(e) => handleChanges(e.target.value)}
//                 />
//                 <FaSearch id = "search-icon"/>
//             </div>
//         </div>
//     );
// };
