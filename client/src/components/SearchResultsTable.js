import React, {useContext, useEffect, useState} from 'react';
import { Grid } from '@mui/material';
import { NavLink } from 'react-router-dom';
import SearchContext from "./SearchContext";


function SearchResultsTable({ results, searchDataType }) {
    const { isLoading, setIsLoading } = useContext(SearchContext);

    useEffect(() => {
        if (results) {
            setIsLoading(false);
        }
    }, [results]);


    if (!results || results.length === 0) {
        if (isLoading) {
            return (
            <div>
                <h2>Loading...</h2>
            </div>);
        } else {
            return (
            <div>;
                <h2>Search Results</h2>
                <div>No result for this search</div>
            </div>);}
    }
    return (
        <div>
            <h2>Search Results</h2>
            <Grid container>
                {results.map((item, index) => {
                    if (searchDataType === 'movie') {
                        console.log('movieid ', item.MovieID);
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
                                    {item.PrimaryTitle}
                                </NavLink>
                                <NavLink to={`/movie/${item.MovieID}`}>
                                    <div style={{ marginBottom: '20px' }}>
                                        {item.PosterURL && <img src={item.PosterURL} alt={item.PrimaryTitle} style={{ width: '180px', height: '200px' }} />}
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
                                    {item.Name}
                                </NavLink>
                            </Grid>
                        );
                    }
                })}
            </Grid>
        </div>
    )
}
export default SearchResultsTable;