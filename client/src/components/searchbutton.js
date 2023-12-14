import React from "react";
import {FaSearch} from "react-icons/fa";

export const SearchButton = ({ onClick }) => {
    return <FaSearch id="search-icon" onClick={onClick} />;
};