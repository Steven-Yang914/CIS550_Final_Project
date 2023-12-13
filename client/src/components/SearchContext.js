// This file is for creating a context for the search results.

import React from 'react';

const SearchContext = React.createContext({
    results: [],
    setResults: () => {},
    isLoading: false,
    setIsLoading: () => {},
});

export default SearchContext;