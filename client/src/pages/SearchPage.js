import React, {useState, useEffect, useContext} from 'react';
import TopAvgRateMoviesTable from '../components/TopAvgRateMoviesTable';
import RandomDirectorMovies from '../components/RandomDirectorMovies';
import {Button, Container} from "@mui/material";
import SearchContext from "../components/SearchContext";
import {useLocation} from "react-router-dom";
import SearchResultsTable from "../components/SearchResultsTable";
import {FaSearch} from "react-icons/fa";
import "./SearchPage.css";
import SearchTypeButton from "../components/SearchTypeButton";

function SearchPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [input, setInput] = useState("");
    const [showTopMovies, setShowTopMovies] = useState(false);
    const {searched, setSearched, results, setResults, isLoading, setIsLoading, currentPage, setCurrentPage, clickNum, setClickNum} = useContext(SearchContext);
    const {searchType, setSearchType} = useContext(SearchContext);

    const startSearch = () => {
        if (input) {
            setIsLoading(true);
            setSearched(true);
            setCurrentPage(1);
            setClickNum(clickNum + 1);
            // Reset currentPage to 1 when a new search is started
        }
    }

    useEffect(() => {
        // Generate a random boolean
        const randomBoolean = Math.random() < 0.5;
        setShowTopMovies(randomBoolean);
    }, []);

    const handleChanges = (value) => {
        setInput(value);
    }

    return (
        <Container>
        <div className="search-page">
            <div className="search-bar-container">
                <div className="Input-wrapper">
                    <div className="input-container">
                        <SearchTypeButton />
                        <input
                            placeholder="Type here to search..."
                            value = {input}
                            onChange={(e) => handleChanges(e.target.value)}
                        />
                        <Button onClick={startSearch}>Search</Button>
                        <FaSearch id = "search-icon"/>
                    </div>
                </div>
            </div>
            {!searched ? (showTopMovies ? <TopAvgRateMoviesTable /> : <RandomDirectorMovies />)
                :
                (<SearchResultsTable searchTerm = {input.toLowerCase()} searchDataType={searchType.toLowerCase()} />)
            }
        </div>
        </Container>
    );
}

export default SearchPage;