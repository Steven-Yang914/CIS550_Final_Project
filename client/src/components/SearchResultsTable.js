import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Grid} from '@mui/material';
import { NavLink } from 'react-router-dom';
import SearchContext from "./SearchContext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import config from "../config.json";


function SearchResultsTable({ searchTerm, searchDataType }) {
    const { isLoading, setIsLoading, results,
        setResults, setSearched, moviesPerPage } = useContext(SearchContext);
    const {currentPage, setCurrentPage, clickNum} = useContext(SearchContext);
    // const moviesPerPage = useRef(12)

    console.log("searchTerm passed in: ", searchTerm);
    console.log("searchDataType passed in: ", searchDataType);


    useEffect(() => {
        console.log("SearchTerm in useeffect", searchTerm);
        if (searchTerm) {
            console.log("SearchTerm in useeffect", searchTerm);
            console.log("SearchDataType in useeffect", searchDataType);
            setIsLoading(true);
            fetch(`http://${config.server_host}:${config.server_port}/search?searchTerm=${searchTerm.toLowerCase()}&requestDataType=${searchDataType.toLowerCase()}&page=${currentPage}&page_size=${moviesPerPage.current}`)
                .then((response) => response.json())
                .then((json) => {
                    setResults(json);
                    setIsLoading(false);
                    setSearched(true);
                });
        }
    }, [currentPage, clickNum]);



    useEffect(() => {
        if (results) {
            setIsLoading(false);
        }
    }, [results]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (!results || results.length === 0) {
        if (isLoading) {
            return (
                <div>
                    <h2>Loading...</h2>
                </div>);
        } else {
            return (
                <div>
                    <h2>Search Results</h2>
                    <div>No result for this search</div>
                </div>);
        }
    }
    return (
        <div>
            <h2>Search Results</h2>
            <Grid container>
                {results.map((item, index) => {
                    const globalIndex = (currentPage - 1) * moviesPerPage.current + index + 1;
                    if (searchDataType === 'movie') {
                        // Render movie layout
                        return (
                            <Grid item xs={3} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <NavLink
                                    to={`/movie/${item.MovieID}`}
                                    style={{
                                        textAlign: 'center',
                                        maxWidth: '180px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        textDecoration: 'none',
                                        color: '#333',
                                    }}
                                >
                                    <span>{globalIndex}. </span>
                                    {item.PrimaryTitle}
                                </NavLink>
                                <NavLink to={`/movie/${item.MovieID}`}>
                                    <div style={{ marginBottom: '20px' }}>
                                        {item.PosterURL && <img
                                            src={item.PosterURL}
                                            alt={item.PrimaryTitle}
                                            style={{ width: '180px', height: '200px' }}
                                            onError={(e) =>
                                            {e.target.onerror = null; e.target.src="https://demofree.sirv.com/nope-not-here.jpg"}}
                                        />}
                                    </div>
                                </NavLink>
                            </Grid>
                        );
                    } else if (searchDataType === 'person') {
                        // Render person layout
                        return (
                            <Grid item xs={3} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <NavLink
                                    to={`/person/${item.PersonID}`}
                                    style={{
                                        textAlign: 'center',
                                        maxWidth: '180px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        textDecoration: 'none',
                                        color: '#333',
                                    }}
                                >
                                    <span style={{ marginBottom: "20px"}}>{ globalIndex}. </span>
                                    {item.name}
                                </NavLink>
                            </Grid>
                        );
                    }
                })}
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    style={{ marginRight: '10px', background: currentPage === 1 ? '#999' : '#333', color: 'white' }}
                >
                    <NavigateBeforeIcon />
                </Button>
                <Button
                    disabled={results.length < moviesPerPage.current}
                    onClick={() => paginate(currentPage + 1)}
                    style={{ background: results.length < moviesPerPage.current ? '#999' : '#333', color: 'white' }}
                >
                    <NavigateNextIcon />
                </Button>
            </div>
        </div>
    )
}
export default SearchResultsTable;

// function SearchResultsTable({ results, searchDataType }) {
//     const { isLoading, setIsLoading } = useContext(SearchContext);
//
//     useEffect(() => {
//         if (results) {
//             setIsLoading(false);
//         }
//     }, [results]);
//
//
//     if (!results || results.length === 0) {
//         if (isLoading) {
//             return (
//             <div>
//                 <h2>Loading...</h2>
//             </div>);
//         } else {
//             return (
//             <div>;
//                 <h2>Search Results</h2>
//                 <div>No result for this search</div>
//             </div>);}
//     }
//     return (
//         <div>
//             <h2>Search Results</h2>
//             <Grid container>
//                 {results.map((item, index) => {
//                     if (searchDataType === 'movie') {
//                         console.log('movieid ', item.MovieID);
//                         // Render movie layout
//                         return (
//                             <Grid item xs={3} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                                 <NavLink
//                                     to={`/movie/${item.MovieID}`}
//                                     style={{
//                                         textAlign: 'center',
//                                         maxWidth: '180px',
//                                         overflow: 'hidden',
//                                         textOverflow: 'ellipsis',
//                                         whiteSpace: 'nowrap',
//                                         textDecoration: 'none',
//                                         color: '#333',
//                                     }}
//                                 >
//                                     {item.PrimaryTitle}
//                                 </NavLink>
//                                 <NavLink to={`/movie/${item.MovieID}`}>
//                                     <div style={{ marginBottom: '20px' }}>
//                                         {item.PosterURL && <img src={item.PosterURL} alt={item.PrimaryTitle} style={{ width: '180px', height: '200px' }} />}
//                                     </div>
//                                 </NavLink>
//                             </Grid>
//                         );
//                     } else if (searchDataType === 'person') {
//                         // Render person layout
//                         return (
//                             <Grid item xs={3} key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                                 <NavLink
//                                     to={`/person/${item.PersonID}`}
//                                     style={{
//                                         textAlign: 'center',
//                                         maxWidth: '180px',
//                                         overflow: 'hidden',
//                                         textOverflow: 'ellipsis',
//                                         whiteSpace: 'nowrap',
//                                         textDecoration: 'none',
//                                         color: '#333',
//                                     }}
//                                 >
//                                     {item.Name}
//                                 </NavLink>
//                             </Grid>
//                         );
//                     }
//                 })}
//             </Grid>
//         </div>
//     )
// }
// export default SearchResultsTable;