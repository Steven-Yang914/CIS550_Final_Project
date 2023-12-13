// This component provides a context for the search results. It is used in the SearchPage component.

import React, { useState } from 'react';
import SearchContext from './SearchContext';

export const SearchProvider = ({ children }) => {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <SearchContext.Provider value={{ results, setResults, isLoading, setIsLoading }}>
            {children}
        </SearchContext.Provider>
    );
};