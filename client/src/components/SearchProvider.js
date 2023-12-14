// This component provides a context for the search results. It is used in the SearchPage component.

import React, {useRef, useState} from 'react';
import SearchContext from './SearchContext';

export const SearchProvider = ({ children }) => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [Input, setInput] = useState("");
    const moviesPerPage = useRef(12);
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <SearchContext.Provider value={{ Input, setInput, results, setResults,
                                        isLoading, setIsLoading, searched, setSearched,
                                        moviesPerPage, currentPage, setCurrentPage}}>
            {children}
        </SearchContext.Provider>
    );
};