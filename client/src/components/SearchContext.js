// This file is for creating a context for the search results.

import React from 'react';

const SearchContext = React.createContext({
    results: [],
    setResults: () => {},
    isLoading: false,
    setIsLoading: () => {},
    searched: false,
    setSearched: () => {},
    Input: "",
    setInput: () => {},
    moviesPerPage: 12,
    currentPage: 1,
    setCurrentPage: () => {},
});

export default SearchContext;