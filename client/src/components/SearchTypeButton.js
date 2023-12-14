import React, {useContext} from "react";
import {FaSearch} from "react-icons/fa";
import {Button} from "@mui/material";
import SearchContext from "./SearchContext";

function SearchTypeButton(props) {
    const {searchType, setSearchType, setResults} = useContext(SearchContext);

    const toggleSearchType = () => {
        setSearchType(prevType => prevType === "Movie" ? "Person" : "Movie");
        setResults([]);
    }

    return (
        <Button onClick={toggleSearchType}>{searchType}</Button>
    );
}

export default SearchTypeButton;